import httpClient from './httpClient';
import Product from '../models/Product';

/**
 * Product Service - Encapsulates REST API interactions for inventory products.
 * Uses centralized HttpClient and deserializes responses into Product domain model instances.
 */
export const productService = {
  /**
   * Fetch all products with optional filters
   * @param {string} [search]
   * @param {string} [category]
   * @returns {Promise<Array<Product>>}
   */
  async getAll(search = '', category = '') {
    const params = {};
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    if (category && category !== 'ALL') {
      params.category = category;
    }
    const data = await httpClient.get('/products', { params });
    return Array.isArray(data) ? data.map(Product.fromApi) : [];
  },

  /**
   * Fetch a single product by ID
   * @param {number|string} id
   * @returns {Promise<Product>}
   */
  async getById(id) {
    const data = await httpClient.get(`/products/${id}`);
    return Product.fromApi(data);
  },

  /**
   * Create a new product
   * @param {Object} productData
   * @returns {Promise<Product>}
   */
  async create(productData) {
    const payload = productData instanceof Product ? productData.toPayload() : productData;
    const data = await httpClient.post('/products', payload);
    return Product.fromApi(data);
  },

  /**
   * Update an existing product
   * @param {number|string} id
   * @param {Object} productData
   * @returns {Promise<Product>}
   */
  async update(id, productData) {
    const payload = productData instanceof Product ? productData.toPayload() : productData;
    const data = await httpClient.put(`/products/${id}`, payload);
    return Product.fromApi(data);
  },

  /**
   * Delete a product by ID
   * @param {number|string} id
   * @returns {Promise<void>}
   */
  delete(id) {
    return httpClient.delete(`/products/${id}`);
  },
};

export default productService;
