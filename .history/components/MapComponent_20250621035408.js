import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter } from 'next/router';

const MapComponent = ({ cavingData = [], cavingAstPoints = [], rockClimbingPoints = [], issDataPoints = [], divingPoints = [], paralayangPoints = [] }) => {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // Gunakan ref untuk menyimpan instance map agar tidak memicu re-render
  const popupRef = useRef(null); // Ref untuk popup yang sedang aktif

  const [is3D, setIs3D] = useState(false);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [showMapStyles, setShowMapStyles] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    all: true,
    pendaki: true,
    panjatTebing: true,
    paralayang: true,
    caving: true,
    diving: true,
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

  const activitiesPoints = [
    { name: 'Gunung Parang', description: 'Tebing populer untuk panjat tebing di Jawa Barat.', coordinates: [107.3456, -6.7462], division: 'panjatTebing', source: 'static' },
    { name: 'Goa Jatijajar', description: 'Gua indah dengan stalaktit dan stalagmit.', coordinates: [109.8503, -7.7419], division: 'caving', source: 'static' },
    { name: 'Gunung Banyak', description: 'Lokasi populer paralayang di Jawa Timur.', coordinates: [112.5191, -7.8822], division: 'paralayang', source: 'static' },
  ];

  const centerCoordinates = [110, -7];

  // Toggle filter visibility
  const toggleFilters = () => setShowFilters(!showFilters);

  // Apply filters directly to the map with given filter state
  const applyFiltersToMap = (filters) => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('points-layer')) return;

    const divisionFilter = ['any'];
    if (filters.pendaki) divisionFilter.push(['==', ['get', 'division'], 'pendaki']);
    if (filters.panjatTebing) divisionFilter.push(['==', ['get', 'division'], 'panjatTebing']);
    if (filters.paralayang) divisionFilter.push(['==', ['get', 'division'], 'paralayang']);
    if (filters.caving) divisionFilter.push(['==', ['get', 'division'], 'caving']);
    if (filters.diving) divisionFilter.push(['==', ['get', 'division'], 'diving']);

    let filterArray = ['all'];
    
    if (divisionFilter.length > 1) {
      filterArray.push(divisionFilter);
    } else {
      // Jika tidak ada divisi yang dipilih, filter agar tidak ada yang muncul
      filterArray.push(['==', ['get', 'division'], 'none-existent-division']);
    }

    if (filters.astacalaOnly) {
      filterArray.push(['any', ['==', ['get', 'source'], 'astacala'], ['==', ['get', 'source'], 'static']]);
    }

    map.setFilter('points-layer', filterArray.length > 1 ? filterArray : null);
  };

  // Handle filter changes
  const handleFilterChange = (division) => {
    setActiveFilters(prevFilters => {
      let newFilters = { ...prevFilters };
      if (division === 'all') {
        const newValue = !prevFilters.all;
        newFilters = { ...newFilters, all: newValue, pendaki: newValue, panjatTebing: newValue, paralayang: newValue, caving: newValue, diving: newValue };
      } else if (division === 'astacalaOnly') {
        newFilters.astacalaOnly = !newFilters.astacalaOnly;
      } else {
        newFilters[division] = !newFilters[division];
        newFilters.all = newFilters.pendaki && newFilters.panjatTebing && newFilters.paralayang && newFilters.caving && newFilters.diving;
      }
      // Apply filters immediately after state update
      applyFiltersToMap(newFilters);
      return newFilters;
    });
  };

  // Helper function to create popup HTML content
  const createPopupHTML = (feature) => {
    const { properties, geometry } = feature;
    const {
        name, division, description, source, id, kegiatan, kota, provinsi, linkRop,
        waktuKegiatan, karakterLorong, kedalaman, totalKedalaman, totalPanjang,
        elevasiMulutGua, statusExplore, sinonim, ketinggian, sumberData,
        jenisPotensiKarst, typeGua, statusPemetaanGua, code, lokasi
    } = properties;

    const divisionNames = {
        pendaki: 'Divisi Pendakian', panjatTebing: 'Divisi Panjat Tebing',
        paralayang: 'Divisi Paralayang', caving: 'Divisi Caving', diving: 'Divisi Diving'
    };
    const sourceLabels = {
        astacala: 'Data Kegiatan Astacala', external: 'Data Klapanunggal',
        static: 'Data Statis', iss_data: 'Data ISS Karst', unknown: 'Sumber Tidak Diketahui'
    };

    const headerBg = '#f8f9fa';
    const textColor = '#2c3e50';
    const mutedColor = '#6c757d';
    const borderColor = '#e9ecef';
    const baseFontSize = isMobile ? '13px' : '14px';
    const smallFontSize = isMobile ? '11px' : '12px';
    const headerFontSize = isMobile ? '16px' : '18px';
    const padding = isMobile ? '12px 16px' : '16px 20px';
    
    // Common sections
    const headerSection = `
        <div style="background: ${headerBg}; padding: ${padding}; border-bottom: 1px solid ${borderColor};">
            <div style="font-size: ${headerFontSize}; font-weight: 600; color: ${textColor}; margin-bottom: 4px;">${name}</div>
            <div style="font-size: ${smallFontSize}; color: ${mutedColor}; display: flex; align-items: center; gap: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${lokasi || description || `${kota || 'Lokasi'}, ${provinsi || 'Indonesia'}`}</span>
            </div>
        </div>`;

    const actionButtons = `
        <div style="display: flex; gap: 8px; padding: ${padding}; border-bottom: 1px solid ${borderColor};">
            <button style="flex: 1; padding: 10px; border: none; border-radius: 8px; background: #007bff; color: white; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                    onclick="window.open('https://www.google.com/maps/search/?api=1&query=${geometry.coordinates[1]},${geometry.coordinates[0]}', '_blank')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 11l19-9-9 19-2-8-8-2z"></path></svg>
                Navigate
            </button>
            ${linkRop ? `
            <button style="flex: 1; padding: 10px; border: 1px solid ${borderColor}; border-radius: 8px; background: #f8f9fa; color: #495057; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                    onclick="window.open('${linkRop}', '_blank')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                ROP
            </button>` : ''}
        </div>`;

    const footerSection = (divisionLabel, divisionColor) => `
        <div style="background: ${headerBg}; padding: ${padding}; border-top: 1px solid ${borderColor}; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: ${smallFontSize}; color: ${mutedColor};">${sourceLabels[source] || 'Unknown Source'}</div>
            <div style="background: ${divisionColor}; color: ${divisionLabel === 'CAVING' || divisionLabel === 'ROCK CLIMBING' ? textColor : 'white'}; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">${divisionLabel}</div>
        </div>`;

    const detailItem = (icon, label, value) => `
        <div style="display: flex; align-items: start; gap: 10px;">
            <div style="flex-shrink: 0; margin-top: 2px;">${icon}</div>
            <div>
                <div style="font-size: ${smallFontSize}; color: ${mutedColor};">${label}</div>
                <div style="font-size: ${baseFontSize}; color: ${textColor}; font-weight: 500;">${value || '-'}</div>
            </div>
        </div>`;
    
    // Icons
    const iconPath = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${mutedColor}" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    const iconDesc = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${mutedColor}" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`;
    const iconCalendar = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${mutedColor}" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
    const iconDepth = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${mutedColor}" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
    const iconHeight = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${mutedColor}" stroke-width="2"><path d="M12 2L7 22h10L12 2zM3 20h18"></path></svg>`;

    let detailsContent = '';

    if (division === 'caving') {
        detailsContent = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                ${detailItem(iconDepth, 'Kedalaman', totalKedalaman || kedalaman ? `${totalKedalaman || kedalaman} m` : null)}
                ${detailItem(iconHeight, 'Elevasi', elevasiMulutGua ? `${elevasiMulutGua} m` : null)}
                ${detailItem(iconPath, 'Panjang Lorong', totalPanjang ? `${totalPanjang} m` : null)}
                ${detailItem(iconDesc, 'Karakter', karakterLorong)}
            </div>
            ${kegiatan ? `<div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid ${borderColor};">${detailItem(iconCalendar, 'Kegiatan', kegiatan)}</div>` : ''}`;
    } else if (division === 'panjatTebing') {
        detailsContent = `
            <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                ${detailItem(iconDesc, 'Deskripsi', description)}
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px; padding-top: 12px; border-top: 1px solid ${borderColor};">
                ${detailItem(iconHeight, 'Ketinggian', ketinggian ? `${ketinggian} m` : null)}
                ${detailItem(iconCalendar, 'Kegiatan', kegiatan)}
            </div>`;
    } else if (division === 'paralayang' || division === 'diving' || division === 'pendaki') {
        detailsContent = `<div style="display: grid; grid-template-columns: 1fr; gap: 16px;">${detailItem(iconDesc, 'Deskripsi', description)}</div>`;
    }
    
    return `
        <div style="background: white; color: ${textColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-radius: 12px; overflow: hidden; min-width: ${isMobile ? '280px' : '350px'}; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            ${headerSection}
            ${actionButtons}
            <div style="padding: ${padding};">${detailsContent}</div>
            ${footerSection(division.toUpperCase().replace('TEBING', 'CLIMBING'), properties.division === 'pendaki' ? '#ff3333' : properties.division === 'panjatTebing' ? '#33ff33' : properties.division === 'paralayang' ? '#3333ff' : properties.division === 'caving' ? '#ffcc00' : '#00ccff')}
        </div>`;
  };

  // Function to add or update activity points on the map
  const setupMapData = (mapInstance) => {
    const allPoints = [
        ...activitiesPoints, ...cavingData, ...cavingAstPoints,
        ...rockClimbingPoints, ...issDataPoints, ...divingPoints, ...paralayangPoints
    ];

    const geojsonData = {
      type: 'FeatureCollection',
      features: allPoints.map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: p.coordinates },
        properties: { ...p, id: p.id || undefined }
      }))
    };

    if (mapInstance.getSource('activities-points')) {
      mapInstance.getSource('activities-points').setData(geojsonData);
    } else {
      mapInstance.addSource('activities-points', { type: 'geojson', data: geojsonData });
    }
    
    if (!mapInstance.getLayer('points-layer')) {
      mapInstance.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'activities-points',
        paint: {
          'circle-radius': isMobile ? 6 : 7,
          'circle-color': [
            'match', ['get', 'division'],
            'pendaki', '#ff3333',
            'panjatTebing', '#33ff33',
            'paralayang', '#3333ff',
            'caving', '#ffcc00',
            'diving', '#00ccff',
            '#cccccc' // Default color
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });

      // Add click handler only once
      mapInstance.on('click', 'points-layer', (e) => {
        if (popupRef.current) {
            popupRef.current.remove();
        }
        const feature = e.features[0];
        const popupContent = createPopupHTML(feature);
        
        popupRef.current = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: true,
            className: 'custom-popup',
            maxWidth: isMobile ? '85vw' : '380px'
        })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(popupContent)
        .addTo(mapInstance);
      });

      // Change cursor to pointer on hover
      mapInstance.on('mouseenter', 'points-layer', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });
      mapInstance.on('mouseleave', 'points-layer', () => {
        mapInstance.getCanvas().style.cursor = '';
      });
    }

    applyFiltersToMap(activeFilters);
  };
  
  // Toggle 3D terrain
  const toggle3D = () => {
    setIs3D(v => {
      const next = !v;
      const map = mapRef.current;
      if (map) {
        if (next) {
          if (!map.getSource('terrain')) {
            map.addSource('terrain', {
              type: 'raster-dem',
              url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
            });
          }
          map.setTerrain({ source: 'terrain', exaggeration: 1.5 });
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
    const map = mapRef.current;
    if (map) {
      const { lng, lat } = map.getCenter();
      const zoom = map.getZoom();
      const pitch = map.getPitch();
      const bearing = map.getBearing();
      
      map.setStyle(`https://api.maptiler.com/maps/${newStyle}/style.json?key=${key}`);
      
      map.once('styledata', () => {
        map.setCenter([lng, lat]);
        map.setZoom(zoom);
        map.setPitch(pitch);
        map.setBearing(bearing);
        
        // Re-apply terrain if 3D is active
        if (is3D) {
            if (!map.getSource('terrain')) {
                map.addSource('terrain', {
                    type: 'raster-dem',
                    url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
                });
            }
            map.setTerrain({ source: 'terrain', exaggeration: 1.5 });
        }
        
        // Re-add data layers
        setupMapData(map);
      });
    }
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return; // Initialize only once

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${key}`,
      center: centerCoordinates,
      zoom: isMobile ? 5 : 6,
      pitch: 0,
      maxPitch: 85,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');


    map.on('load', () => {
      setupMapData(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isMobile]); // Re-init might be needed if mobile view changes drastically, but usually not. Keep deps minimal.

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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000' }}>
      <style jsx global>{`
        /* Keyframes and global styles */
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInTop { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInBottom { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glow { 
          0%, 100% { box-shadow: 0 0 5px rgba(255, 51, 51, 0.5); }
          50% { box-shadow: 0 0 20px rgba(255, 51, 51, 0.8), 0 0 30px rgba(255, 51, 51, 0.6); }
        }
        
        .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }

        /* Custom Popup Styling */
        .maplibregl-popup.custom-popup .maplibregl-popup-content {
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
        }
        .maplibregl-popup.custom-popup .maplibregl-popup-tip { display: none !important; }
        .maplibregl-popup.custom-popup .maplibregl-popup-close-button {
            position: absolute; right: 8px; top: 8px;
            font-size: 20px; line-height: 1; color: #6c757d;
            background: rgba(255, 255, 255, 0.8);
            border: none; border-radius: 50%;
            width: 28px; height: 28px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s; z-index: 10;
        }
        .maplibregl-popup.custom-popup .maplibregl-popup-close-button:hover { background: #fff; color: #2c3e50; }
        .maplibregl-popup.custom-popup button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .maplibregl-popup.custom-popup button:active { transform: translateY(0); }
      `}</style>

      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Left side tools panel */}
      <div style={{ position: 'absolute', left: isMobile ? 10 : 15, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px', zIndex: 10, animation: 'slideIn 0.6s ease-out' }}>
        <button onClick={() => router.push('/')} className="hover-lift" style={{ ...toolButtonStyle, backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </button>
        <button onClick={toggleFilters} className="hover-lift" style={{ ...toolButtonStyle, backgroundColor: showFilters ? '#ff3333' : '#1a1a1a', color: 'white', border: showFilters ? '1px solid #ff3333' : '1px solid #333', transition: 'all 0.3s ease' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div style={{ position: 'absolute', left: isMobile ? 50 : 60, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0, 0, 0, 0.85)', padding: isMobile ? '10px' : '15px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', border: '1px solid #ff3333', zIndex: 10, minWidth: isMobile ? '180px' : '220px', maxHeight: '70vh', overflowY: 'auto', animation: 'slideIn 0.3s ease-out', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 'bold', color: '#ff3333', marginBottom: 10 }}>Filter Divisi</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '8px' }}>
            {[
              { key: 'all', label: 'Semua Divisi', color: 'white' },
              { key: 'pendaki', label: 'Divisi Pendakian', color: '#ff3333' },
              { key: 'panjatTebing', label: 'Divisi Panjat Tebing', color: '#33ff33' },
              { key: 'paralayang', label: 'Divisi Paralayang', color: '#3333ff' },
              { key: 'caving', label: 'Divisi Caving', color: '#ffcc00' },
              { key: 'diving', label: 'Divisi Diving', color: '#00ccff' }
            ].map((item) => (
              <label key={item.key} style={{ display: 'flex', alignItems: 'center', color: item.color, cursor: 'pointer', fontSize: isMobile ? '12px' : '14px', padding: '4px', borderRadius: '4px', transition: 'all 0.2s ease' }}>
                <input type="checkbox" checked={activeFilters[item.key]} onChange={() => handleFilterChange(item.key)} style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px', cursor: 'pointer' }} />
                {item.label}
              </label>
            ))}
            <div style={{ borderTop: '1px solid #333', marginTop: '8px', paddingTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px', padding: '4px', borderRadius: '4px', transition: 'all 0.2s ease' }}>
                <input type="checkbox" checked={activeFilters.astacalaOnly} onChange={() => handleFilterChange('astacalaOnly')} style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px', cursor: 'pointer' }} />
                Hanya Data Astacala
              </label>
            </div>
            <div style={{ borderTop: '1px solid #333', marginTop: '8px', paddingTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px', padding: '4px', borderRadius: '4px', transition: 'all 0.2s ease' }}>
                <input type="checkbox" checked={is3D} onChange={toggle3D} style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px', cursor: 'pointer' }} />
                Tampilan 3D Terrain
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Map style switcher */}
      <div style={{ position: 'absolute', bottom: isMobile ? 40 : 50, left: isMobile ? 10 : 15, zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideInBottom 0.6s ease-out' }}>
        <button onClick={() => setShowMapStyles(!showMapStyles)} className="hover-lift" style={{ ...toolButtonStyle, backgroundColor: showMapStyles ? '#ff3333' : '#1a1a1a', color: 'white', border: showMapStyles ? '1px solid #ff3333' : '1px solid #333', transition: 'all 0.3s ease' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </button>
        {showMapStyles && (
            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(26, 26, 26, 0.9)', padding: '8px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '1px solid #333', animation: 'slideIn 0.3s ease-out', backdropFilter: 'blur(10px)' }}>
                {['outdoor', 'satellite', 'streets-v2'].map((style) => (
                    <button key={style} onClick={() => changeMapStyle(style)} className="hover-lift" style={{ padding: '5px 10px', border: mapStyle === style ? '1px solid #ff3333' : '1px solid #333', borderRadius: '6px', cursor: 'pointer', backgroundColor: mapStyle === style ? '#ff3333' : '#1a1a1a', color: 'white', fontSize: isMobile ? '11px' : '12px', fontWeight: mapStyle === style ? 'bold' : 'normal', transition: 'all 0.3s ease' }}>
                        {style.charAt(0).toUpperCase() + style.slice(1).replace('-v2', '')}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Title Header */}
      <div style={{ position: 'absolute', top: isMobile ? 10 : 15, left: '50%', transform: 'translateX(-50%)', zIndex: 10, backgroundColor: 'rgba(0, 0, 0, 0.85)', padding: isMobile ? '6px 12px' : '10px 20px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', border: '1px solid #ff3333', textAlign: 'center', animation: 'slideInTop 0.8s ease-out, glow 3s ease-in-out infinite', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 'bold', color: '#ff3333', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 0 10px rgba(255, 51, 51, 0.5)' }}>
          WebGIS Astacala
        </h1>
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 40, right: isMobile ? 10 : 15, zIndex: 10, display: 'flex', alignItems: 'flex-end', flexDirection: 'row-reverse', gap: '8px' }}>
        <button onClick={() => setShowLegend(!showLegend)} className="hover-lift" style={{ ...toolButtonStyle, backgroundColor: showLegend ? '#ff3333' : '#1a1a1a', color: 'white', border: showLegend ? '1px solid #ff3333' : '1px solid #333', transition: 'all 0.3s ease', animation: 'slideInRight 0.8s ease-out' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </button>
        {showLegend && (
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '1px solid #333', animation: 'slideInRight 0.3s ease-out', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Legenda</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                        { color: '#ff3333', label: 'Divisi Pendakian' }, { color: '#33ff33', label: 'Divisi Panjat Tebing' },
                        { color: '#3333ff', label: 'Divisi Paralayang' }, { color: '#ffcc00', label: 'Divisi Caving' },
                        { color: '#00ccff', label: 'Divisi Diving' }
                    ].map(item => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color, marginRight: 8 }}></div>
                            <span style={{ color: 'white', fontSize: 11 }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Copyright Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px 15px', backgroundColor: 'rgba(0, 0, 0, 0.85)', borderTop: '1px solid #333', color: '#999', fontSize: isMobile ? '11px' : '13px', backdropFilter: 'blur(10px)' }}>
        © Astacala 2025
      </div>
    </div>
  );
};

export default MapComponent;