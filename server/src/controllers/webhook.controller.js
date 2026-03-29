import stripe from "../config/stripe.js";
import supabase from "../config/supabase.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  try {
    switch (event.type) {
      case "checkout.session.completed":
        // Handle initial subscription completion
        await handleSubscriptionSuccess(session);
        break;

      case "invoice.paid":
        // Handle recurring payment success
        await handleSubscriptionRenewal(session);
        break;

      case "customer.subscription.deleted":
        // Handle cancellation or non-payment expiry
        await handleSubscriptionExpiry(session);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handleSubscriptionSuccess = async (session) => {
  const userId = session.metadata.userId;
  const plan = session.metadata.plan;
  const stripeCustomerId = session.customer;
  const stripeSubscriptionId = session.subscription;

  const renewalDate = new Date();
  if (plan === "monthly") {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  } else {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  }

  // Update User Status
  await supabase
    .from("users")
    .update({
      subscription_status: "active",
      subscription_plan: plan,
      renewal_date: renewalDate.toISOString(),
    })
    .eq("id", userId);

  // Sync Subscriptions Table
  const amount = plan === "monthly" 
    ? Number(process.env.STRIPE_MONTHLY_AMOUNT) 
    : Number(process.env.STRIPE_YEARLY_AMOUNT);

  await supabase
    .from("subscriptions")
    .upsert({
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      plan,
      amount,
      status: "active",
      start_date: new Date().toISOString(),
      end_date: renewalDate.toISOString(),
    }, { onConflict: 'stripe_subscription_id' });
};

const handleSubscriptionRenewal = async (session) => {
  if (session.billing_reason === "subscription_cycle") {
    const stripeSubscriptionId = session.subscription;
    
    // Retrieve subscription from Stripe to get metadata if needed
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const userId = subscription.metadata.userId;
    const plan = subscription.metadata.plan;

    const renewalDate = new Date();
    if (plan === "monthly") {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    await supabase
      .from("users")
      .update({
        subscription_status: "active",
        renewal_date: renewalDate.toISOString(),
      })
      .eq("id", userId);

    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        end_date: renewalDate.toISOString(),
      })
      .eq("stripe_subscription_id", stripeSubscriptionId);
  }
};

const handleSubscriptionExpiry = async (session) => {
  const stripeSubscriptionId = session.id;

  await supabase
    .from("subscriptions")
    .update({ status: "expired" })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  // Fetch the user associated with this sub to update profile
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .single();

  if (sub) {
    await supabase
      .from("users")
      .update({ subscription_status: "expired" })
      .eq("id", sub.user_id);
  }
};
