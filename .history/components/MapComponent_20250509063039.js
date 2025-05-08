import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter } from 'next/router';

const MapComponent = ({ cavingData = [] }) => {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    all: true,
    pendaki: true,
    panjatTebing: true,
    paralayang: true,
    caving: true // Add caving filter
  });

  // Calculate the count of points for each division
  const divisionCounts = {
    pendaki: activitiesPoints.filter(p => p.division === 'pendaki').length,
    panjatTebing: activitiesPoints.filter(p => p.division === 'panjatTebing').length,
    paralayang: activitiesPoints.filter(p => p.division === 'paralayang').length,
    caving: cavingData.length
  };
  
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
    let newFilters = { ...activeFilters };
    
    if (division === 'all') {
      // Toggle all filters together
      const newValue = !activeFilters.all;
      newFilters = {
        all: newValue,
        pendaki: newValue,
        panjatTebing: newValue,
        paralayang: newValue,
        caving: newValue
      };
    } else {
      // Toggle just this one division
      newFilters[division] = !newFilters[division];
      
      // Update 'all' checkbox based on other checkboxes
      newFilters.all = newFilters.pendaki && newFilters.panjatTebing && newFilters.paralayang && newFilters.caving;
    }
    
    // Update state
    setActiveFilters(newFilters);
    
    // Apply filters to map
    if (map) {
      applyFiltersToMap(newFilters);
    }
  };
  
  // Apply filters directly to the map with given filter state
  const applyFiltersToMap = (filters) => {
    if (!map || !map.getLayer('points-layer')) return;
    
    // Create a filter array for maplibre-gl
    const filterArray = ['any'];
    
    // Add conditions for each selected division
    if (filters.pendaki) {
      filterArray.push(['==', ['get', 'division'], 'pendaki']);
    }
    
    if (filters.panjatTebing) {
      filterArray.push(['==', ['get', 'division'], 'panjatTebing']);
    }
    
    if (filters.paralayang) {
      filterArray.push(['==', ['get', 'division'], 'paralayang']);
    }

    if (filters.caving) {
      filterArray.push(['==', ['get', 'division'], 'caving']);
    }
    
    // If no division is selected, hide all points
    if (filterArray.length === 1) {
      // Use a filter that won't match any points
      map.setFilter('points-layer', ['==', ['get', 'division'], 'none-existent-division']);
    } else {
      // Apply the filter
      map.setFilter('points-layer', filterArray);
    }
  };
  
  // Function to add activity points to the map
  const addActivityPoints = (mapInstance) => {
    // Combine static points with caving data
    const allPoints = [...activitiesPoints, ...cavingData];
    
    // Check if the source already exists before adding it
    if (!mapInstance.getSource('activities-points')) {
      mapInstance.addSource('activities-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: allPoints.map(p => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: p.coordinates },
            properties: { 
              name: p.name, 
              description: p.description,
              division: p.division,
              id: p.id || undefined,
              // Include cave data as direct properties
              karakterLorong: p.karakterLorong || null,
              totalKedalaman: p.totalKedalaman || null,
              totalPanjang: p.totalPanjang || null
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
            'caving', '#ffcc00', // Color for caving division
            '#ff3333' // default color
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
      
      // Apply initial filters
      applyFiltersToMap(activeFilters);
      
      // Add click handler for popups
      mapInstance.on('click', 'points-layer', (e) => {
        const feature = e.features[0];
        console.log("Clicked feature:", feature);
        console.log("Feature properties:", feature.properties);
        console.log("Cave data:", feature.properties.caveData);
        
        // Get the color based on division
        let color = '#ff3333'; // default
        if (feature.properties.division === 'pendaki') color = '#ff3333';
        if (feature.properties.division === 'panjatTebing') color = '#33ff33';
        if (feature.properties.division === 'paralayang') color = '#3333ff';
        if (feature.properties.division === 'caving') color = '#ffcc00'; // Color for caving
        
        // Division names in Indonesian
        const divisionNames = {
          pendaki: 'Divisi Pendakian',
          panjatTebing: 'Divisi Panjat Tebing',
          paralayang: 'Divisi Paralayang',
          caving: 'Divisi Caving' // Division name for caving
        };
        
        // Create popup content based on division
        let popupContent = '';
        
        if (feature.properties.division === 'caving') {
          // Special formatting for cave division with more contrast
          popupContent = `
            <div style="color: white; background-color: rgba(0,0,0,0.7); padding: 8px; border-radius: 4px; border-left: 3px solid ${color};">
              <div style="font-weight: bold; color: ${color}; margin-bottom: 8px; font-size: 18px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                Gua ${feature.properties.name}
              </div>
              <div style="font-size: 13px; color: #ffffff; margin-bottom: 5px; font-weight: bold;">
                ${divisionNames[feature.properties.division]}
              </div>
              <div style="margin-top: 10px; font-size: 14px; line-height: 1.5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="font-weight: bold; color: #ffcc00; padding-right: 10px; width: 130px;">Karakter Lorong:</td>
                    <td style="color: white;">${feature.properties.karakterLorong || 'Tidak tersedia'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #ffcc00; padding-right: 10px; width: 130px;">Total Kedalaman:</td>
                    <td style="color: white;">${feature.properties.totalKedalaman ? 
                      (parseFloat(feature.properties.totalKedalaman).toFixed(2) + ' m') : 
                      'Tidak tersedia'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #ffcc00; padding-right: 10px; width: 130px;">Total Panjang:</td>
                    <td style="color: white;">${feature.properties.totalPanjang ? 
                      (parseFloat(feature.properties.totalPanjang).toFixed(2) + ' m') : 
                      'Tidak tersedia'}</td>
                  </tr>
                </table>
              </div>
            </div>
          `;
        } else {
          // Standard popup for other divisions
          popupContent = `
            <div style="color: white;">
              <div style="font-weight: bold; color: ${color}; margin-bottom: 5px; font-size: 16px;">
                ${feature.properties.name}
              </div>
              <div style="font-size: 12px; color: #aaa; margin-bottom: 5px;">
                ${divisionNames[feature.properties.division]}
              </div>
              <div>${feature.properties.description}</div>
            </div>
          `;
        }
        
        // Custom dark popup style
        const popup = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          className: 'dark-popup'
        })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(popupContent)
        .addTo(mapInstance);
      });
    } else {
      // If the source already exists, update the data
      mapInstance.getSource('activities-points').setData({
        type: 'FeatureCollection',
        features: allPoints.map(p => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: p.coordinates },
          properties: { 
            name: p.name, 
            description: p.description,
            division: p.division,
            id: p.id || undefined,
            // Include cave data as direct properties
            karakterLorong: p.karakterLorong || null,
            totalKedalaman: p.totalKedalaman || null,
            totalPanjang: p.totalPanjang || null
          }
        }))
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
        {/* Home button */}
        <button 
          onClick={() => router.push('/')}
          style={{
            ...toolButtonStyle,
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: '1px solid #333'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
        
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
              Divisi Pendakian ({divisionCounts.pendaki})
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#33ff33', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.panjatTebing}
                onChange={() => handleFilterChange('panjatTebing')}
                style={{ marginRight: '8px' }}
              />
              Divisi Panjat Tebing ({divisionCounts.panjatTebing})
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#3333ff', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.paralayang}
                onChange={() => handleFilterChange('paralayang')}
                style={{ marginRight: '8px' }}
              />
              Divisi Paralayang ({divisionCounts.paralayang})
            </label>
            {/* Add caving checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', color: '#ffcc00', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.caving}
                onChange={() => handleFilterChange('caving')}
                style={{ marginRight: '8px' }}
              />
              Divisi Caving ({divisionCounts.caving})
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
        {['street', 'outdoor', 'satellite'].map(style => (
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
            <span style={{ color: 'white', fontSize: 11 }}>Divisi Pendakian ({divisionCounts.pendaki})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#33ff33', marginRight: 8 }}></div>
            <span style={{ color: 'white', fontSize: 11 }}>Divisi Panjat Tebing ({divisionCounts.panjatTebing})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3333ff', marginRight: 8 }}></div>
            <span style={{ color: 'white', fontSize: 11 }}>Divisi Paralayang ({divisionCounts.paralayang})</span>
          </div>
          {/* Add caving to legend */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffcc00', marginRight: 8 }}></div>
            <span style={{ color: 'white', fontSize: 11 }}>Divisi Caving ({divisionCounts.caving})</span>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 15px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderTop: '1px solid #333',
        color: '#999'
      }}>
        <div>
          © Astacala 2025
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