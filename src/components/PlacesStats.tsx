'use client';

import { usePlaces } from '@/hooks/usePlaces';
import { usePlaceTypes } from '@/hooks/usePlaceTypes';

interface PlacesStatsProps {
  apiBaseUrl?: string;
  className?: string;
}

export default function PlacesStats({ 
  apiBaseUrl,
  className = ''
}: PlacesStatsProps) {
  const { data: places = [], isLoading: loading, error } = usePlaces();

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="bg-gray-200 h-24 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-red-50 border border-red-200 rounded-lg p-4`}>
        <p className="text-red-600 text-sm">Error al cargar estadísticas: {error.message}</p>
      </div>
    );
  }

  // Calcular estadísticas
  const totalPlaces = places.length;
  const typeStats = places.reduce((acc: Record<string, number>, place) => {
    const type = place.properties.type || 'Sin tipo';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const topTypes = Object.entries(typeStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3);

  return (
    <div className={`${className} bg-white rounded-lg shadow-sm border p-3 mb-4`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          Estadísticas
        </h3>
        
        <div className="flex items-center gap-4 text-sm">
          {/* Total de lugares */}
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Total:</span>
            <span className="font-bold text-blue-600">{totalPlaces}</span>
          </div>

          {/* Tipos más comunes - solo mostrar top 2 */}
{topTypes.map(([type, count], index) => (
  <div key={type} className="flex items-center gap-1">
    <span className="text-gray-600">{type}:</span>
    <span 
      className={`font-bold ${
        index === 0 ? 'text-green-600' :
        index === 1 ? 'text-yellow-600' :
        index === 3 ? 'text-purple-600' :
        index === 4 ? 'text-orange-600' :
        index !== 2 ? 'text-gray-600' : ''
      }`}
      style={index === 2 ? { color: '#f0600d' } : undefined}
    >
      {count as number}
    </span>
  </div>
))}
          {/* Mostrar "..." si hay más tipos */}
          {/* {Object.keys(typeStats).length > 2 && (
            <span className="text-gray-400 text-xs">
              +{Object.keys(typeStats).length - 2} más
            </span>
          )} */}
        </div>
      </div>
    </div>
  );
}