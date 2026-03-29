import supabase from "../config/supabase.js";

export const addScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { score, played_at } = req.body;
    // ❗ Prevent future dates
    const today = new Date();
    const playedDate = new Date(played_at);

    // remove time part for accurate comparison
    today.setHours(0, 0, 0, 0);
    playedDate.setHours(0, 0, 0, 0);

    if (playedDate > today) {
      return res.status(400).json({
        message: "Future dates are not allowed",
      });
    }
    if (!score || !played_at) {
      return res.status(400).json({ message: "Score and date required" });
    }

    if (score < 1 || score > 45) {
      return res.status(400).json({ message: "Score must be between 1 and 45" });
    }

    // 1. Get existing scores (latest first)
    const { data: scores, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // 2. If already 5 scores → delete oldest
    if (scores.length >= 5) {
      const oldest = scores[scores.length - 1];

      await supabase
        .from("scores")
        .delete()
        .eq("id", oldest.id);
    }

    // 3. Insert new score
    const { data, error: insertError } = await supabase
      .from("scores")
      .insert([
        {
          user_id: userId,
          score,
          played_at,
        },
      ])
      .select();

    if (insertError) {
      return res.status(500).json({ message: insertError.message });
    }

    return res.status(201).json({
      message: "Score added successfully",
      data,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getScores = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("played_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json(data);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};