"use client";
import { createContext, useRef} from 'react';

type MapContextType = {
    mapRef: React.RefObject<HTMLDivElement | null>;
    mapInstanceRef: React.RefObject<L.Map | null>;
    geoJsonLayerRef: React.RefObject<L.GeoJSON | null>;
    drawnItemsRef: React.RefObject<L.FeatureGroup | null>;
    // @ts-expect-error  No types for Leaflet.draw
    mapControlsRef: React.RefObject<L.Control.Draw | null>;
}
export const MapContext = createContext<MapContextType | null>(null);

export function MapProvider({children}: {children: React.ReactNode}){
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
    // @ts-expect-error  No types for Leaflet.draw
    const mapControlsRef = useRef<L.Control.Draw | null>(null);

    return <MapContext.Provider value={{
        mapRef,
        mapInstanceRef,
        geoJsonLayerRef,
        drawnItemsRef,
        mapControlsRef,
    }}>
        {children}
    </MapContext.Provider>
}