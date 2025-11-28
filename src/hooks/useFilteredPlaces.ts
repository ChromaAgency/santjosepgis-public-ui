'use client'

import { usePlaces } from './usePlaces'

interface UseFilteredPlacesParams {
  searchTerm?: string
  typeFilter?: string
}

export const useFilteredPlaces = ({ searchTerm = '', typeFilter = 'all' }: UseFilteredPlacesParams = {}) => {
  const { data: allPlaces = [], isLoading, error, refetch } = usePlaces()

  const filteredPlaces =  function() {
    let filtered = allPlaces

    // Filtrar por búsqueda
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(place =>
        place.properties.name.toLowerCase().includes(searchLower) ||
        place.properties.description.toLowerCase().includes(searchLower)
      )
    }

    // Filtrar por tipo
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(place => 
        place.properties.type === typeFilter
      )
    }

    return filtered
  }()
  return {
    places: filteredPlaces,
    allPlaces,
    isLoading,
    error,
    refetch,
    totalCount: allPlaces.length,
    filteredCount: filteredPlaces.length
  }
}