import { supabase } from "../lib/supabaseClient";

export const tradeServices = {
  // Function to read all trades
  getAllTrades: async () => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Function to read a trade by ID
  getTradeById: async (id) => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Function to get trades for a specific user
  getTradesByUser: async (userId) => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Function to delete a trade by ID
  deleteTradeById: async (id) => {
    const { data, error } = await supabase.from("trades").delete().eq("id", id);

    if (error) throw error;
    return data;
  },

  // Function to update a trade by ID
  updateTradeById: async (id, updatedFields) => {
    const { data, error } = await supabase
      .from("trades")
      .update(updatedFields)
      .eq("id", id);

    if (error) throw error;
    return data;
  },

  // Function to create a new trade

  createTrade: async (tradeData) => {
    const { data, error } = await supabase.from("trades").insert([tradeData]);

    if (error) throw error;
    return data;
  },
  // Ensure a profile exists for userId (optional) then create the trade
  saveTradeWithProfileCheck: async (userId, tradePayload) => {
    try {
      // Try to ensure a minimal profile row exists. Insert only the `id` field
      // because some schemas don't have `username` or other columns.
      const { error: upsertErr } = await supabase
        .from("profiles")
        .upsert([{ id: userId }], { onConflict: "id" });

      if (upsertErr) {
        // If profile can't be created, abort so we don't violate FK on trades
        throw upsertErr;
      }
    } catch (err) {
      // Stop execution and surface the error so the caller can handle it
      throw err;
    }

    // now save trade; merge user_id to payload to be safe
    const { data, error } = await supabase
      .from("trades")
      .insert([{ ...tradePayload, user_id: userId }]);

    if (error) throw error;
    return data;
  },
};
