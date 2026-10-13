import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';

const COMMON_CATEGORIES = [
  'Electrónica',
  'Ropa',
  'Alimentos',
  'Hogar',
  'Deportes',
  'Oficina',
  'Otros',
];

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  isSubmitting = false,
  serverErrors = {},
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price !== undefined ? String(product.price) : '',
        stock: product.stock !== undefined ? String(product.stock) : '',
        category: product.category || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      });
    }
    setErrors({});
    setTouched({});
  }, [product, isOpen]);

  // Combine client-side errors and server-returned errors
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value || !value.trim()) {
        error = 'El nombre del producto es obligatorio';
      } else if (value.trim().length > 150) {
        error = 'El nombre no puede exceder 150 caracteres';
      }
    } else if (name === 'price') {
      if (value === '' || value === null || value === undefined) {
        error = 'El precio es obligatorio';
      } else {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
          error = 'El precio debe ser un número mayor a 0';
        }
      }
    } else if (name === 'stock') {
      if (value === '' || value === null || value === undefined) {
        error = 'El stock es obligatorio';
      } else {
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0) {
          error = 'El stock debe ser un número entero mayor o igual a 0';
        }
      }
    } else if (name === 'category') {
      if (value && value.length > 80) {
        error = 'La categoría no puede exceder 80 caracteres';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const nameErr = validateField('name', formData.name);
    if (nameErr) newErrors.name = nameErr;

    const priceErr = validateField('price', formData.price);
    if (priceErr) newErrors.price = priceErr;

    const stockErr = validateField('stock', formData.stock);
    if (stockErr) newErrors.stock = stockErr;

    const catErr = validateField('category', formData.category);
    if (catErr) newErrors.category = catErr;

    setErrors(newErrors);
    setTouched({
      name: true,
      price: true,
      stock: true,
      category: true,
      description: true,
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Submit payload matching backend ProductRequestDto
    onSubmit({
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      category: formData.category?.trim() || null,
    });
  };

  const isEditing = Boolean(product?.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? `Editar Producto #${product.id}` : 'Registrar Nuevo Producto'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Actualice los valores correspondientes del inventario.'
                : 'Complete los campos obligatorios para agregar un producto.'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Field: Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre del Producto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej. Laptop Dell XPS 15"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none ${
                (touched.name || serverErrors?.name) && errors.name
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/20'
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {(touched.name || serverErrors?.name) && errors.name && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Grid: Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Precio (USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none ${
                    (touched.price || serverErrors?.price) && errors.price
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/20'
                      : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                  }`}
                />
              </div>
              {(touched.price || serverErrors?.price) && errors.price && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock (Unidades) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none ${
                  (touched.stock || serverErrors?.stock) && errors.stock
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/20'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                }`}
              />
              {(touched.stock || serverErrors?.stock) && errors.stock && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Categoría
            </label>
            <div className="relative">
              <input
                type="text"
                name="category"
                list="category-suggestions"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Seleccione o escriba una categoría..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <datalist id="category-suggestions">
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            {errors.category && (
              <p className="text-xs text-rose-600 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Descripción <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles sobre especificaciones, modelo, estado o notas del producto..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Actualizar Producto' : 'Guardar Producto'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
