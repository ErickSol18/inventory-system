import { useState, useEffect, useCallback, useMemo } from 'react';
import productService from '../services/productService';

/**
 * Custom hook to manage inventory products state, filtering,
 * search debounce, CRUD operations and computed metrics.
 *
 * @param {Object} [options]
 * @param {Function} [options.onError] - Global error handler callback
 */
export const useProducts = ({ onError } = {}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  /**
   * Fetch products from backend with current filters applied
   */
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAll(searchTerm, selectedCategory);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products in useProducts:', error);
      onError?.(error.message || 'No se pudo conectar con el servidor backend.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, onError]);

  // Debounced execution when search term or category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Compute dynamic categories present in the inventory
  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((p) => p.category?.trim())
          .filter(Boolean)
      )
    ).sort();
  }, [products]);

  // Compute live dashboard metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const value = products.reduce((acc, p) => acc + p.totalValue(), 0);
    const lowStock = products.filter((p) => p.isLowStock() || p.isOutOfStock()).length;
    const categoriesCount = categories.length;

    return {
      total,
      value,
      lowStock,
      categoriesCount,
    };
  }, [products, categories]);

  /**
   * Create a new product
   * @param {Object} payload
   * @returns {Promise<Product>}
   */
  const createProduct = async (payload) => {
    const created = await productService.create(payload);
    await fetchProducts();
    return created;
  };

  /**
   * Update an existing product
   * @param {number|string} id
   * @param {Object} payload
   * @returns {Promise<Product>}
   */
  const updateProduct = async (id, payload) => {
    const updated = await productService.update(id, payload);
    await fetchProducts();
    return updated;
  };

  /**
   * Delete a product by ID
   * @param {number|string} id
   * @returns {Promise<void>}
   */
  const deleteProduct = async (id) => {
    await productService.delete(id);
    await fetchProducts();
  };

  return {
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    metrics,
    reload: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;
