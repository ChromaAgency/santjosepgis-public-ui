'use client';

import { useState } from 'react';
import MapComponentFR from './MapComponent';
import { MapProvider } from './MapProvider';
import { WellLocation, LocationType } from '@/types/location';
import { usePlaces } from '@/hooks/usePlaces';

interface PlacesMapProps {
  apiBaseUrl?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  typeFilter?: string;
  searchTerm?: string;
  className?: string;
}

export default function PlacesMap({
  initialCenter = [38.9368719,1.2610344], // Coordenadas de Sant Josep de sa Talaia
  initialZoom = 12,
  className = 'w-full h-96'
}: PlacesMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<WellLocation | null>(null);
  
  // Usar React Query para obtener datos de lugares
  const { data: places = [], isLoading: loading, error, refetch } = usePlaces();

  // Convertir places a WellLocation format
  const wellLocations: WellLocation[] = places.map(place => ({
    id: place.id,
    name: place.properties.name,
    description: place.properties.description || '',
    lat: place.geometry.coordinates[1], // GeoJSON usa [lng, lat]
    lng: place.geometry.coordinates[0],
    type: place.properties.type as LocationType || 'other',
    data: JSON.stringify(place.properties)
  }));


  const handleLocationSelect = (location: WellLocation) => {
    setSelectedLocation(location);
  };

  const handleDrawCreated = (vals: { location: WellLocation | null; marker?: any }) => {
    // Manejar la creación de nuevos marcadores si es necesario
    console.log('Nuevo marcador creado:', vals);
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando lugares...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-50 rounded-lg border border-red-200`}>
        <div className="text-center p-4">
          <p className="text-red-600 font-medium mb-2">Error al cargar el mapa</p>
          <p className="text-red-500 text-sm mb-3">{error?.message || 'Error desconocido'}</p>
          <button
            onClick={() => refetch()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      <MapProvider>
        <MapComponentFR
          initialMapLocation={initialCenter}
          initialZoom={initialZoom}
          locations={wellLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          onDrawCreated={handleDrawCreated}
          useMapControls={false}
          editCurrentMarkers={false}
          isAdding={false}
        />
      </MapProvider>
      
      {/* Panel de información del lugar seleccionado - Flotante sobre el mapa */}
      {selectedLocation && (
        <div className="absolute inset-0 z-[9999]">
          {/* Overlay oscuro de fondo */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setSelectedLocation(null)}
          />
          
          {/* Panel de información */}
          <div className="absolute top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:w-96 sm:-translate-x-1/2 p-4 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[calc(100%-2rem)] overflow-y-auto">
            {/* Botón de cerrar */}
            <button
              onClick={() => setSelectedLocation(null)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Cerrar información"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Encabezado */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-800 mb-1 pr-10">
                {selectedLocation.name}
              </h3>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                selectedLocation.type === 'water_well' ? 'bg-blue-100 text-blue-800' :
                selectedLocation.type === 'office' ? 'bg-gray-100 text-gray-800' :
                selectedLocation.type === 'store' ? 'bg-green-100 text-green-800' :
                selectedLocation.type === 'warehouse' ? 'bg-orange-100 text-orange-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {selectedLocation.type === 'water_well' ? 'Pozo de agua' :
                 selectedLocation.type === 'office' ? 'Oficina' :
                 selectedLocation.type === 'store' ? 'Tienda' :
                 selectedLocation.type === 'warehouse' ? 'Almacén' :
                 'Otro'}
              </span>
            </div>

            {/* Descripción */}
            {selectedLocation.description && (
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{selectedLocation.description}</p>
              </div>
            )}

            {/* Información adicional */}
            <div className="border-t border-gray-100 pt-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start text-gray-600">
                  <svg className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-800">Coordenadas</div>
                    <div className="text-gray-600">{selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>
                    <strong>ID:</strong> {selectedLocation.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`;
                  window.open(url, '_blank');
                }}
                className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver en Google Maps
              </button>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`${selectedLocation.lat}, ${selectedLocation.lng}`);
                    // Aquí podrías agregar una notificación de "copiado"
                  } catch (err) {
                    console.error('Error al copiar coordenadas:', err);
                  }
                }}
                className="flex items-center justify-center px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar coordenadas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}