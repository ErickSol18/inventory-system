import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  product = null,
  isDeleting = false,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">
                Confirmar Eliminación
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                ¿Estás seguro de que deseas eliminar el producto{' '}
                <span className="font-semibold text-slate-900">"{product.name}"</span>?
              </p>
              <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-2 rounded-lg border border-rose-100">
                Esta acción no se puede deshacer y se removerá permanentemente de la base de datos.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onConfirm(product.id)}
              disabled={isDeleting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar Registro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
