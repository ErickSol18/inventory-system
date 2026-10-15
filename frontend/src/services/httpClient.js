import axios from 'axios';

/**
 * Centralized HTTP Client implementing the Facade & Adapter pattern.
 * Encapsulates Axios configurations, request/response interceptors,
 * and unified error normalization for all application services.
 */
class HttpClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    this._initializeInterceptors();
  }

  /**
   * Configure global request and response interceptors
   * @private
   */
  _initializeInterceptors() {
    // Request Interceptor: centralized header/token manipulation
    this.client.interceptors.request.use(
      (config) => {
        // Easily extendable for authentication headers (e.g., Bearer tokens):
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: automatic unwrapping of response.data & uniform error normalization
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const normalizedError = {
          status: error.response?.status || 0,
          message:
            error.response?.data?.message ||
            (error.code === 'ECONNABORTED'
              ? 'El tiempo de espera de la solicitud ha expirado (timeout).'
              : null) ||
            error.message ||
            'Error inesperado al comunicarse con el servidor.',
          validationErrors: error.response?.data?.validationErrors || null,
          data: error.response?.data || null,
          response: error.response, // preserved for backward-compatibility
          rawError: error,
        };
        return Promise.reject(normalizedError);
      }
    );
  }

  /**
   * Generic GET request
   * @param {string} url
   * @param {Object} [config]
   * @returns {Promise<any>}
   */
  get(url, config = {}) {
    return this.client.get(url, config);
  }

  /**
   * Generic POST request
   * @param {string} url
   * @param {any} [data]
   * @param {Object} [config]
   * @returns {Promise<any>}
   */
  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  /**
   * Generic PUT request
   * @param {string} url
   * @param {any} [data]
   * @param {Object} [config]
   * @returns {Promise<any>}
   */
  put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  /**
   * Generic DELETE request
   * @param {string} url
   * @param {Object} [config]
   * @returns {Promise<any>}
   */
  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

// Export default singleton instance for application-wide consumption
export const httpClient = new HttpClient();
export default httpClient;
