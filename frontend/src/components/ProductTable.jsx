import React from 'react';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  PackageOpen,
  Filter,
  RefreshCw,
} from 'lucide-react';

export const ProductTable = ({
  products = [],
  isLoading = false,
  searchTerm = '',
  onSearchChange,
  selectedCategory = '',
  onCategoryChange,
  categories = [],
  onAddNew,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount || 0);
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          Agotado (0)
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Bajo ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Disponible ({stock})
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-2xl">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre o detalle..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full sm:w-56">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition shadow-sm appearance-none cursor-pointer"
            >
              <option value="ALL">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Recargar catálogo"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition self-stretch sm:self-auto flex items-center justify-center border sm:border-transparent border-slate-200 bg-white sm:bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Action: Add Product */}
        <button
          onClick={onAddNew}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">ID</th>
              <th className="py-3.5 px-4">Producto</th>
              <th className="py-3.5 px-4">Categoría</th>
              <th className="py-3.5 px-4">Precio</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                    <span className="text-sm font-medium">Cargando inventario...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <PackageOpen className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-700">No se encontraron productos</p>
                    <p className="text-xs text-slate-400">
                      {searchTerm || selectedCategory !== 'ALL'
                        ? 'No hay registros que coincidan con los criterios de búsqueda aplicados.'
                        : 'El catálogo se encuentra vacío actualmente.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* ID */}
                  <td className="py-4 px-4 sm:px-6 font-mono text-xs font-semibold text-slate-400">
                    #{product.id}
                  </td>

                  {/* Name & Description */}
                  <td className="py-4 px-4">
                    <div className="max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {product.name}
                      </div>
                      {product.description ? (
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {product.description}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sin descripción</span>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    {product.category ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {product.category}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Sin asignar</span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {formatCurrency(product.price)}
                  </td>

                  {/* Stock */}
                  <td className="py-4 px-4">
                    {getStockBadge(product.stock)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center space-x-1.5">
                      <button
                        onClick={() => onEdit(product)}
                        title="Editar producto"
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        title="Eliminar producto"
                        className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500 flex justify-between items-center">
        <span>Mostrando {products.length} productos registrados</span>
        <span className="font-mono text-[11px] text-slate-400">REST API v1.0.0</span>
      </div>
    </div>
  );
};

export default ProductTable;
