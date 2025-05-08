import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const key = 'Bt7BC1waN22lhYojEJO1';

  // Astacala locations
  const activitiesPoints = [
    { name: 'Gunung Parang', description: 'Tebing populer untuk panjat tebing di Jawa Barat.', coordinates: [107.3456, -6.7462] },
    { name: 'Goa Jatijajar', description: 'Gua indah dengan stalaktit dan stalagmit.', coordinates: [109.8503, -7.7419] },
    { name: 'Gunung Banyak', description: 'Lokasi populer paralayang di Jawa Timur.', coordinates: [112.5191, -7.8822] },
  ];

  const centerCoordinates = [110, -7];

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
        if (is3D && !map.getSource('terrain')) {
          map.addSource('terrain', {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
          });
          map.setTerrain({ source: 'terrain' });
        }
        // Re-add points
        if (!map.getSource('activities-points')) {
          map.addSource('activities-points', {
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
          map.addLayer({
            id: 'points-layer',
            type: 'circle',
            source: 'activities-points',
            paint: {
              'circle-radius': 7,
              'circle-color': '#2dd4bf',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff'
            }
          });
        }
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
    
    // Add navigation control
    newMap.addControl(new maplibregl.NavigationControl({
      showCompass: true
    }), 'top-right');
    
    newMap.on('load', () => {
      // Add activity points
      newMap.addSource('activities-points', {
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
      
      newMap.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'activities-points',
        paint: {
          'circle-radius': 7,
          'circle-color': '#2dd4bf',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
      
      newMap.on('click', 'points-layer', (e) => {
        const feature = e.features[0];
        new maplibregl.Popup()
          .setLngLat(feature.geometry.coordinates)
          .setHTML(`<b>${feature.properties.name}</b><br/>${feature.properties.description}`)
          .addTo(newMap);
      });
    });
    
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
        <button 
          onClick={toggle3D}
          style={{
            ...toolButtonStyle,
            backgroundColor: is3D ? '#2dd4bf' : 'white',
            color: is3D ? 'white' : '#333'
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
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        {['outdoor', 'streets', 'satellite'].map(style => (
          <button 
            key={style}
            onClick={() => changeMapStyle(style)}
            style={{
              padding: '5px 10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: mapStyle === style ? '#2dd4bf' : 'white',
              color: mapStyle === style ? 'white' : '#333',
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 15px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          color: '#2dd4bf', 
          margin: 0 
        }}>
          Peta Lokasi Kegiatan Astacala
        </h1>
      </div>
      
      {/* Bottom right attribution */}
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

export default MapComponent;