import { CURRENCY_CONFIG, LOW_STOCK_THRESHOLD } from '../constants/inventory';

/**
 * @typedef {Object} ProductData
 * @property {number|null} [id] - Unique product identifier
 * @property {string} name - Product name (required)
 * @property {string|null} [description] - Product description (optional)
 * @property {number} price - Unit monetary price > 0
 * @property {number} stock - Available inventory quantity >= 0
 * @property {string|null} [category] - Product category
 * @property {string|null} [createdAt] - Creation ISO timestamp
 * @property {string|null} [updatedAt] - Last update ISO timestamp
 */

/**
 * Product Domain Model - Encapsulates product properties,
 * business invariants, and formatting operations.
 */
export class Product {
  /**
   * @param {ProductData} data
   */
  constructor({
    id = null,
    name = '',
    description = '',
    price = 0,
    stock = 0,
    category = '',
    createdAt = null,
    updatedAt = null,
  } = {}) {
    this.id = id !== null && id !== undefined ? Number(id) : null;
    this.name = String(name || '').trim();
    this.description = description ? String(description).trim() : '';
    this.price = Number(price) || 0;
    this.stock = Number(stock) || 0;
    this.category = category ? String(category).trim() : '';
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Factory method to instantiate Product from API response data
   * @param {Object} raw
   * @returns {Product}
   */
  static fromApi(raw = {}) {
    if (!raw) return Product.empty();
    return new Product(raw);
  }

  /**
   * Factory method to instantiate an empty Product for creation forms
   * @returns {Product}
   */
  static empty() {
    return new Product({});
  }

  /**
   * Check if product is out of stock (stock <= 0)
   * @returns {boolean}
   */
  isOutOfStock() {
    return this.stock <= 0;
  }

  /**
   * Check if product is on low stock threshold
   * @param {number} [threshold=LOW_STOCK_THRESHOLD]
   * @returns {boolean}
   */
  isLowStock(threshold = LOW_STOCK_THRESHOLD) {
    return this.stock > 0 && this.stock <= threshold;
  }

  /**
   * Format product unit price in Quetzales (GTQ)
   * @returns {string}
   */
  formattedPrice() {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
    }).format(this.price);
  }

  /**
   * Calculate total monetary value of this product inventory (price * stock)
   * @returns {number}
   */
  totalValue() {
    return this.price * this.stock;
  }

  /**
   * Prepare serialized payload for backend ProductRequestDto
   * @returns {Object}
   */
  toPayload() {
    return {
      name: this.name,
      description: this.description || null,
      price: this.price,
      stock: this.stock,
      category: this.category || null,
    };
  }
}

export default Product;
