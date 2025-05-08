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
    backgroundColor: '#f5f5f5',
    zIndex: 1000
  }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 16, color: '#2dd4bf', fontWeight: 'bold' }}>
        Loading map...
      </p>
      <div style={{ 
        width: 40, 
        height: 40, 
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #2dd4bf',
        borderRadius: '50%',
        margin: '15px auto',
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
        <meta name="description" content="Peta lokasi kegiatan Astacala" />
        <style jsx global>{`
          /* Reset CSS to ensure full viewport usage */
          html, body, #__next {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          /* Animation for loading spinner */
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Button hover effects */
          button:hover {
            filter: brightness(0.95);
          }
          
          button:active {
            filter: brightness(0.9);
          }
        `}</style>
      </Head>
      
      {/* The map component */}
      <DynamicMap />
    </>
  );
}