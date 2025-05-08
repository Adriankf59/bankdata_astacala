import dynamic from 'next/dynamic';
import React from 'react';
import Head from 'next/head';

// Create a placeholder while the map is loading
const MapLoading = () => (
  <div style={{ 
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    zIndex: 1000
  }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 18, fontWeight: 'bold', color: '#2dd4bf' }}>
        Loading map...
      </p>
      <div style={{ 
        width: 50, 
        height: 50, 
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #2dd4bf',
        borderRadius: '50%',
        margin: '20px auto',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
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
    <>
      <Head>
        <title>Peta Lokasi Kegiatan Astacala</title>
        <style jsx global>{`
          /* Reset CSS to ensure full viewport usage */
          html, body, #__next {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
          }
          
          /* Animation for loading spinner */
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Head>
      
      {/* The map container takes up the full screen */}
      <DynamicMap />
    </>
  );
}