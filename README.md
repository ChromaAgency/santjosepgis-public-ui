# Sant Josep GIS - Frontend

Frontend de Next.js para visualizar los datos geográficos de Sant Josep de sa Talaia usando React Query.

## Características

- 🗺️ **Mapa interactivo** con Leaflet y React-Leaflet
- 🔍 **Búsqueda y filtros** en tiempo real
- 📊 **Estadísticas** de lugares
- ⚡ **React Query** para gestión eficiente del estado del servidor
- 🎯 **TypeScript** para tipado fuerte
- 🎨 **Tailwind CSS** para estilos

## Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estado**: TanStack Query (React Query) v5
- **Mapas**: Leaflet, React-Leaflet
- **Estilos**: Tailwind CSS
- **Backend**: Django REST Framework con GeoDjango

## Instalación

1. **Instalar dependencias:**
```bash
pnpm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env.local
```

Edita `.env.local` con la URL de tu API de Django:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Ejecutar el servidor de desarrollo:**
```bash
pnpm dev
```

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes React
│   ├── MapComponent.tsx         # Componente base del mapa
│   ├── MapProvider.tsx          # Provider para configuración del mapa
│   ├── PlacesMap.tsx           # Mapa simple de lugares
│   ├── FilteredPlacesMap.tsx   # Mapa con lugares filtrados
│   ├── PlacesMapWithFilters.tsx # Mapa con controles de filtros
│   └── PlacesStats.tsx         # Estadísticas de lugares
├── hooks/               # Hooks de React Query
│   ├── usePlaces.ts            # Hook principal para lugares
│   ├── usePlaceTypes.ts        # Hook para tipos de lugares
│   └── useFilteredPlaces.ts    # Hook para filtrar lugares
├── providers/           # Providers de contexto
│   └── QueryProvider.tsx       # Provider de React Query
├── services/            # Servicios de API
│   └── places.ts               # Servicio de lugares
└── types/              # Definiciones de tipos
    └── location.d.ts           # Tipos para lugares y mapas
```

## Hooks de React Query

### `usePlaces()`
Hook principal para obtener todos los lugares:
```tsx
const { data: places, isLoading, error, refetch } = usePlaces()
```

### `useFilteredPlaces({ searchTerm, typeFilter })`
Hook para filtrar lugares:
```tsx
const { 
  places, 
  isLoading, 
  error, 
  totalCount, 
  filteredCount 
} = useFilteredPlaces({ 
  searchTerm: 'plaza', 
  typeFilter: 'restaurant' 
})
```

### `usePlaceTypes()`
Hook para obtener tipos únicos de lugares:
```tsx
const { data: types, isLoading } = usePlaceTypes()
```

### `usePlace(id)`
Hook para obtener un lugar específico:
```tsx
const { data: place, isLoading } = usePlace(123)
```

### `useSearchPlaces(query)`
Hook para búsqueda de lugares:
```tsx
const { data: results, isLoading } = useSearchPlaces('restaurant')
```

## Componentes

### `PlacesMapWithFilters`
Componente completo con mapa y controles de filtro:
```tsx
<PlacesMapWithFilters
  initialCenter={[39.4699, 0.3763]}
  initialZoom={12}
  className="w-full"
/>
```

### `FilteredPlacesMap`
Mapa que recibe lugares ya filtrados:
```tsx
<FilteredPlacesMap
  places={filteredPlaces}
  isLoading={loading}
  error={error}
  className="h-96"
/>
```

### `PlacesStats`
Componente de estadísticas:
```tsx
<PlacesStats className="mb-6" />
```

## API Integration

El frontend se conecta a la API de Django que debe estar ejecutándose en `http://localhost:8000` (configurable).

### Endpoints esperados:
- `GET /api/places/` - Lista todos los lugares (formato GeoJSON)
- `GET /api/places/:id/` - Obtiene un lugar específico
- `GET /api/places/?search=query` - Busca lugares
- `GET /api/places/?category=type` - Filtra por categoría

### Formato de datos esperado (GeoJSON):
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": 1,
      "geometry": {
        "type": "Point",
        "coordinates": [0.3763, 39.4699]
      },
      "properties": {
        "id": 1,
        "name": "Lugar ejemplo",
        "description": "Descripción del lugar",
        "type": "restaurant"
      }
    }
  ]
}
```

## Configuración de React Query

React Query está configurado con:
- **Stale Time**: 1 minuto para consultas generales
- **Cache Time**: Por defecto (5 minutos)
- **Retry**: 1 intento en caso de error
- **Refetch on Window Focus**: Deshabilitado

Puedes ajustar estas configuraciones en `src/providers/QueryProvider.tsx`.

## Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Construcción
pnpm build

# Producción
pnpm start

# Linting
pnpm lint

# Verificación de tipos
pnpm type-check
```

## Desarrollo

Para desarrollar nuevas funcionalidades:

1. **Crear nuevos hooks** en `src/hooks/` para nuevas consultas
2. **Usar el patrón** de Query Keys para organizar el cache
3. **Implementar optimistic updates** cuando sea apropiado
4. **Manejar estados de carga y error** consistentemente

### Ejemplo de nuevo hook:
```tsx
// src/hooks/useCreatePlace.ts
export const useCreatePlace = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (newPlace: CreatePlaceData) => placesService.createPlace(newPlace),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLACES_QUERY_KEYS.all })
    }
  })
}
```
