import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AlertToast from './components/AlertToast';
import productService from './services/productService';

export function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch products from backend REST API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAll(searchTerm, selectedCategory);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast(
        'No se pudo conectar con el servidor backend. Verifique que el servicio esté activo.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    // Debounce search slightly to avoid excessive calls
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  // Extract unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(
      products
        .map((p) => p.category?.trim())
        .filter(Boolean)
    )
  ).sort();

  // Create or Update handler
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors({});

    try {
      if (editingProduct?.id) {
        // Update product
        const updated = await productService.update(editingProduct.id, formData);
        showToast(`Producto "${updated.name}" actualizado exitosamente.`);
      } else {
        // Create product
        const created = await productService.create(formData);
        showToast(`Producto "${created.name}" registrado exitosamente.`);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response?.data?.validationErrors) {
        setServerErrors(error.response.data.validationErrors);
        showToast('Por favor corrija los campos marcados.', 'error');
      } else {
        const msg = error.response?.data?.message || 'Error inesperado al guardar el producto.';
        showToast(msg, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product handler
  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await productService.delete(id);
      showToast('Producto eliminado exitosamente del inventario.');
      setIsDeleteOpen(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      const msg = error.response?.data?.message || 'Error al eliminar el producto.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setServerErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setServerErrors({});
    setIsFormOpen(true);
  };

  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Catálogo de Inventario
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Administración centralizada de productos, existencias y precios en tiempo real.
            </p>
          </div>
        </div>

        {/* Top KPIs Summary */}
        <StatsOverview products={products} />

        {/* Main Product Table / CRUD View */}
        <ProductTable
          products={products}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={uniqueCategories}
          onAddNew={handleOpenCreate}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onRefresh={fetchProducts}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p>
            Prueba Técnica Desarrollador/a Full Stack Junior •{' '}
            <span className="font-semibold text-slate-700">Technology Factory Consulting</span>
          </p>
          <p className="mt-1 text-slate-400">
            Stack: Java 17 (Spring Boot 3.x) + React (Vite) + PostgreSQL 16 + Docker Compose
          </p>
        </div>
      </footer>

      {/* Modals and Toasts */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        product={deletingProduct}
        isDeleting={isDeleting}
      />

      <AlertToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
