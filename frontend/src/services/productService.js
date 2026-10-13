import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const productService = {
  /**
   * Fetch all products with optional filters
   * @param {string} [search]
   * @param {string} [category]
   * @returns {Promise<Array>}
   */
  async getAll(search = '', category = '') {
    const params = {};
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    if (category && category !== 'ALL') {
      params.category = category;
    }
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  /**
   * Fetch a single product by ID
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product
   * @param {Object} productData
   * @returns {Promise<Object>}
   */
  async create(productData) {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  /**
   * Update an existing product
   * @param {number|string} id
   * @param {Object} productData
   * @returns {Promise<Object>}
   */
  async update(id, productData) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a product by ID
   * @param {number|string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await apiClient.delete(`/products/${id}`);
  },
};

export default productService;
