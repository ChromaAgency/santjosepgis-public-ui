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
    <div className={className}>
      {/* Panel de filtros */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Mapa de Lugares - Sant Josep de sa Talaia
          {!placesLoading && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({filteredCount} de {totalCount} lugares)
            </span>
          )}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Búsqueda por nombre */}
          <div className="flex-1 min-w-0">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por nombre
            </label>
            <input
              id="search"
              type="text"
              placeholder="Nombre del lugar..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Filtro por tipo */}
          <div className="w-full sm:w-auto">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por tipo
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              disabled={typesLoading}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
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
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1 opacity-0">
              Acciones
            </label>
            <button
              onClick={clearFilters}
              className="w-full sm:w-auto px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Indicadores de filtros activos */}
        {(searchTerm || typeFilter !== 'all') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Búsqueda: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Tipo: {typeFilter}
                <button
                  onClick={() => setTypeFilter('all')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Mapa */}
      <FilteredPlacesMap
        places={filteredPlaces}
        isLoading={placesLoading}
        error={error}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        className="h-96 rounded-lg shadow-sm"
      />
    </div>
  );
}