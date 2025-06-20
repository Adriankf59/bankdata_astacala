import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Head from 'next/head';
import Link from 'next/link';

// Fetch data server-side to avoid CORS issues
export async function getServerSideProps(context) {
  const { jalur, point, nama } = context.query;
  
  if (!jalur || !point) {
    return {
      props: {
        routeData: [],
        pointData: [],
        nama: nama || null,
        error: 'Missing required parameters'
      }
    };
  }

  const baseURL = 'http://52.64.175.183';
  
  try {
    // Fetch route data
    const routeResponse = await fetch(`${baseURL}/items/${jalur}?limit=-1`);
    if (!routeResponse.ok) {
      throw new Error(`Route fetch failed: ${routeResponse.status}`);
    }
    const routeJson = await routeResponse.json();

    // Fetch point data
    const pointResponse = await fetch(`${baseURL}/items/${point}?limit=-1`);
    if (!pointResponse.ok) {
      throw new Error(`Point fetch failed: ${pointResponse.status}`);
    }
    const pointJson = await pointResponse.json();

    return {
      props: {
        routeData: routeJson.data || [],
        pointData: pointJson.data || [],
        nama: nama || null,
        error: null
      }
    };
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return {
      props: {
        routeData: [],
        pointData: [],
        nama: nama || null,
        error: error.message
      }
    };
  }
}

const PDAMapPage = ({ routeData, pointData, nama, error }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const [is3D, setIs3D] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Store event listeners to remove them later
  const eventListenersRef = useRef([]);

  // Function to remove all event listeners
  const removeAllEventListeners = (mapInstance) => {
    eventListenersRef.current.forEach(({ type, layer, handler }) => {
      mapInstance.off(type, layer, handler);
    });
    eventListenersRef.current = [];
  };

  // Function to add event listener and track it
  const addTrackedEventListener = (mapInstance, type, layer, handler) => {
    mapInstance.on(type, layer, handler);
    eventListenersRef.current.push({ type, layer, handler });
  };

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !routeData || !pointData || routeData.length === 0 || pointData.length === 0) return;

    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${key}`,
      center: [107.38, -7.12], // Default center for Indonesia
      zoom: isMobile ? 11 : 12,
      maxPitch: 85,
      attributionControl: false
    });

    newMap.addControl(new maplibregl.NavigationControl({
      showCompass: true
    }), 'top-right');

    // Wait for map to be fully loaded before adding data
    newMap.on('load', () => {
      console.log('Map loaded, adding data...');
      addDataToMap(newMap);
      
      // Fit bounds after data is added
      setTimeout(() => {
        fitMapToBounds(newMap);
      }, 500);
    });

    setMap(newMap);

    return () => {
      if (newMap) {
        removeAllEventListeners(newMap);
        newMap.remove();
      }
    };
  }, []); // Only run once on mount

  // Fit map to show all data
  const fitMapToBounds = (mapInstance) => {
    if (!routeData || !pointData || routeData.length === 0 || pointData.length === 0) return;
    
    const bounds = new maplibregl.LngLatBounds();

    // Add route coordinates to bounds
    routeData.forEach(route => {
      if (route.geom && route.geom.coordinates) {
        route.geom.coordinates.forEach(coord => {
          if (coord && coord.length >= 2) {
            bounds.extend([coord[0], coord[1]]);
          }
        });
      }
    });

    // Add point coordinates to bounds
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

  // Add route and point data to map
  const addDataToMap = (mapInstance) => {
    if (!mapInstance || !routeData || !pointData || routeData.length === 0 || pointData.length === 0) {
      console.warn('No data to display on map');
      return;
    }

    console.log('Adding data to map...', { routeData: routeData.length, pointData: pointData.length });

    // Add routes
    routeData.forEach((route, index) => {
      if (route.geom && route.geom.coordinates && route.geom.coordinates.length > 0) {
        const sourceId = `route-${index}`;
        const layerId = `route-line-${index}`;
        
        // Remove existing source/layer if present
        if (mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
        }
        if (mapInstance.getSource(sourceId)) {
          mapInstance.removeSource(sourceId);
        }
        
        // Add source for each route
        mapInstance.addSource(sourceId, {
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

        // Add line layer for route
        mapInstance.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
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
        const clickHandler = (e) => {
          const properties = e.features[0].properties;
          
          new maplibregl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: isMobile ? '85vw' : '300px'
          })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="
              padding: ${isMobile ? '12px' : '16px'};
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              <h3 style="
                font-size: ${isMobile ? '14px' : '16px'};
                font-weight: 600;
                margin: 0 0 8px 0;
                color: #2c3e50;
              ">${properties.name}</h3>
              <div style="
                display: flex;
                align-items: center;
                gap: 4px;
                color: #6c757d;
                font-size: ${isMobile ? '12px' : '14px'};
              ">
                <i class="fas fa-route" style="color: #ff3333;"></i>
                <span>Panjang: ${properties.length ? properties.length.toFixed(2) : '0'} km</span>
              </div>
            </div>
          `)
          .addTo(mapInstance);
        };
        
        const mouseEnterHandler = () => {
          mapInstance.getCanvas().style.cursor = 'pointer';
        };
        
        const mouseLeaveHandler = () => {
          mapInstance.getCanvas().style.cursor = '';
        };
        
        addTrackedEventListener(mapInstance, 'click', layerId, clickHandler);
        addTrackedEventListener(mapInstance, 'mouseenter', layerId, mouseEnterHandler);
        addTrackedEventListener(mapInstance, 'mouseleave', layerId, mouseLeaveHandler);
      }
    });

    // Remove existing point layers/sources
    if (mapInstance.getLayer('points-labels')) {
      mapInstance.removeLayer('points-labels');
    }
    if (mapInstance.getLayer('points-layer')) {
      mapInstance.removeLayer('points-layer');
    }
    if (mapInstance.getSource('points')) {
      mapInstance.removeSource('points');
    }

    // Add points
    const pointFeatures = pointData.map(point => ({
      type: 'Feature',
      geometry: point.geom,
      properties: {
        name: point.name || 'Unknown Point',
        elevation: point.elev_1 || 'N/A'
      }
    })).filter(f => f.geometry && f.geometry.coordinates);

    if (pointFeatures.length > 0) {
      mapInstance.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pointFeatures
        }
      });

      // Add point layer
      mapInstance.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': isMobile ? 8 : 10,
          'circle-color': '#3333ff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add labels for points
      mapInstance.addLayer({
        id: 'points-labels',
        type: 'symbol',
        source: 'points',
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

      // Add click handler for points
      const pointClickHandler = (e) => {
        const properties = e.features[0].properties;
        
        new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          maxWidth: isMobile ? '85vw' : '300px'
        })
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`
          <div style="
            padding: ${isMobile ? '12px' : '16px'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">
            <h3 style="
              font-size: ${isMobile ? '14px' : '16px'};
              font-weight: 600;
              margin: 0 0 8px 0;
              color: #2c3e50;
            ">${properties.name}</h3>
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              color: #6c757d;
              font-size: ${isMobile ? '12px' : '14px'};
            ">
              <i class="fas fa-mountain" style="color: #3333ff;"></i>
              <span>Elevasi: ${properties.elevation} m</span>
            </div>
          </div>
        `)
        .addTo(mapInstance);
      };
      
      const pointMouseEnterHandler = () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      };
      
      const pointMouseLeaveHandler = () => {
        mapInstance.getCanvas().style.cursor = '';
      };
      
      addTrackedEventListener(mapInstance, 'click', 'points-layer', pointClickHandler);
      addTrackedEventListener(mapInstance, 'mouseenter', 'points-layer', pointMouseEnterHandler);
      addTrackedEventListener(mapInstance, 'mouseleave', 'points-layer', pointMouseLeaveHandler);
    }

    console.log('Data added successfully');
  };

  // Toggle 3D terrain
  const toggle3D = () => {
    if (!map) return;
    
    setIs3D(v => {
      const next = !v;
      
      if (next) {
        // Enable 3D
        if (!map.getSource('terrain')) {
          map.addSource('terrain', {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
          });
        }
        map.setTerrain({ source: 'terrain' });
      } else {
        // Disable 3D
        map.setTerrain(null);
        // Don't remove the source as it might be used later
      }
      
      return next;
    });
  };

  // Change map style
  const changeMapStyle = (newStyle) => {
    if (!map || !map.loaded()) return;
    
    console.log('Changing map style to:', newStyle);
    setMapStyle(newStyle);
    
    // Store current map state
    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();
    
    // Remove all event listeners before changing style
    removeAllEventListeners(map);
    
    // Set new style
    map.setStyle(`https://api.maptiler.com/maps/${newStyle}/style.json?key=${key}`);
    
    // Use multiple event handlers to ensure data is re-added
    const handleStyleLoad = () => {
      console.log('Style loaded, restoring map state...');
      
      // Restore map position
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);
      
      // Re-add terrain if 3D is enabled
      if (is3D) {
        try {
          if (!map.getSource('terrain')) {
            map.addSource('terrain', {
              type: 'raster-dem',
              url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
            });
          }
          map.setTerrain({ source: 'terrain' });
        } catch (err) {
          console.error('Error adding terrain:', err);
        }
      }
      
      // Use requestAnimationFrame to ensure the style is fully rendered
      requestAnimationFrame(() => {
        console.log('Re-adding data layers...');
        addDataToMap(map);
        
        // Fit bounds after a short delay
        setTimeout(() => {
          fitMapToBounds(map);
        }, 300);
      });
    };
    
    // Listen for style.load event
    map.once('style.load', handleStyleLoad);
    
    // Also listen for idle event as a backup
    map.once('idle', () => {
      // Check if data layers exist, if not, add them
      if (!map.getLayer('points-layer')) {
        console.log('Data layers missing after idle, re-adding...');
        addDataToMap(map);
      }
    });
  };

  // Show error message if no data
  if (error || !routeData || !pointData || routeData.length === 0 || pointData.length === 0) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        zIndex: 1000
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{
            fontSize: '48px',
            color: '#ff3333',
            marginBottom: '20px'
          }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            color: '#fff', 
            marginBottom: '10px' 
          }}>
            Unable to Load Map Data
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#aaa', 
            marginBottom: '20px',
            maxWidth: '400px'
          }}>
            This might be due to browser extensions blocking the request. 
            Please disable ad-blockers or privacy extensions and try again.
          </p>
          <Link href="/activities/diksar">
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#ff3333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Back to Activities
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
    fontSize: isMobile ? '16px' : '20px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    border: '1px solid #333',
    transition: 'all 0.3s ease'
  };

  return (
    <>
      <Head>
        <title>{nama ? `Peta PDA - ${nama}` : 'Peta PDA'} - Astacala</title>
        <meta name="description" content={`Peta jalur dan point PDA ${nama || ''}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          }
        `}</style>
      </Head>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100vh',
        backgroundColor: '#000'
      }}>
        {/* Map container */}
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

        {/* Back button */}
        <div style={{
          position: 'absolute',
          left: isMobile ? 10 : 15,
          top: isMobile ? 10 : 15,
          zIndex: 10
        }}>
          <Link href="/activities/diksar">
            <button 
              className="hover-lift"
              style={toolButtonStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </Link>
        </div>

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
            fontSize: isMobile ? 14 : 18, 
            fontWeight: 'bold', 
            color: '#ff3333', 
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: isMobile ? '0.5px' : '1px'
          }}>
            Peta PDA
          </h1>
          {nama && (
            <p style={{
              fontSize: isMobile ? 10 : 12,
              color: '#aaa',
              margin: '4px 0 0 0'
            }}>
              {nama}
            </p>
          )}
        </div>

        {/* Map controls */}
        <div style={{
          position: 'absolute',
          right: isMobile ? 10 : 15,
          top: '50%',
          transform: 'translateY(-50%)',
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
            style={toolButtonStyle}
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
              <div style={{ 
                fontSize: isMobile ? 11 : 12, 
                fontWeight: 'bold', 
                color: 'white', 
                marginBottom: isMobile ? 6 : 8
              }}>
                Legenda
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '4px' : '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: 20, 
                    height: 3, 
                    backgroundColor: '#ff3333', 
                    marginRight: isMobile ? 6 : 8
                  }}></div>
                  <span style={{ 
                    color: 'white', 
                    fontSize: isMobile ? 10 : 11
                  }}>
                    Jalur PDA
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: isMobile ? 10 : 12, 
                    height: isMobile ? 10 : 12, 
                    borderRadius: '50%', 
                    backgroundColor: '#3333ff', 
                    marginRight: isMobile ? 6 : 8
                  }}></div>
                  <span style={{ 
                    color: 'white', 
                    fontSize: isMobile ? 10 : 11
                  }}>
                    Point PDA
                  </span>
                </div>
              </div>
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
            © Astacala 2025 - Peta PDA
          </div>
        </div>
      </div>
    </>
  );
};

export default PDAMapPage;