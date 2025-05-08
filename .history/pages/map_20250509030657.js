import dynamic from 'next/dynamic';
import React from 'react';

// Create a placeholder while the map is loading
const MapLoading = () => (
  <div style={{ 
    height: 480, 
    borderRadius: 7, 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', 
    border: '1px solid #eee'
  }}>
    <p>Loading map...</p>
  </div>
);

// Dynamically load the map component with no SSR
const DynamicMap = dynamic(
  () => import('../components/MapComponent'),
  { 
    ssr: false,
    loading: MapLoading 
  }
);

export default function MapPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#2dd4bf', margin: '16px 0' }}>
        Peta Lokasi Kegiatan Astacala
      </h1>
      <DynamicMap />
    </div>
  );
}