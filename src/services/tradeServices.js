import { supabase } from "../lib/supabaseClient";

export const tradeServices = {
  // Function to read all trades
  getAllTrades: async () => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trades:", error);
      throw error;
    }
    return data;
  },

  // Function to read a trade by ID
  getTradeById: async (id) => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching trade by ID:", error);
      throw error;
    }

    return data;
  },

  // Function to get trades for a specific user
  getTradesByUser: async (userId) => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trades by user:", error);
      throw error;
    }
    return data;
  },

  // Function to delete a trade by ID
  deleteTradeById: async (id) => {
    const { data, error } = await supabase.from("trades").delete().eq("id", id);

    if (error) {
      console.error("Error deleting trade by ID:", error);
      throw error;
    }

    return data;
  },

  // Function to update a trade by ID
  updateTradeById: async (id, updatedFields) => {
    const { data, error } = await supabase
      .from("trades")
      .update(updatedFields)
      .eq("id", id);

    if (error) {
      console.error("Error updating trade by ID:", error);
      throw error;
    }
    return data;
  },

  // Function to create a new trade

  createTrade: async (tradeData) => {
    const { data, error } = await supabase.from("trades").insert([tradeData]);

    if (error) {
      console.error("Error creating new trade:", error);
      throw error;
    }

    return data;
  },
  // Ensure a profile exists for userId (optional) then create the trade
  saveTradeWithProfileCheck: async (userId, tradePayload) => {
    try {
      // Try to find an existing profile row
      const { data: profile, error: selErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (!profile) {
        // Insert a minimal profile record if none exists
        const { data: ins, error: insErr } = await supabase
          .from("profiles")
          .insert([
            { id: userId, username: `user_${String(userId).slice(0, 5)}` },
          ]);
        if (insErr) console.warn("Could not create profile:", insErr);
      }
    } catch (err) {
      // non-fatal: continue to attempt creating trade
      console.warn("Profile check failed (continuing):", err);
    }

    // now save trade; merge user_id to payload to be safe
    const { data, error } = await supabase
      .from("trades")
      .insert([{ ...tradePayload, user_id: userId }]);

    if (error) {
      console.error(
        "Error creating trade in saveTradeWithProfileCheck:",
        error
      );
      throw error;
    }

    return data;
  },
};
