import Stripe from "stripe";

import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return Response.json(null, { status: 400 });
  }

  // Verify the webhook Signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed.", err);
    return Response.json(null, { status: 400 });
  }

  // fulfill order
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email ?? session.customer_details?.email;
      if (!email) return Response.json(null, { status: 400 });

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          hasPaid: true,
        },
      });
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  return Response.json(null, { status: 200 });
}
