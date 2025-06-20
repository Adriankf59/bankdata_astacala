import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Head from 'next/head';
import Link from 'next/link';

// Fetch data server-side to avoid CORS issues
export async function getServerSideProps(context) {
  const { jalur, point, nama, sungai } = context.query;
  
  if (!jalur || !point) {
    return {
      props: {
        routeData: [],
        pointData: [],
        nama: nama || null,
        sungai: sungai || null,
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
        sungai: sungai || null,
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
        sungai: sungai || null,
        error: error.message
      }
    };
  }
}

const RiverMapPage = ({ routeData, pointData, nama, sungai, error }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const [is3D, setIs3D] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // MapTiler API key
  const MAPTILER_KEY = 'Bt7BC1waN22lhYojEJO1';

  // Store event listeners to remove them later
  const eventListenersRef = useRef([]);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Add river routes with blue color for water
    routeData.forEach((route, index) => {
      if (route.geom && route.geom.coordinates && route.geom.coordinates.length > 0) {
        const sourceId = `river-route-${index}`;
        const layerId = `river-line-${index}`;
        
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
              name: route.name || `Jalur Sungai ${index + 1}`,
              length: route.length || 0
            }
          }
        });

        // Add line layer for river route with blue color
        mapInstance.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#1e88e5',
            'line-width': 5,
            'line-opacity': 0.9
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
                margin-bottom: 4px;
              ">
                <i class="fas fa-water" style="color: #1e88e5;"></i>
                <span>Panjang: ${properties.length ? properties.length.toFixed(2) : '0'} km</span>
              </div>
              ${sungai ? `
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  color: #6c757d;
                  font-size: ${isMobile ? '12px' : '14px'};
                ">
                  <i class="fas fa-map-marker-alt" style="color: #1e88e5;"></i>
                  <span>${sungai}</span>
                </div>
              ` : ''}
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
    if (mapInstance.getLayer('river-points-labels')) {
      mapInstance.removeLayer('river-points-labels');
    }
    if (mapInstance.getLayer('river-points-layer')) {
      mapInstance.removeLayer('river-points-layer');
    }
    if (mapInstance.getSource('river-points')) {
      mapInstance.removeSource('river-points');
    }

    // Add checkpoint points with different colors based on type
    const pointFeatures = pointData.map(point => ({
      type: 'Feature',
      geometry: point.geom,
      properties: {
        name: point.name || 'Unknown Point',
        elevation: point.elev_1 || 'N/A',
        type: point.name && point.name.toLowerCase().includes('start') ? 'start' :
              point.name && point.name.toLowerCase().includes('finish') ? 'finish' : 'checkpoint'
      }
    })).filter(f => f.geometry && f.geometry.coordinates);

    if (pointFeatures.length > 0) {
      mapInstance.addSource('river-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pointFeatures
        }
      });

      // Add point layer with conditional coloring
      mapInstance.addLayer({
        id: 'river-points-layer',
        type: 'circle',
        source: 'river-points',
        paint: {
          'circle-radius': isMobile ? 8 : 10,
          'circle-color': [
            'case',
            ['==', ['get', 'type'], 'start'], '#4caf50',  // Green for start
            ['==', ['get', 'type'], 'finish'], '#f44336', // Red for finish
            '#ff9800'  // Orange for checkpoints
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add labels for points
      mapInstance.addLayer({
        id: 'river-points-labels',
        type: 'symbol',
        source: 'river-points',
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
              margin-bottom: 4px;
            ">
              <i class="fas fa-flag" style="color: ${
                properties.type === 'start' ? '#4caf50' :
                properties.type === 'finish' ? '#f44336' : '#ff9800'
              };"></i>
              <span>${properties.type === 'start' ? 'Titik Start' : 
                      properties.type === 'finish' ? 'Titik Finish' : 'Checkpoint'}</span>
            </div>
            ${properties.elevation !== 'N/A' ? `
              <div style="
                display: flex;
                align-items: center;
                gap: 4px;
                color: #6c757d;
                font-size: ${isMobile ? '12px' : '14px'};
              ">
                <i class="fas fa-mountain" style="color: #1e88e5;"></i>
                <span>Elevasi: ${properties.elevation} m</span>
              </div>
            ` : ''}
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
      
      addTrackedEventListener(mapInstance, 'click', 'river-points-layer', pointClickHandler);
      addTrackedEventListener(mapInstance, 'mouseenter', 'river-points-layer', pointMouseEnterHandler);
      addTrackedEventListener(mapInstance, 'mouseleave', 'river-points-layer', pointMouseLeaveHandler);
    }

    console.log('River data added successfully');
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
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`
          });
        }
        map.setTerrain({ source: 'terrain' });
      } else {
        // Disable 3D
        map.setTerrain(null);
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
    map.setStyle(`https://api.maptiler.com/maps/${newStyle}/style.json?key=${MAPTILER_KEY}`);
    
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
              url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`
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
      if (!map.getLayer('river-points-layer')) {
        console.log('Data layers missing after idle, re-adding...');
        addDataToMap(map);
      }
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !routeData || !pointData || routeData.length === 0 || pointData.length === 0) return;

    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${MAPTILER_KEY}`,
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
      console.log('Map loaded, adding river data...');
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
            color: '#1e88e5',
            marginBottom: '20px'
          }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            color: '#fff', 
            marginBottom: '10px' 
          }}>
            Unable to Load River Map Data
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#aaa', 
            marginBottom: '20px',
            maxWidth: '400px'
          }}>
            {error ? `Error: ${error}` : 'No data available to display'}
          </p>
          <Link href="/">
            <a style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#1e88e5',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1976d2'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1e88e5'}>
              Back to Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{nama ? `River Map - ${nama}` : 'River Map'}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
      
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
          padding: isMobile ? '10px 15px' : '15px 30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link href="/">
              <a style={{
                color: 'white',
                fontSize: isMobile ? '18px' : '20px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="fas fa-arrow-left"></i>
              </a>
            </Link>
            <h1 style={{ 
              margin: 0, 
              fontSize: isMobile ? '16px' : '20px',
              color: 'white',
              fontWeight: '600'
            }}>
              <i className="fas fa-water" style={{ marginRight: '8px' }}></i>
              {nama || 'River Map'}
            </h1>
          </div>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setShowLegend(!showLegend)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-bars"></i>
            </button>
          )}
        </div>

        {/* Map Container */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapContainerRef} style={{ 
            width: '100%', 
            height: '100%',
            background: '#121212'
          }} />

          {/* Controls Panel */}
          <div style={{
            position: 'absolute',
            bottom: isMobile ? '10px' : '20px',
            left: isMobile ? '10px' : '20px',
            background: 'rgba(0,0,0,0.9)',
            borderRadius: '8px',
            padding: isMobile ? '10px' : '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
            zIndex: 100
          }}>
            {/* Map Style Buttons */}
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => changeMapStyle('outdoor')}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  fontSize: isMobile ? '12px' : '14px',
                  background: mapStyle === 'outdoor' ? '#1e88e5' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <i className="fas fa-map"></i> Outdoor
              </button>
              <button
                onClick={() => changeMapStyle('satellite')}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  fontSize: isMobile ? '12px' : '14px',
                  background: mapStyle === 'satellite' ? '#1e88e5' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <i className="fas fa-satellite"></i> Satellite
              </button>
            </div>

            {/* 3D Toggle */}
            <button
              onClick={toggle3D}
              style={{
                padding: isMobile ? '6px 10px' : '8px 12px',
                fontSize: isMobile ? '12px' : '14px',
                background: is3D ? '#1e88e5' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <i className="fas fa-cube"></i> 3D Terrain
            </button>
          </div>

          {/* Legend */}
          {(!isMobile || showLegend) && (
            <div style={{
              position: 'absolute',
              top: isMobile ? '60px' : '20px',
              right: isMobile ? '10px' : '20px',
              background: 'rgba(0,0,0,0.9)',
              borderRadius: '8px',
              padding: isMobile ? '12px' : '15px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              minWidth: isMobile ? '150px' : '180px',
              zIndex: 100
            }}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                fontSize: isMobile ? '14px' : '16px',
                color: 'white',
                fontWeight: '600'
              }}>
                <i className="fas fa-info-circle"></i> Legend
              </h3>
              
              <div style={{ fontSize: isMobile ? '12px' : '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: '3px',
                    backgroundColor: '#1e88e5',
                    borderRadius: '2px'
                  }}></div>
                  <span style={{ color: '#ccc' }}>River Route</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#4caf50',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }}></div>
                  <span style={{ color: '#ccc' }}>Start Point</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#f44336',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }}></div>
                  <span style={{ color: '#ccc' }}>Finish Point</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#ff9800',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }}></div>
                  <span style={{ color: '#ccc' }}>Checkpoint</span>
                </div>
              </div>

              {sungai && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#ccc'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#1e88e5' }}></i>
                    <span>{sungai}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        
        .maplibregl-popup-content {
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          border-radius: 8px;
        }
        
        .maplibregl-popup-close-button {
          font-size: 20px;
          padding: 5px 10px;
          color: #666;
        }
        
        .maplibregl-popup-close-button:hover {
          color: #000;
          background-color: rgba(0,0,0,0.05);
        }
      `}</style>
    </>
  );
};

export default RiverMapPage;