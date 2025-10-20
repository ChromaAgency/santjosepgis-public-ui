import { Place } from '../types/location'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const placesService = {
  async getPlaces(): Promise<Place[]> {
    const response = await fetch(`${API_BASE_URL}/places/`)
    if (!response.ok) {
      throw new Error(`Error fetching places: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data) // Debug log
    
    // Django REST Framework con GeoFeatureModelSerializer puede devolver:
    // 1. FeatureCollection con features array
    if (data.type === 'FeatureCollection' && data.features) {
      return data.features
    }
    // 2. Array directo de features
    if (Array.isArray(data)) {
      return data
    }
    // 3. Objeto con results (paginación)
    if (data.results && Array.isArray(data.results)) {
      return data.results
    }
    
    return []
  },

  async getPlace(id: number): Promise<Place> {
    const response = await fetch(`${API_BASE_URL}/places/${id}/`)
    
    if (!response.ok) {
      throw new Error(`Error fetching place ${id}: ${response.status}`)
    }
    
    return response.json()
  },

  async searchPlaces(query: string): Promise<Place[]> {
    const response = await fetch(`${API_BASE_URL}/places/?name=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`Error searching places: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Search API Response:', data) // Debug log
    
    if (data.type === 'FeatureCollection' && data.features) {
      return data.features
    }
    if (Array.isArray(data)) {
      return data
    }
    if (data.results && Array.isArray(data.results)) {
      return data.results
    }
    return []
  },

  async getPlacesByCategory(category: string): Promise<Place[]> {
    const response = await fetch(`${API_BASE_URL}/places/?type=${encodeURIComponent(category)}`)
    
    if (!response.ok) {
      throw new Error(`Error fetching places by category: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Category API Response:', data) // Debug log
    
    if (data.type === 'FeatureCollection' && data.features) {
      return data.features
    }
    if (Array.isArray(data)) {
      return data
    }
    if (data.results && Array.isArray(data.results)) {
      return data.results
    }
    return []
  }
}