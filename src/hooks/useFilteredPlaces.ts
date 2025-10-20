'use client'

import { useMemo } from 'react'
import { usePlaces } from './usePlaces'
import { Place } from '../types/location'

interface UseFilteredPlacesParams {
  searchTerm?: string
  typeFilter?: string
}

export const useFilteredPlaces = ({ searchTerm = '', typeFilter = 'all' }: UseFilteredPlacesParams = {}) => {
  const { data: allPlaces = [], isLoading, error, refetch } = usePlaces()

  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
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
  }, [allPlaces, searchTerm, typeFilter])

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