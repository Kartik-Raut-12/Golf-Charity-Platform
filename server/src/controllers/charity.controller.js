import supabase from "../config/supabase.js";
import cloudinary from "../config/cloudinary.js";

export const getCharities = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("charities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const selectCharity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { charity_id, charity_percentage } = req.body;

    if (!charity_id) {
      return res.status(400).json({ message: "Charity is required" });
    }

    const percentage = Number(charity_percentage ?? 10);

    if (percentage < 10) {
      return res.status(400).json({ message: "Minimum charity percentage is 10" });
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        charity_id,
        charity_percentage: percentage,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({
      message: "Charity selected successfully",
      user: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addCharity = async (req, res) => {
  try {
    const { name, description, featured } = req.body;
    let imageUrl = null;

    if (req.file) {
      const uploadToCloudinary = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "golf-charity/charities" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await uploadToCloudinary();
      imageUrl = result.secure_url;
    }

    const { data, error } = await supabase
      .from("charities")
      .insert({
        name,
        description,
        featured: featured === "true" || featured === true,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    return res.status(201).json({ message: "Charity added", charity: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, featured } = req.body;

    const updates = {
      name,
      description,
      featured: featured === "true" || featured === true,
    };

    if (req.file) {
      const uploadToCloudinary = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "golf-charity/charities" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await uploadToCloudinary();
      updates.image_url = result.secure_url;
    }

    const { data, error } = await supabase
      .from("charities")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    return res.status(200).json({ message: "Charity updated", charity: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCharity = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("charities").delete().eq("id", id);

    if (error) return res.status(500).json({ message: error.message });

    return res.status(200).json({ message: "Charity deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};