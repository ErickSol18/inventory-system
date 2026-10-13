import React from 'react';
import { Package, Layers, Terminal } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Tech Factory Consulting
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Mini Sistema de Inventario
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
              title="Ver documentación interactiva de la API"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Swagger UI</span>
            </a>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Full Stack: Spring Boot + React</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
