import { supabase } from "./supabase.js";

// Products
export const getProducts = async (filters = {}) => {
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name,
        description
      )
    `
    )
    .eq("is_active", true);

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.excludeId) {
    query = query.neq("id", filters.excludeId);
  }

  if (filters.minCarbonRating) {
    query = query.gte("carbon_rating", filters.minCarbonRating);
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-low":
        query = query.order("price", { ascending: true });
        break;
      case "price-high":
        query = query.order("price", { ascending: false });
        break;
      case "carbon-rating":
        query = query.order("carbon_rating", { ascending: false });
        break;
      default:
        query = query.order("name", { ascending: true });
    }
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getProduct = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
};

// Users
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUser = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserEcoCoins = async (userId, ecoCoins) => {
  const { data, error } = await supabase
    .from("users")
    .update({ eco_coins: ecoCoins, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Cart
export const getCartItems = async (userId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      products (*)
    `
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert([{ user_id: userId, product_id: productId, quantity }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFromCart = async (cartItemId) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) throw error;
  return true;
};

export const clearCart = async (userId) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
  return true;
};

// Orders
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createOrderItems = async (orderItems) => {
  const { data, error } = await supabase
    .from("order_items")
    .insert(orderItems)
    .select();

  if (error) throw error;
  return data;
};

export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (*)
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Carbon Offsets
export const createCarbonOffset = async (offsetData) => {
  const { data, error } = await supabase
    .from("carbon_offsets")
    .insert([offsetData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserCarbonOffsets = async (userId) => {
  const { data, error } = await supabase
    .from("carbon_offsets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Carbon Savings
export const createCarbonSaving = async (savingData) => {
  const { data, error } = await supabase
    .from("carbon_savings")
    .insert([savingData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserCarbonSavings = async (userId) => {
  const { data, error } = await supabase
    .from("carbon_savings")
    .select(
      `
      *,
      products (name, image_url)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getGlobalImpactStats = async () => {
  const { data, error } = await supabase
    .from("global_impact_stats")
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const updateGlobalImpactStats = async () => {
  const { error } = await supabase.rpc("update_global_impact_stats");
  if (error) throw error;
  return true;
};
