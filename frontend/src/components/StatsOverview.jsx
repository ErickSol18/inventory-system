import React from 'react';
import { Package, DollarSign, AlertTriangle, Tag } from 'lucide-react';

export const StatsOverview = ({ products = [] }) => {
  const totalProducts = products.length;

  const totalInventoryValue = products.reduce((acc, curr) => {
    const price = parseFloat(curr.price) || 0;
    const stock = parseInt(curr.stock, 10) || 0;
    return acc + price * stock;
  }, 0);

  const lowStockCount = products.filter((p) => (p.stock || 0) <= 5).length;

  const uniqueCategories = new Set(
    products.map((p) => p.category?.trim()).filter(Boolean)
  ).size;

  const formattedValue = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(totalInventoryValue);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Products */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Productos
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalProducts}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Package className="w-6 h-6" />
        </div>
      </div>

      {/* Inventory Value */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Valor Estimado
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formattedValue}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      {/* Low Stock Warning */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Stock Crítico (≤ 5)
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
        </div>
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Total Categories */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Categorías Activas
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{uniqueCategories}</p>
        </div>
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
          <Tag className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
