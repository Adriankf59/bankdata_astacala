import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter } from 'next/router';

const MapComponent = ({ 
  // Data props
  cavingData = [], 
  cavingAstPoints = [], 
  rockClimbingPoints = [], 
  issDataPoints = [],
  routeData = [],
  pointData = [],
  
  // Configuration props
  mode = 'exploration', // 'exploration' or 'pda'
  pdaName = null,
  showFilters = true,
  showDivisionLegend = true,
  centerCoordinates = [110, -7],
  defaultZoom = null,
  title = 'Webgis Astacala'
}) => {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [showMapStyles, setShowMapStyles] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    all: true,
    pendaki: true,
    panjatTebing: true,
    paralayang: true,
    caving: true,
    astacalaOnly: false
  });
  
  const key = 'Bt7BC1waN22lhYojEJO1';

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine default zoom based on mode and device
  const getDefaultZoom = () => {
    if (defaultZoom) return defaultZoom;
    if (mode === 'pda') return isMobile ? 11 : 12;
    return isMobile ? 5 : 6;
  };

  // Combine all activity points for exploration mode
  const activitiesPoints = [
    { 
      name: 'Gunung Parang', 
      description: 'Tebing populer untuk panjat tebing di Jawa Barat.', 
      coordinates: [107.3456, -6.7462],
      division: 'pendaki',
      source: 'static'
    },
    { 
      name: 'Goa Jatijajar', 
      description: 'Gua indah dengan stalaktit dan stalagmit.', 
      coordinates: [109.8503, -7.7419],
      division: 'pendaki',
      source: 'static'
    },
    { 
      name: 'Gunung Banyak', 
      description: 'Lokasi populer paralayang di Jawa Timur.', 
      coordinates: [112.5191, -7.8822],
      division: 'paralayang',
      source: 'static'
    },
  ];

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilterPanel(!showFilterPanel);
  };
  
  // Handle filter changes
  const handleFilterChange = (division) => {
    let newFilters = { ...activeFilters };
    
    if (division === 'all') {
      const newValue = !activeFilters.all;
      newFilters = {
        ...newFilters,
        all: newValue,
        pendaki: newValue,
        panjatTebing: newValue,
        paralayang: newValue,
        caving: newValue
      };
    } else if (division === 'astacalaOnly') {
      newFilters.astacalaOnly = !newFilters.astacalaOnly;
    } else {
      newFilters[division] = !newFilters[division];
      newFilters.all = newFilters.pendaki && newFilters.panjatTebing && newFilters.paralayang && newFilters.caving;
    }
    
    setActiveFilters(newFilters);
    
    if (map && mode === 'exploration') {
      applyFiltersToMap(newFilters);
    }
  };
  
  // Apply filters to exploration mode map
  const applyFiltersToMap = (filters) => {
    if (!map || !map.getLayer('points-layer')) return;
    
    let filterArray = ['all'];
    const divisionFilter = ['any'];
    
    if (filters.pendaki) {
      divisionFilter.push(['==', ['get', 'division'], 'pendaki']);
    }
    
    if (filters.panjatTebing) {
      divisionFilter.push(['==', ['get', 'division'], 'panjatTebing']);
    }
    
    if (filters.paralayang) {
      divisionFilter.push(['==', ['get', 'division'], 'paralayang']);
    }

    if (filters.caving) {
      divisionFilter.push(['==', ['get', 'division'], 'caving']);
    }
    
    filterArray.push(divisionFilter);
    
    if (filters.astacalaOnly) {
      filterArray.push([
        'any',
        ['==', ['get', 'source'], 'astacala'],
        ['==', ['get', 'source'], 'static']
      ]);
    }
    
    if (divisionFilter.length === 1) {
      map.setFilter('points-layer', ['==', ['get', 'division'], 'none-existent-division']);
    } else {
      map.setFilter('points-layer', filterArray);
    }
  };
  
  // Add exploration mode points
  const addExplorationPoints = (mapInstance) => {
    const allPoints = [
      ...activitiesPoints,
      ...cavingData,
      ...cavingAstPoints,
      ...rockClimbingPoints,
      ...issDataPoints
    ];
    
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
              source: p.source || 'unknown',
              id: p.id || undefined,
              // All other properties...
              kegiatan: p.kegiatan || null,
              kota: p.kota || null,
              provinsi: p.provinsi || null,
              linkRop: p.linkRop || null,
              // ... (include all other properties as in original)
            }
          }))
        }
      });
      
      const circleRadius = isMobile ? 6 : 7;
      
      mapInstance.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'activities-points',
        paint: {
          'circle-radius': circleRadius,
          'circle-color': [
            'match',
            ['get', 'division'],
            'pendaki', '#ff3333',
            'panjatTebing', '#33ff33',
            'paralayang', '#3333ff',
            'caving', '#ffcc00',
            '#ff3333'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
      
      applyFiltersToMap(activeFilters);
      
      // Add click handler for exploration points
      mapInstance.on('click', 'points-layer', (e) => {
        const feature = e.features[0];
        const divisionNames = {
          pendaki: 'Divisi Pendakian',
          panjatTebing: 'Divisi Panjat Tebing',
          paralayang: 'Divisi Paralayang',
          caving: 'Divisi Caving'
        };
        
        // Create popup content (simplified for brevity)
        const popupContent = `
          <div style="padding: ${isMobile ? '12px' : '16px'};">
            <h3 style="font-size: ${isMobile ? '14px' : '16px'}; margin: 0 0 8px 0;">
              ${feature.properties.name}
            </h3>
            <p style="color: #6c757d; font-size: ${isMobile ? '12px' : '14px'};">
              ${divisionNames[feature.properties.division]}
            </p>
          </div>
        `;
        
        new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          maxWidth: isMobile ? '85vw' : '350px'
        })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(popupContent)
        .addTo(mapInstance);
      });
    }
  };

  // Add PDA mode data
  const addPDAData = (mapInstance) => {
    if (!routeData || !pointData || routeData.length === 0 || pointData.length === 0) {
      console.warn('No PDA data to display');
      return;
    }

    // Add routes
    routeData.forEach((route, index) => {
      if (route.geom && route.geom.coordinates) {
        mapInstance.addSource(`route-${index}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route.geom,
            properties: {
              name: route.name || `Route ${index + 1}`,
              length: route.length || 0
            }
          }
        });

        mapInstance.addLayer({
          id: `route-line-${index}`,
          type: 'line',
          source: `route-${index}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ff3333',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        // Add click handler for route
        mapInstance.on('click', `route-line-${index}`, (e) => {
          const properties = e.features[0].properties;
          
          new maplibregl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: isMobile ? '85vw' : '300px'
          })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="padding: ${isMobile ? '12px' : '16px'};">
              <h3 style="font-size: ${isMobile ? '14px' : '16px'}; margin: 0 0 8px 0;">
                ${properties.name}
              </h3>
              <p style="font-size: ${isMobile ? '12px' : '14px'};">
                Panjang: ${properties.length ? properties.length.toFixed(2) : '0'} km
              </p>
            </div>
          `)
          .addTo(mapInstance);
        });
      }
    });

    // Add points
    const pointFeatures = pointData.map(point => ({
      type: 'Feature',
      geometry: point.geom,
      properties: {
        name: point.name || 'Unknown Point',
        elevation: point.elev_1 || 'N/A'
      }
    }));

    mapInstance.addSource('pda-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: pointFeatures
      }
    });

    mapInstance.addLayer({
      id: 'pda-points-layer',
      type: 'circle',
      source: 'pda-points',
      paint: {
        'circle-radius': isMobile ? 8 : 10,
        'circle-color': '#3333ff',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    mapInstance.addLayer({
      id: 'pda-points-labels',
      type: 'symbol',
      source: 'pda-points',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Regular'],
        'text-size': isMobile ? 10 : 12,
        'text-offset': [0, 1.5],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1
      }
    });

    // Fit bounds to PDA data
    const bounds = new maplibregl.LngLatBounds();

    routeData.forEach(route => {
      if (route.geom && route.geom.coordinates) {
        route.geom.coordinates.forEach(coord => {
          bounds.extend([coord[0], coord[1]]);
        });
      }
    });

    pointData.forEach(point => {
      if (point.geom && point.geom.coordinates) {
        bounds.extend(point.geom.coordinates);
      }
    });

    if (!bounds.isEmpty()) {
      mapInstance.fitBounds(bounds, {
        padding: isMobile ? 50 : 100,
        maxZoom: 15
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
          map.setTerrain(null);
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
      map.once('style.load', () => {
        map.setCenter(c); map.setZoom(z); map.setPitch(p); map.setBearing(b);
        
        if (is3D) {
          if (!map.getSource('terrain')) {
            map.addSource('terrain', {
              type: 'raster-dem',
              url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
            });
          }
          map.setTerrain({ source: 'terrain' });
        }
        
        // Re-add data based on mode
        if (mode === 'exploration') {
          addExplorationPoints(map);
        } else if (mode === 'pda') {
          addPDAData(map);
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
      zoom: getDefaultZoom(),
      maxPitch: 85,
      attributionControl: false
    });
    
    newMap.addControl(new maplibregl.NavigationControl({
      showCompass: true
    }), 'top-right');
    
    newMap.on('load', () => {
      if (mode === 'exploration') {
        addExplorationPoints(newMap);
      } else if (mode === 'pda') {
        addPDAData(newMap);
      }
    });
    
    setMap(newMap);
    
    return () => newMap.remove();
  }, []);

  // Dynamic button size based on device
  const buttonSize = isMobile ? '32px' : '36px';
  const toolButtonStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    fontSize: isMobile ? '16px' : '20px'
  };

  // Determine back button destination
  const getBackDestination = () => {
    if (mode === 'pda') return '/activities/diksar';
    return '/';
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh',
      backgroundColor: '#000'
    }}>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
      `}</style>
      
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
        left: isMobile ? 10 : 15,
        top: mode === 'pda' ? 15 : '50%',
        transform: mode === 'pda' ? 'none' : 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '8px' : '10px',
        zIndex: 10,
        animation: 'slideIn 0.6s ease-out'
      }}>
        {/* Back button */}
        <button 
          onClick={() => router.push(getBackDestination())}
          className="hover-lift"
          style={{
            ...toolButtonStyle,
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: '1px solid #333',
            transition: 'all 0.3s ease'
          }}
        >
          {mode === 'pda' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          )}
        </button>
        
        {/* Filter button - only show in exploration mode */}
        {mode === 'exploration' && showFilters && (
          <button 
            onClick={toggleFilters}
            className="hover-lift"
            style={{
              ...toolButtonStyle,
              backgroundColor: showFilterPanel ? '#ff3333' : '#1a1a1a',
              color: 'white',
              border: showFilterPanel ? '1px solid #ff3333' : '1px solid #333',
              transition: 'all 0.3s ease'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        )}
      </div>
      
      {/* Filter panel - only show in exploration mode */}
      {mode === 'exploration' && showFilterPanel && (
        <div style={{
          position: 'absolute',
          left: isMobile ? 50 : 60,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: isMobile ? '10px' : '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          border: '1px solid #ff3333',
          zIndex: 10,
          minWidth: isMobile ? '180px' : '200px',
          animation: 'slideIn 0.3s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Filter content as before */}
          <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 'bold', color: '#ff3333', marginBottom: 10 }}>
            Filter Divisi
          </div>
          {/* ... filter checkboxes ... */}
        </div>
      )}
      
      {/* Title header */}
      <div style={{
        position: 'absolute',
        top: isMobile ? 10 : 15,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: isMobile ? '6px 12px' : '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        border: '1px solid #ff3333',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          fontSize: isMobile ? 16 : 20, 
          fontWeight: 'bold', 
          color: '#ff3333', 
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: isMobile ? '0.5px' : '1px'
        }}>
          {mode === 'pda' ? 'Peta PDA' : title}
        </h1>
        {mode === 'pda' && pdaName && (
          <p style={{
            fontSize: isMobile ? 10 : 12,
            color: '#aaa',
            margin: '4px 0 0 0'
          }}>
            {pdaName}
          </p>
        )}
      </div>
      
      {/* Map controls - Right side */}
      <div style={{
        position: 'absolute',
        right: isMobile ? 10 : 15,
        top: mode === 'pda' ? '50%' : 100,
        transform: mode === 'pda' ? 'translateY(-50%)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '8px' : '10px',
        zIndex: 10
      }}>
        {/* 3D toggle */}
        <button 
          onClick={toggle3D}
          className="hover-lift"
          style={{
            ...toolButtonStyle,
            backgroundColor: is3D ? '#ff3333' : '#1a1a1a',
            color: 'white',
            border: is3D ? '1px solid #ff3333' : '1px solid #333'
          }}
          title="Toggle 3D Terrain"
        >
          <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 'bold' }}>3D</span>
        </button>

        {/* Map style toggle */}
        <button 
          onClick={() => changeMapStyle(mapStyle === 'outdoor' ? 'satellite' : 'outdoor')}
          className="hover-lift"
          style={{
            ...toolButtonStyle,
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: '1px solid #333'
          }}
          title="Change Map Style"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
          </svg>
        </button>
      </div>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 40 : 40,
        right: isMobile ? 10 : 15,
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'row-reverse',
        gap: '8px'
      }}>
        {/* Toggle button for legend */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="hover-lift"
          style={{
            ...toolButtonStyle,
            backgroundColor: showLegend ? '#ff3333' : '#1a1a1a',
            color: 'white',
            border: showLegend ? '1px solid #ff3333' : '1px solid #333'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
        
        {/* Legend content */}
        {showLegend && (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: isMobile ? '8px 10px' : '10px 15px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            border: '1px solid #333',
            maxWidth: isMobile ? '150px' : 'auto',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
              Legenda
            </div>
            {mode === 'exploration' && showDivisionLegend ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { color: '#ff3333', label: 'Divisi Pendakian' },
                  { color: '#33ff33', label: 'Divisi Panjat Tebing' },
                  { color: '#3333ff', label: 'Divisi Paralayang' },
                  { color: '#ffcc00', label: 'Divisi Caving' }
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: isMobile ? 10 : 12, 
                      height: isMobile ? 10 : 12, 
                      borderRadius: '50%', 
                      backgroundColor: item.color, 
                      marginRight: 8
                    }}></div>
                    <span style={{ color: 'white', fontSize: isMobile ? 10 : 11 }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : mode === 'pda' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: 20, 
                    height: 3, 
                    backgroundColor: '#ff3333', 
                    marginRight: 8
                  }}></div>
                  <span style={{ color: 'white', fontSize: isMobile ? 10 : 11 }}>
                    Jalur PDA
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: isMobile ? 10 : 12, 
                    height: isMobile ? 10 : 12, 
                    borderRadius: '50%', 
                    backgroundColor: '#3333ff', 
                    marginRight: 8
                  }}></div>
                  <span style={{ color: 'white', fontSize: isMobile ? 10 : 11 }}>
                    Point PDA
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        )}
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
        padding: isMobile ? '6px 10px' : '8px 15px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderTop: '1px solid #333',
        color: '#999',
        fontSize: isMobile ? '11px' : '13px',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          © Astacala 2025 {mode === 'pda' ? '- Peta PDA' : ''}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;