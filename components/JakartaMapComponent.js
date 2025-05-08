import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const JakartaMapComponent = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('streets');
  const key = 'Bt7BC1waN22lhYojEJO1';

  // Jakarta coordinates
  const centerCoordinates = [106.8456, -6.2088];

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${key}`,
      center: centerCoordinates,
      zoom: 12,
      maxPitch: 85
    });
    
    // Add navigation control (but only the zoom buttons, not compass)
    newMap.addControl(new maplibregl.NavigationControl({
      showCompass: false
    }), 'top-right');
    
    // Add Marker for center of Jakarta
    const marker = new maplibregl.Marker({
      color: "#ff6b6b"
    })
      .setLngLat(centerCoordinates)
      .addTo(newMap);
    
    setMap(newMap);
    
    return () => newMap.remove();
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh',
    }}>
      {/* The map container */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }} 
      />
      
      {/* Left side tools panel */}
      <div style={{
        position: 'absolute',
        left: 15,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10
      }}>
        <button style={toolButtonStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
        
        <button style={toolButtonStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </button>
        
        <button style={toolButtonStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </button>
        
        <button style={toolButtonStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      
      {/* Search box in top right */}
      <div style={{
        position: 'absolute',
        top: 15,
        right: 60,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          padding: '6px',
          alignItems: 'center'
        }}>
          <input 
            type="text" 
            placeholder="Search location..." 
            style={{
              border: 'none',
              padding: '4px 8px',
              outline: 'none',
              width: '180px',
              fontSize: '14px'
            }}
          />
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Bottom right attribution and controls */}
      <div style={{
        position: 'absolute',
        bottom: 5,
        right: 5,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: '#666'
      }}>
        <span>© MapTiler © OpenStreetMap contributors</span>
        <button style={{
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6"></path>
            <path d="M10 14L21 3"></path>
            <path d="M9 21H3v-6"></path>
            <path d="M3 14L14 3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Common style for tool buttons
const toolButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '4px',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export default JakartaMapComponent;