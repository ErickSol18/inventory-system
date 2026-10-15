import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AlertToast from './components/AlertToast';
import useProducts from './hooks/useProducts';
import useToast from './hooks/useToast';

export function App() {
  const { toast, showSuccess, showError, hideToast } = useToast();

  const {
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    metrics,
    reload,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts({ onError: showError });

  // Modal UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Submission Handler
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors({});
    try {
      if (editingProduct?.id) {
        const updated = await updateProduct(editingProduct.id, formData);
        showSuccess(`Producto "${updated.name}" actualizado exitosamente.`);
      } else {
        const created = await createProduct(formData);
        showSuccess(`Producto "${created.name}" registrado exitosamente.`);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      const valErrors = error.validationErrors || error.response?.data?.validationErrors;
      if (valErrors) {
        setServerErrors(valErrors);
        showError('Por favor corrija los campos marcados.');
      } else {
        showError(error.message || 'Error inesperado al guardar el producto.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deletion Confirmation Handler
  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      showSuccess('Producto eliminado exitosamente del inventario.');
      setIsDeleteOpen(false);
      setDeletingProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      showError(error.message || 'Error al eliminar el producto.');
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
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Catálogo de Inventario
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Administración centralizada de productos, existencias y precios en tiempo real.
          </p>
        </div>

        {/* Live Metrics Summary */}
        <StatsOverview metrics={metrics} />

        {/* Product Table View */}
        <ProductTable
          products={products}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          onAddNew={handleOpenCreate}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onRefresh={reload}
        />
      </main>

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

      {/* Modals & Feedback */}
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

      <AlertToast toast={toast} onClose={hideToast} />
    </div>
  );
}

export default App;
