'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { placesService } from '../services/places'
import { Place } from '../types/location'

// Query keys
export const PLACES_QUERY_KEYS = {
  all: ['places'] as const,
  lists: () => [...PLACES_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...PLACES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PLACES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PLACES_QUERY_KEYS.details(), id] as const,
}

// Hook for getting all places
export const usePlaces = () => {
  return useQuery({
    queryKey: PLACES_QUERY_KEYS.lists(),
    queryFn: placesService.getPlaces,
  })
}

// Hook for getting a single place
export const usePlace = (id: number) => {
  return useQuery({
    queryKey: PLACES_QUERY_KEYS.detail(id),
    queryFn: () => placesService.getPlace(id),
    enabled: !!id,
  })
}

// Hook for searching places
export const useSearchPlaces = (query: string) => {
  return useQuery({
    queryKey: PLACES_QUERY_KEYS.list(`search-${query}`),
    queryFn: () => placesService.searchPlaces(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook for getting places by category
export const usePlacesByCategory = (category: string) => {
  return useQuery({
    queryKey: PLACES_QUERY_KEYS.list(`category-${category}`),
    queryFn: () => placesService.getPlacesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for invalidating places cache
export const useInvalidatePlaces = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: PLACES_QUERY_KEYS.all })
  }
}