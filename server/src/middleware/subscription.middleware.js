import supabase from "../config/supabase.js";

const subscriptionMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: user, error } = await supabase
      .from("users")
      .select("subscription_status, renewal_date")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const renewalDate = user.renewal_date ? new Date(user.renewal_date) : null;

    if (!renewalDate || renewalDate < now) {
      await supabase
        .from("users")
        .update({
          subscription_status: "lapsed",
        })
        .eq("id", userId);

      return res.status(403).json({
        message: "Your subscription has expired. Please renew it.",
      });
    }

    if (user.subscription_status !== "active") {
      return res.status(403).json({
        message: "Active subscription required",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default subscriptionMiddleware;