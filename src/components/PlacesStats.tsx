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
    <div className={`${className} bg-white rounded-lg shadow-sm border p-6`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Estadísticas de Lugares
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de lugares */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalPlaces}</div>
          <div className="text-sm text-blue-800">Total de lugares</div>
        </div>

        {/* Tipos más comunes */}
        {topTypes.map(([type, count], index) => (
          <div 
            key={type} 
            className={`rounded-lg p-4 text-center ${
              index === 0 ? 'bg-green-50' : 
              index === 1 ? 'bg-yellow-50' : 'bg-purple-50'
            }`}
          >
            <div className={`text-2xl font-bold ${
              index === 0 ? 'text-green-600' : 
              index === 1 ? 'text-yellow-600' : 'text-purple-600'
            }`}>
              {count as number}
            </div>
            <div className={`text-sm ${
              index === 0 ? 'text-green-800' : 
              index === 1 ? 'text-yellow-800' : 'text-purple-800'
            }`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Lista de todos los tipos */}
      {Object.keys(typeStats).length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Distribución por tipo:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeStats).map(([type, count]) => (
              <span 
                key={type}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {type}: {count as number}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}