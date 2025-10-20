'use client';

import { useState } from 'react';
import FilteredPlacesMap from './FilteredPlacesMap';
import { usePlaceTypes } from '@/hooks/usePlaceTypes';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';

interface PlacesMapWithFiltersProps {
  apiBaseUrl?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
}

export default function PlacesMapWithFilters({
  apiBaseUrl,
  initialCenter = [38.9368719,1.2610344], // Coordenadas de Sant Josep de sa Talaia
  initialZoom = 12,
  className = 'w-full'
}: PlacesMapWithFiltersProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Usar React Query para obtener tipos disponibles
  const { data: availableTypes = [], isLoading: typesLoading } = usePlaceTypes();
  
  // Usar React Query para obtener lugares filtrados
  const { 
    places: filteredPlaces, 
    isLoading: placesLoading, 
    error,
    totalCount,
    filteredCount 
  } = useFilteredPlaces({ searchTerm, typeFilter });
  console.log('Well Locations:', filteredPlaces);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
  };

  return (
    <div className={`${className} flex gap-6 relative`} style={{height:"70vh"}}>
      {/* Botón para toggle sidebar en móvil */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-lg border"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar con filtros */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-80 bg-white rounded-lg shadow-sm border p-6 overflow-y-auto
        fixed lg:relative top-0 left-0 h-full lg:h-auto z-15
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Filtros
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!placesLoading && (
          <div className="text-sm text-gray-600 mb-4">
            {filteredCount} de {totalCount} lugares
          </div>
        )}
        
        <div className="space-y-6">
          {/* Búsqueda por nombre */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre
            </label>
            <input
              id="search"
              type="text"
              placeholder="Nombre del lugar..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Filtro por tipo */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por tipo
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              disabled={typesLoading}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
            >
              <option value="all">Todos los tipos</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Botón para limpiar filtros */}
          <div>
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
            >
              Limpiar filtros
            </button>
          </div>

          {/* Indicadores de filtros activos */}
          {(searchTerm || typeFilter !== 'all') && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Filtros activos:</h3>
              <div className="space-y-2">
                {searchTerm && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-md bg-blue-50 border border-blue-200">
                    <span className="text-sm text-blue-800">
                      Búsqueda: &quot;{searchTerm}&quot;
                    </span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
                {typeFilter !== 'all' && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-md bg-green-50 border border-green-200">
                    <span className="text-sm text-green-800">
                      Tipo: {typeFilter}
                    </span>
                    <button
                      onClick={() => setTypeFilter('all')}
                      className="text-green-600 hover:text-green-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mapa */}
      <div className={`flex-1 min-w-0 ${!sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <FilteredPlacesMap
          places={filteredPlaces}
          isLoading={placesLoading}
          error={error}
          initialCenter={initialCenter}
          initialZoom={initialZoom}
          className="h-full rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
}