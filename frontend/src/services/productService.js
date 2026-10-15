import httpClient from './httpClient';

/**
 * Product Service - Encapsulates API interactions for inventory products.
 * Uses centralized HttpClient to ensure DRY principles, centralized interceptors,
 * and unified error normalization across all requests.
 */
export const productService = {
  /**
   * Fetch all products with optional filters
   * @param {string} [search]
   * @param {string} [category]
   * @returns {Promise<Array>}
   */
  getAll(search = '', category = '') {
    const params = {};
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    if (category && category !== 'ALL') {
      params.category = category;
    }
    return httpClient.get('/products', { params });
  },

  /**
   * Fetch a single product by ID
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  getById(id) {
    return httpClient.get(`/products/${id}`);
  },

  /**
   * Create a new product
   * @param {Object} productData
   * @returns {Promise<Object>}
   */
  create(productData) {
    return httpClient.post('/products', productData);
  },

  /**
   * Update an existing product
   * @param {number|string} id
   * @param {Object} productData
   * @returns {Promise<Object>}
   */
  update(id, productData) {
    return httpClient.put(`/products/${id}`, productData);
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
