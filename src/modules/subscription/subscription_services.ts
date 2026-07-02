import { envVars } from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSessionServices = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subcription: true,
      },
    });
    let stripeCustomerId = user.subcription?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
    };
    const session = await stripe.checkout.sessions.create({
        line_items:[{
            price: envVars.STRIPE_PRICE_ID,
            quantity: 1,
        }],
        mode: "subscription",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        success_url:`${envVars.APP_URL}/premium?success=true`,
        cancel_url:`${envVars.APP_URL}/payment?success=false`,
        metadata:{userId: user.id}
    });
    return session.url
  });
  return {
    paymentUrl: transactionResult
  }
};
export const subscriptionServices = {
  createCheckoutSessionServices,
};
