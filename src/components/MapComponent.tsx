'use client';

import { useContext, useEffect} from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { MapContext } from './MapProvider';
import { WellLocation } from '@/types/location';
import {marked} from 'marked';

interface MapComponentProps {
    initialMapLocation: [number, number];
    initialZoom: number;
    locations: WellLocation[];
    selectedLocation: WellLocation | null;
    onLocationSelect: (location: WellLocation) => void;
    onDrawCreated?: (vals:{location:WellLocation | null, marker?:L.Marker }) => void;
    useMapControls?: boolean;
    isAdding?: boolean;
    editCurrentMarkers?: boolean;
}

 function MapComponentFR({
    initialMapLocation,
    initialZoom,
    locations,
    selectedLocation,
    onLocationSelect,
    onDrawCreated,
    useMapControls = true,
    editCurrentMarkers = true,
    isAdding = false,

}: MapComponentProps) {
    // @ts-expect-error --- IGNORE ---
    const { mapRef, mapInstanceRef, geoJsonLayerRef, drawnItemsRef, mapControlsRef } = useContext(MapContext);  
    // Convertir locations array a GeoJSON FeatureCollection
    const locationsToGeoJSON = (locations: WellLocation[]) => {
        return {
            type: 'FeatureCollection' as const,
            features: locations.map(location => ({
                type: 'Feature' as const,
                geometry: {
                    type: 'Point' as const,
                    coordinates: [location.lng, location.lat]
                },
                properties: {
                    id: location.id,
                    name: location.name,
                    description: location.description,
                    lat: location.lat,
                    lng: location.lng,
                    type: location.type,
                    data: location.data,
                    isSelected: selectedLocation?.id === location.id
                }
            }))
        };
    };
    // Crear icono personalizado
    const createCustomIcon = (type: string, isSelected = false) => {
        // Colorcitos con javaescript
        const normalizedType = (type || '').toLowerCase();
        const color =
            normalizedType === 'bar' ? '#f0600dff' :
            normalizedType === 'restaurant' ? '#FACC15' :
            normalizedType === 'hotel' ? '#22c55e' :
            normalizedType === 'sport' ? '#3b82f6' :
            '#a8e6cf';

        const size = isSelected ? 35 : 30;
        
        return L.divIcon({
            className: 'custom-div-icon',
            html: `
            <div class="marker-pin" style="
            background: ${color}; 
            width: ${size}px; 
            height: ${size}px;
            margin: -${size/2}px 0 0 -${size/2}px;
            box-shadow: 0 2px 10px rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.5);
            ${isSelected ? 'animation: bounce 1s infinite alternate;' : ''}
            ">
            <div style="
            width: ${size-16}px; 
            height: ${size-16}px; 
            margin: ${(size-16)/2}px 0 0 ${(size-16)/2}px;
            background: #fff;
            position: absolute;
            border-radius: 50%;
            "></div>
            </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2],

        });
    };
    function initMap(){
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current).setView(initialMapLocation, initialZoom);
        mapInstanceRef.current = map;

        // Añadir capa de mapa oscuro
        const mapAttribution = process.env.NEXT_PUBLIC_THEME === 'qc' ? 
            ' <a href="https://n8.com/attributions">N8 Maps</a>' : 
            ' <a href="https://quantum.com/attributions">Quantum Maps</a>';
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: mapAttribution,
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
    }
    function addMapControls(){
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;
        // Crear grupo para elementos dibujados
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        drawnItemsRef.current = drawnItems;

        // Configurar controles de dibujo 
        // @ts-expect-error

        const drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                polygon: {
                    allowIntersection: false,
                    drawError: {
                        color: '#e1e100',
                        message: '<strong>Error:</strong> shape edges cannot cross!'
                    },
                    shapeOptions: {
                        color: '#97009c'
                    }
                },
                polyline: {
                    shapeOptions: {
                        color: '#f357a1',
                        weight: 3
                    }
                },
                circle: {
                    shapeOptions: {
                        color: '#662d91'
                    }
                },
                rectangle: {
                    shapeOptions: {
                        color: '#662d91'
                    }
                },
                marker: {
                    icon: createCustomIcon('', false)
                },
                circlemarker: false
            },
            edit: {
                featureGroup: drawnItems,
                remove: true
            }
        });

        if (useMapControls) map.addControl(drawControl);
        mapControlsRef.current = drawControl;

        // Event listeners para el dibujo
        // @ts-expect-error

        map.on(L.Draw.Event.CREATED, (e: any) => {
            const marker = e.layer;
            drawnItems.addLayer(marker);
            const newLocation: WellLocation = {
                id: 0,
                name: '',
                description: '',
                lat: marker.getLatLng().lat,
                lng: marker.getLatLng().lng,
                type: 'water_well',
                data: ''
            };
            onDrawCreated?.({ location: newLocation, marker});
        });

        // @ts-expect-error
        map.on(L.Draw.Event.EDITED, (e: any) => {
            const markers = e.layers._layers;
            // @ts-expect-error
            Object.values(markers).forEach((marker: L.Marker) => {
                const location:WellLocation = {...marker.feature?.properties, marker: marker, ...marker.getLatLng()};
                onDrawCreated?.({location});
            });
        });


        
    };
    
    function addLocationMarkers(){
        if (!mapInstanceRef.current) return;

        // Limpiar capa GeoJSON existente
        if (geoJsonLayerRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
            if (editCurrentMarkers && drawnItemsRef.current) {
                drawnItemsRef.current.removeLayer(geoJsonLayerRef.current);
            }
        }

        // Crear nueva capa GeoJSON
        const geojsonData = locationsToGeoJSON(locations);
        
        const geoJsonLayer = L.geoJSON(geojsonData, {
            pointToLayer: (feature, latlng) => {
            const isSelected = feature.properties.isSelected;
            const icon = createCustomIcon(feature.properties.type, isSelected);
            return L.marker(latlng, { icon });
            },
            onEachFeature: (feature, layer) => {
            const location: WellLocation = {
                id: feature.properties.id,
                name: feature.properties.name,
                description: feature.properties.description,
                lat: feature.properties.lat,
                lng: feature.properties.lng,
                type: feature.properties.type,
                data: feature.properties.data,
            };
            const desc = marked.parse(feature.properties.description);
            // Agregar popup
            layer.bindPopup(`
                <div class="p-2" id="popup-${feature.properties.id}">
                <h3 class="font-bold text-sm">${feature.properties.name}</h3>
                <p class="text-xs text-gray-600 mt-1">${desc}</p>
              
                </div>
            `);

            // Agregar evento click
            layer.on('click', () => {
                onLocationSelect(location);
            });
            }
        });

        // Agregar capa al mapa
        geoJsonLayer.addTo(mapInstanceRef.current);
        geoJsonLayerRef.current = geoJsonLayer;

        // Agregar a drawnItems si está habilitada la edición
        geoJsonLayer.eachLayer(function (layer) {
                if (editCurrentMarkers && drawnItemsRef.current) {
                    drawnItemsRef.current.addLayer(layer);
                }
                });

        // Centrar el mapa en la ubicación seleccionada y abrir popup después de que la capa esté en el mapa
        if (selectedLocation) {
            mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 15);
            
            // Abrir popup para la ubicación seleccionada
            geoJsonLayer.eachLayer(function (layer: any) {
                if (layer.feature && layer.feature.properties.id === selectedLocation.id) {
                    console.log('Abriendo popup para la ubicación seleccionada:', layer);
                    layer.openPopup();
                }
            });
        }
    }
    useEffect(() => {
        initMap();
        // Limpiar al desmontar
        return () => {
     
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);
    useEffect(() => {
        addMapControls();
        if (isAdding)
        mapControlsRef?.current?._toolbars?.draw?._modes?.marker?.button?.click()

        return () => {
            // Limpiar controles al desmontar
            if (mapControlsRef.current && mapInstanceRef.current) {
                mapInstanceRef.current.removeControl(mapControlsRef.current);
                mapControlsRef.current = null;
            }
        }
    }, [useMapControls, editCurrentMarkers, onDrawCreated]);
    useEffect(() => {
        addLocationMarkers()
        
    }, [locations, selectedLocation, onLocationSelect]);

    return (
        <div className="w-full h-full bg-secondary rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
}

export default MapComponentFR;