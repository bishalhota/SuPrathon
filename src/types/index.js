// Type definitions for reference (JSDoc comments)

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} image_url
 * @property {string} category
 * @property {number} carbon_rating
 * @property {number} stock_quantity
 * @property {string} created_at
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {number} eco_coins
 * @property {string} created_at
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} user_id
 * @property {string} product_id
 * @property {number} quantity
 * @property {string} created_at
 * @property {Product} [product]
 */

/**
 * @typedef {Object} CartContextType
 * @property {CartItem[]} items
 * @property {function(Product, number=): void} addToCart
 * @property {function(string): void} removeFromCart
 * @property {function(string, number): void} updateQuantity
 * @property {function(): void} clearCart
 * @property {number} total
 * @property {number} itemCount
 */

export {};