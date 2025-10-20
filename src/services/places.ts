import { Place } from '../types/location'

const API_BASE_URL =  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const placesService = {
  async getPlaces(): Promise<Place[]> {
    const response = await fetch(`${API_BASE_URL}/places/`)
    if (!response.ok) {
      throw new Error(`Error fetching places: ${response.status}`)
    }
    
    const rawdata = await response.json()
    const data = rawdata.results
    
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