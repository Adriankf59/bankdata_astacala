import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const key = 'Bt7BC1waN22lhYojEJO1';

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
    newMap.addControl(new maplibregl.NavigationControl(), 'top-right');
    newMap.on('load', () => {
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
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Map container taking full screen */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }} 
      />
      
      {/* Controls overlay positioned on top of map */}
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px 15px',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={toggle3D} 
          style={{ 
            marginRight: 8, 
            background: is3D ? '#2dd4bf' : '#fff', 
            color: is3D ? '#fff' : '#222', 
            border: '1px solid #2dd4bf', 
            borderRadius: 5, 
            padding: '6px 18px', 
            cursor: 'pointer' 
          }}
        >
          3D
        </button>
        <span style={{ marginRight: 8 }}>Ganti Peta:</span>
        {['outdoor','streets','satellite'].map(style => (
          <button 
            key={style}
            onClick={() => changeMapStyle(style)}
            style={{ 
              marginRight: 6, 
              background: mapStyle===style?'#2dd4bf':'#fff', 
              color: mapStyle===style?'#fff':'#222', 
              border: '1px solid #2dd4bf', 
              borderRadius: 5, 
              padding: '6px 12px', 
              cursor: 'pointer' 
            }}
          >
            {style.charAt(0).toUpperCase()+style.slice(1)}
          </button>
        ))}
      </div>

      {/* Page title overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '8px 15px',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: '#2dd4bf', 
          margin: 0 
        }}>
          Peta Lokasi Kegiatan Astacala
        </h1>
      </div>
    </div>
  );
};

export default MapComponent;