import supabase from "../config/supabase.js";
import cloudinary from "../config/cloudinary.js";

export const uploadWinnerProof = async (req, res) => {
  try {
    const userId = req.user.id;
    const winnerId = req.body.winnerId;

    if (!winnerId) {
      return res.status(400).json({ message: "winnerId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Proof file is required" });
    }

    const { data: winner, error: findError } = await supabase
      .from("winners")
      .select("*")
      .eq("id", winnerId)
      .eq("user_id", userId)
      .single();

    if (findError) {
      return res.status(500).json({ message: findError.message });
    }

    if (!winner) {
      return res.status(404).json({ message: "Winner record not found" });
    }

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "golf-charity/winner-proofs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

    const result = await uploadToCloudinary();

    const { data, error } = await supabase
      .from("winners")
      .update({
        proof_url: result.secure_url,
        verification_status: "pending",
      })
      .eq("id", winnerId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({
      message: "Proof uploaded successfully",
      winner: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyWinnings = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("winners")
      .select(`
        id,
        match_type,
        prize_amount,
        proof_url,
        verification_status,
        payment_status,
        created_at,
        draws(draw_month, draw_year)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};