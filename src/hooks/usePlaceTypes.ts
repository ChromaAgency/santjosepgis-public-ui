'use client'

import { useQuery } from '@tanstack/react-query'
import { placesService } from '../services/places'
import { PLACES_QUERY_KEYS } from './usePlaces'

// Hook para obtener tipos únicos de lugares
export const usePlaceTypes = () => {
  return useQuery({
    queryKey: [...PLACES_QUERY_KEYS.all, 'types'],
    queryFn: async () => {
      const places = await placesService.getPlaces()
      console.log('Places for types:', places) // Debug log
      
      const types = [...new Set(places
        .filter(place => place && place.properties && place.properties.type)
        .map(place => place.properties.type)
      )]
      
      console.log('Extracted types:', types) // Debug log
      return types.filter(Boolean) // Filtrar valores vacíos
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}