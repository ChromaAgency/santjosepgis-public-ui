"use client";
import { createContext, useRef, useState } from 'react';

export const MapContext = createContext<any>(null);

export function MapProvider({children}: {children: React.ReactNode}){
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
    // @ts-expect-error
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