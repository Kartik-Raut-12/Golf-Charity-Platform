import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import supabase from "./config/supabase.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import charityRoutes from "./routes/charity.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import winnerRoutes from "./routes/winner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "http://localhost:5173";
app.use(cors({
  origin: clientUrl,
  credentials: true
}));

app.use(cookieParser());

// Webhook for Stripe - REQUIRES RAW BODY
app.use("/api/webhook", webhookRoutes);

app.use(express.json());



app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/charity", charityRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/winner", winnerRoutes);
app.use("/api/admin", adminRoutes);

export default app;