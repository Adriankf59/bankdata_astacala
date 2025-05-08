import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('night'); // Using dark style by default
  const key = 'Bt7BC1waN22lhYojEJO1';

  // Astacala locations
  const activitiesPoints = [
    { name: 'Gunung Parang', description: 'Tebing populer untuk panjat tebing di Jawa Barat.', coordinates: [107.3456, -6.7462] },
    { name: 'Goa Jatijajar', description: 'Gua indah dengan stalaktit dan stalagmit.', coordinates: [109.8503, -7.7419] },
    { name: 'Gunung Banyak', description: 'Lokasi populer paralayang di Jawa Timur.', coordinates: [112.5191, -7.8822] },
  ];

  const centerCoordinates = [110, -7];
  
  // Function to add activity points to the map
  const addActivityPoints = (mapInstance) => {
    // Check if the source already exists before adding it
    if (!mapInstance.getSource('activities-points')) {
      mapInstance.addSource('activities-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: activitiesPoints.map(p => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: p.coordinates },
            properties: { name: p.name, description: p.description }
          }))
        }
      });
      
      // Add the layer only if the source was just added
      mapInstance.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'activities-points',
        paint: {
          'circle-radius': 7,
          'circle-color': '#ff3333',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
      
      // Add click handler for popups
      mapInstance.on('click', 'points-layer', (e) => {
        const feature = e.features[0];
        
        // Custom dark popup style
        const popup = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          className: 'dark-popup' // Will be styled in CSS
        })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`
          <div style="color: white;">
            <div style="font-weight: bold; color: #ff3333; margin-bottom: 5px; font-size: 16px;">
              ${feature.properties.name}
            </div>
            <div>${feature.properties.description}</div>
          </div>
        `)
        .addTo(mapInstance);
      });
    }
  };

  // Toggle 3D terrain
  const toggle3D = () => {
    setIs3D(v => {
      const next = !v;
      if (map) {
        if (next) {
          if (!map.getSource('terrain')) {
            map.addSource('terrain', {
              type: 'raster-dem',
              url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
            });
          }
          map.setTerrain({ source: 'terrain' });
        } else {
          map.setTerrain(undefined);
          if (map.getSource('terrain')) map.removeSource('terrain');
        }
      }
      return next;
    });
  };

  // Change map style
  const changeMapStyle = (newStyle) => {
    setMapStyle(newStyle);
    if (map) {
      const c = map.getCenter(), z = map.getZoom(), p = map.getPitch(), b = map.getBearing();
      map.setStyle(`https://api.maptiler.com/maps/${newStyle}/style.json?key=${key}`);
      map.once('styledata', () => {
        map.setCenter(c); map.setZoom(z); map.setPitch(p); map.setBearing(b);
        
        // Re-add terrain if 3D is enabled
        if (is3D && !map.getSource('terrain')) {
          map.addSource('terrain', {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
          });
          map.setTerrain({ source: 'terrain' });
        }
        
        // Re-add points after style change
        addActivityPoints(map);
      });
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${key}`,
      center: centerCoordinates,
      zoom: 6,
      maxPitch: 85
    });
    
    // Custom navigation control
    newMap.addControl(new maplibregl.NavigationControl({
      showCompass: true
    }), 'top-right');
    
    // Wait for map to load before adding points
    newMap.on('load', () => {
      // Add activity points using the function
      addActivityPoints(newMap);
    });
    
    setMap(newMap);
    
    return () => newMap.remove();
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh',
      backgroundColor: '#000'
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
        <button 
          onClick={toggle3D}
          style={{
            ...toolButtonStyle,
            backgroundColor: is3D ? '#ff3333' : '#1a1a1a',
            color: 'white',
            border: is3D ? '1px solid #ff3333' : '1px solid #333'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </button>
      </div>
      
      {/* Map style switcher */}
      <div style={{
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 10,
        display: 'flex',
        gap: '8px',
        backgroundColor: '#1a1a1a',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }}>
        {['night', 'outdoor', 'satellite'].map(style => (
          <button 
            key={style}
            onClick={() => changeMapStyle(style)}
            style={{
              padding: '5px 10px',
              border: mapStyle === style ? '1px solid #ff3333' : '1px solid #333',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: mapStyle === style ? '#ff3333' : '#1a1a1a',
              color: 'white',
              fontSize: '12px',
              fontWeight: mapStyle === style ? 'bold' : 'normal'
            }}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Title header */}
      <div style={{
        position: 'absolute',
        top: 15,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        border: '1px solid #ff3333',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: '#ff3333', 
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Peta Lokasi Kegiatan Astacala
        </h1>
      </div>
      
      {/* Bottom copyright bar */}

};

// Common style for tool buttons
const toolButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
};

export default MapComponent;