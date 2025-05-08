import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    all: true,
    pendaki: true,
    panjatTebing: true,
    paralayang: true
  });
  
  const key = 'Bt7BC1waN22lhYojEJO1';

  // Astacala locations with division information
  const activitiesPoints = [
    { 
      name: 'Gunung Parang', 
      description: 'Tebing populer untuk panjat tebing di Jawa Barat.', 
      coordinates: [107.3456, -6.7462],
      division: 'panjatTebing'
    },
    { 
      name: 'Goa Jatijajar', 
      description: 'Gua indah dengan stalaktit dan stalagmit.', 
      coordinates: [109.8503, -7.7419],
      division: 'pendaki'
    },
    { 
      name: 'Gunung Banyak', 
      description: 'Lokasi populer paralayang di Jawa Timur.', 
      coordinates: [112.5191, -7.8822],
      division: 'paralayang'
    },
  ];

  const centerCoordinates = [110, -7];
  
  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Handle filter changes
  const handleFilterChange = (division) => {
    if (division === 'all') {
      const newValue = !activeFilters.all;
      setActiveFilters({
        all: newValue,
        pendaki: newValue,
        panjatTebing: newValue,
        paralayang: newValue
      });
    } else {
      const newFilters = {
        ...activeFilters,
        [division]: !activeFilters[division]
      };
      
      // Update 'all' filter based on other filters
      newFilters.all = newFilters.pendaki && newFilters.panjatTebing && newFilters.paralayang;
      
      setActiveFilters(newFilters);
    }
    
    // Apply filters to map if map exists
    if (map) {
      updateMapFilters();
    }
  };
  
  // Update map filters based on activeFilters state
  const updateMapFilters = () => {
    if (!map || !map.getLayer('points-layer')) return;
    
    if (activeFilters.all) {
      // Show all points
      map.setFilter('points-layer', null);
    } else {
      // Create a filter array for maplibre-gl
      const filterArray = ['any'];
      
      if (activeFilters.pendaki) {
        filterArray.push(['==', ['get', 'division'], 'pendaki']);
      }
      
      if (activeFilters.panjatTebing) {
        filterArray.push(['==', ['get', 'division'], 'panjatTebing']);
      }
      
      if (activeFilters.paralayang) {
        filterArray.push(['==', ['get', 'division'], 'paralayang']);
      }
      
      // If no division is selected, hide all points
      if (filterArray.length === 1) {
        filterArray.push(['==', ['get', 'division'], 'none']);
      }
      
      map.setFilter('points-layer', filterArray);
    }
  };
  
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
            properties: { 
              name: p.name, 
              description: p.description,
              division: p.division
            }
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
          'circle-color': [
            'match',
            ['get', 'division'],
            'pendaki', '#ff3333',
            'panjatTebing', '#33ff33',
            'paralayang', '#3333ff',
            '#ff3333' // default color
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
      
      // Apply filters if needed
      updateMapFilters();
      
      // Add click handler for popups
      mapInstance.on('click', 'points-layer', (e) => {
        const feature = e.features[0];
        
        // Get the color based on division
        let color = '#ff3333'; // default
        if (feature.properties.division === 'pendaki') color = '#ff3333';
        if (feature.properties.division === 'panjatTebing') color = '#33ff33';
        if (feature.properties.division === 'paralayang') color = '#3333ff';
        
        // Division names in Indonesian
        const divisionNames = {
          pendaki: 'Divisi Pendakian',
          panjatTebing: 'Divisi Panjat Tebing',
          paralayang: 'Divisi Paralayang'
        };
        
        // Custom dark popup style
        const popup = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          className: 'dark-popup'
        })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`
          <div style="color: white;">
            <div style="font-weight: bold; color: ${color}; margin-bottom: 5px; font-size: 16px;">
              ${feature.properties.name}
            </div>
            <div style="font-size: 12px; color: #aaa; margin-bottom: 5px;">
              ${divisionNames[feature.properties.division]}
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
        {/* Layer filter button */}
        <button 
          onClick={toggleFilters}
          style={{
            ...toolButtonStyle,
            backgroundColor: showFilters ? '#ff3333' : '#1a1a1a',
            color: 'white',
            border: showFilters ? '1px solid #ff3333' : '1px solid #333'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>
      
      {/* Filter panel (shown/hidden based on state) */}
      {showFilters && (
        <div style={{
          position: 'absolute',
          left: 60,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '15px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          border: '1px solid #ff3333',
          zIndex: 10,
          minWidth: '200px'
        }}>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: '#ff3333', marginBottom: 10 }}>
            Filter Divisi
          </div>
          
          {/* Checkbox filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.all}
                onChange={() => handleFilterChange('all')}
                style={{ marginRight: '8px' }}
              />
              Semua Divisi
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#ff3333', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.pendaki}
                onChange={() => handleFilterChange('pendaki')}
                style={{ marginRight: '8px' }}
              />
              Divisi Pendakian
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#33ff33', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.panjatTebing}
                onChange={() => handleFilterChange('panjatTebing')}
                style={{ marginRight: '8px' }}
              />
              Divisi Panjat Tebing
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#3333ff', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.paralayang}
                onChange={() => handleFilterChange('paralayang')}
                style={{ marginRight: '8px' }}
              />
              Divisi Paralayang
            </label>
            
            {/* 3D Terrain Checkbox */}
            <div style={{ borderTop: '1px solid #333', marginTop: '8px', paddingTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={is3D}
                  onChange={toggle3D}
                  style={{ marginRight: '8px' }}
                />
                Tampilan 3D Terrain
              </label>
            </div>
          </div>
        </div>
      )}
      
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
          Webgis Astacala
        </h1>
      </div>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 15,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 15px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        border: '1px solid #333',
      }}>
        <div style={{ fontSize: 12, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
          Legenda
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff3333', marginRight: 8 }}></div>
            <span style={{ color: 'white', fontSize: 11 }}>Divisi Pendakian</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#33ff33', marginRight: 8 }}></div>
            <span style={{ color: 'white', fontSize: 11 }}>Divisi Panjat Tebing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3333ff', marginRight: 8 }}></div>
            <span style={{ color: 'white', fontSize: 11 }}>Divisi Paralayang</span>
          </div>
        </div>
      </div>
      
      {/* Bottom copyright bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 15px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderTop: '1px solid #333',
        color: '#999'
      }}>
        <div>
          © Astacala 2025
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
        }}>
          © MapTiler © OpenStreetMap contributors
        </div>
      </div>
    </div>
  );
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