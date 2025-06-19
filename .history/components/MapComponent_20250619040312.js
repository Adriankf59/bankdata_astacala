import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter } from 'next/router';

const MapComponent = ({ cavingData = [], cavingAstPoints = [], rockClimbingPoints = [], issDataPoints = [] }) => {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState('outdoor');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  // Astacala locations with division information
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

  const centerCoordinates = [110, -7];
  
  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
    
    if (map) {
      applyFiltersToMap(newFilters);
    }
  };
  
  // Apply filters directly to the map with given filter state
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
  
  // Function to add activity points to the map
  const addActivityPoints = (mapInstance) => {
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
              kegiatan: p.kegiatan || null,
              kota: p.kota || null,
              provinsi: p.provinsi || null,
              linkRop: p.linkRop || null,
              waktuKegiatan: p.waktuKegiatan || null,
              karakterLorong: p.karakterLorong || null,
              totalKedalaman: p.totalKedalaman || null,
              totalPanjang: p.totalPanjang || null,
              kedalaman: p.kedalaman || null,
              ketinggian: p.ketinggian || null,
              sumberData: p.sumberData || null,
              jenisPotensiKarst: p.jenisPotensiKarst || null,
              typeGua: p.typeGua || null,
              statusPemetaanGua: p.statusPemetaanGua || null,
              code: p.code || null
            }
          }))
        }
      });
      
      // Responsive circle radius
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
      
      // Add click handler for popups
      mapInstance.on('click', 'points-layer', (e) => {
        const feature = e.features[0];
        
        let color = '#ff3333';
        if (feature.properties.division === 'pendaki') color = '#ff3333';
        if (feature.properties.division === 'panjatTebing') color = '#33ff33';
        if (feature.properties.division === 'paralayang') color = '#3333ff';
        if (feature.properties.division === 'caving') color = '#ffcc00';
        
        const divisionNames = {
          pendaki: 'Divisi Pendakian',
          panjatTebing: 'Divisi Panjat Tebing',
          paralayang: 'Divisi Paralayang',
          caving: 'Divisi Caving'
        };
        
        const sourceLabels = {
          astacala: 'Data Kegiatan Astacala',
          external: 'Data Eksternal',
          static: 'Data Statis',
          iss_data: 'Data ISS Karst',
          unknown: 'Sumber Tidak Diketahui'
        };
        
        // Create responsive popup content
        const baseFontSize = isMobile ? '12px' : '14px';
        const headerFontSize = isMobile ? '16px' : '18px';
        const labelWidth = isMobile ? '100px' : '130px';
        
        let popupContent = '';
        
        if (feature.properties.division === 'caving') {
          popupContent = `
            <div style="color: white; background-color: rgba(0,0,0,0.7); padding: ${isMobile ? '6px' : '8px'}; border-radius: 4px; border-left: 3px solid ${color};">
              <div style="font-weight: bold; color: ${color}; margin-bottom: ${isMobile ? '6px' : '8px'}; font-size: ${headerFontSize}; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                Gua ${feature.properties.name}
              </div>
              <div style="font-size: ${isMobile ? '11px' : '13px'}; color: #ffffff; margin-bottom: 5px; font-weight: bold;">
                ${divisionNames[feature.properties.division]} (${sourceLabels[feature.properties.source] || 'Sumber Tidak Diketahui'})
              </div>
              <div style="margin-top: ${isMobile ? '8px' : '10px'}; font-size: ${baseFontSize}; line-height: 1.5;">
                <table style="width: 100%; border-collapse: collapse;">`;
          
          if (feature.properties.source === 'iss_data') {
            popupContent += `
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Deskripsi:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.description || 'Tidak ada deskripsi'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Sumber Data:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.sumberData || 'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Jenis Potensi:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.jenisPotensiKarst || 'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Tipe Gua:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.typeGua || 'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Status Pemetaan:</td>
                <td style="color: white; ${isMobile ? 'display: block;' : ''}">${feature.properties.statusPemetaanGua || 'Tidak tersedia'}</td>
              </tr>`;
          } else if (feature.properties.source === 'astacala') {
            popupContent += `
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Deskripsi:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.description || 'Tidak ada deskripsi'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Kegiatan:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.kegiatan || 'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Waktu Kegiatan:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.waktuKegiatan || 'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Lokasi:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.kota || 'Tidak tersedia'}, ${feature.properties.provinsi || ''}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Kedalaman:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.kedalaman ? feature.properties.kedalaman + ' m' : 'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Karakter Lorong:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.karakterLorong || 'Tidak tersedia'}</td>
              </tr>`;
              
            if (feature.properties.linkRop) {
              popupContent += `
                <tr>
                  <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">ROP:</td>
                  <td style="color: white; ${isMobile ? 'display: block;' : ''}"><a href="${feature.properties.linkRop}" target="_blank" style="color: #ffcc00; text-decoration: underline;">Lihat ROP</a></td>
                </tr>`;
            }
          } else {
            popupContent += `
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Karakter Lorong:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.karakterLorong || 'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Total Kedalaman:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.totalKedalaman ? 
                  (parseFloat(feature.properties.totalKedalaman).toFixed(2) + ' m') : 
                  'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Total Panjang:</td>
                <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.totalPanjang ? 
                  (parseFloat(feature.properties.totalPanjang).toFixed(2) + ' m') : 
                  'Tidak tersedia'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #ffcc00; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Deskripsi:</td>
                <td style="color: white; ${isMobile ? 'display: block;' : ''}">${feature.properties.description || 'Tidak ada deskripsi'}</td>
              </tr>`;
          }
          
          popupContent += `
                </table>
              </div>
            </div>
          `;
        } else if (feature.properties.division === 'panjatTebing') {
          popupContent = `
            <div style="color: white; background-color: rgba(0,0,0,0.7); padding: ${isMobile ? '6px' : '8px'}; border-radius: 4px; border-left: 3px solid ${color};">
              <div style="font-weight: bold; color: ${color}; margin-bottom: ${isMobile ? '6px' : '8px'}; font-size: ${headerFontSize}; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                ${feature.properties.name}
              </div>
              <div style="font-size: ${isMobile ? '11px' : '13px'}; color: #ffffff; margin-bottom: 5px; font-weight: bold;">
                ${divisionNames[feature.properties.division]} (${sourceLabels[feature.properties.source] || 'Sumber Tidak Diketahui'})
              </div>
              <div style="margin-top: ${isMobile ? '8px' : '10px'}; font-size: ${baseFontSize}; line-height: 1.5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="font-weight: bold; color: #33ff33; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Deskripsi:</td>
                    <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.description || 'Tidak ada deskripsi'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #33ff33; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Kegiatan:</td>
                    <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.kegiatan || 'Tidak tersedia'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #33ff33; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Waktu Kegiatan:</td>
                    <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.waktuKegiatan || 'Tidak tersedia'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #33ff33; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Lokasi:</td>
                    <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.kota || 'Tidak tersedia'}, ${feature.properties.provinsi || ''}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #33ff33; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">Ketinggian:</td>
                    <td style="color: white; ${isMobile ? 'display: block; margin-bottom: 8px;' : ''}">${feature.properties.ketinggian ? feature.properties.ketinggian + ' m' : 'Tidak tersedia'}</td>
                  </tr>`;
                  
          if (feature.properties.linkRop) {
            popupContent += `
              <tr>
                <td style="font-weight: bold; color: #33ff33; padding-right: ${isMobile ? '5px' : '10px'}; width: ${labelWidth}; ${isMobile ? 'display: block; margin-bottom: 2px;' : ''}">ROP:</td>
                <td style="color: white; ${isMobile ? 'display: block;' : ''}"><a href="${feature.properties.linkRop}" target="_blank" style="color: #33ff33; text-decoration: underline;">Lihat ROP</a></td>
              </tr>`;
          }
          
          popupContent += `
                </table>
              </div>
            </div>
          `;
        } else {
          popupContent = `
            <div style="color: white;">
              <div style="font-weight: bold; color: ${color}; margin-bottom: 5px; font-size: ${isMobile ? '14px' : '16px'};">
                ${feature.properties.name}
              </div>
              <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #aaa; margin-bottom: 5px;">
                ${divisionNames[feature.properties.division]} (${sourceLabels[feature.properties.source] || 'Sumber Tidak Diketahui'})
              </div>
              <div style="font-size: ${baseFontSize};">${feature.properties.description}</div>
            </div>
          `;
        }
        
        const popup = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          className: 'dark-popup',
          maxWidth: isMobile ? '85vw' : '350px'
        })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(popupContent)
        .addTo(mapInstance);
      });
    } else {
      mapInstance.getSource('activities-points').setData({
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
            kegiatan: p.kegiatan || null,
            kota: p.kota || null,
            provinsi: p.provinsi || null,
            linkRop: p.linkRop || null,
            waktuKegiatan: p.waktuKegiatan || null,
            karakterLorong: p.karakterLorong || null,
            totalKedalaman: p.totalKedalaman || null,
            totalPanjang: p.totalPanjang || null,
            kedalaman: p.kedalaman || null,
            ketinggian: p.ketinggian || null,
            sumberData: p.sumberData || null,
            jenisPotensiKarst: p.jenisPotensiKarst || null,
            typeGua: p.typeGua || null,
            statusPemetaanGua: p.statusPemetaanGua || null,
            code: p.code || null
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
        
        if (is3D && !map.getSource('terrain')) {
          map.addSource('terrain', {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
          });
          map.setTerrain({ source: 'terrain' });
        }
        
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
      zoom: isMobile ? 5 : 6,
      maxPitch: 85
    });
    
    newMap.addControl(new maplibregl.NavigationControl({
      showCompass: true
    }), 'top-right');
    
    newMap.on('load', () => {
      addActivityPoints(newMap);
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
        left: isMobile ? 10 : 15,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '8px' : '10px',
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
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>
      
      {/* Filter panel (shown/hidden based on state) */}
      {showFilters && (
        <div style={{
          position: 'absolute',
          left: isMobile ? 50 : 60,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: isMobile ? '10px' : '15px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          border: '1px solid #ff3333',
          zIndex: 10,
          minWidth: isMobile ? '180px' : '200px',
          maxHeight: isMobile ? '70vh' : 'auto',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 'bold', color: '#ff3333', marginBottom: isMobile ? 8 : 10 }}>
            Filter Divisi
          </div>
          
          {/* Checkbox filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.all}
                onChange={() => handleFilterChange('all')}
                style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px' }}
              />
              Semua Divisi
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#ff3333', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.pendaki}
                onChange={() => handleFilterChange('pendaki')}
                style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px' }}
              />
              Divisi Pendakian
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#33ff33', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.panjatTebing}
                onChange={() => handleFilterChange('panjatTebing')}
                style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px' }}
              />
              Divisi Panjat Tebing
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#3333ff', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.paralayang}
                onChange={() => handleFilterChange('paralayang')}
                style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px' }}
              />
              Divisi Paralayang
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#ffcc00', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px' }}>
              <input 
                type="checkbox" 
                checked={activeFilters.caving}
                onChange={() => handleFilterChange('caving')}
                style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px' }}
              />
              Divisi Caving
            </label>
            
            {/* Data Source Filter */}
            <div style={{ borderTop: '1px solid #333', marginTop: '8px', paddingTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px' }}>
                <input 
                  type="checkbox" 
                  checked={activeFilters.astacalaOnly}
                  onChange={() => handleFilterChange('astacalaOnly')}
                  style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px' }}
                />
                Hanya Data Astacala
              </label>
            </div>
            
            {/* 3D Terrain Checkbox */}
            <div style={{ borderTop: '1px solid #333', marginTop: '8px', paddingTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px' }}>
                <input 
                  type="checkbox" 
                  checked={is3D}
                  onChange={toggle3D}
                  style={{ marginRight: '8px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px' }}
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
        top: isMobile ? 10 : 15,
        left: isMobile ? 10 : 15,
        zIndex: 10,
        display: 'flex',
        gap: isMobile ? '6px' : '8px',
        backgroundColor: '#1a1a1a',
        padding: isMobile ? '6px' : '8px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }}>
        {['street', 'outdoor', 'satellite'].map(style => (
          <button 
            key={style}
            onClick={() => changeMapStyle(style)}
            style={{
              padding: isMobile ? '4px 8px' : '5px 10px',
              border: mapStyle === style ? '1px solid #ff3333' : '1px solid #333',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: mapStyle === style ? '#ff3333' : '#1a1a1a',
              color: 'white',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: mapStyle === style ? 'bold' : 'normal'
            }}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Title header */}
      {!isMobile && (
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
      )}
      
      {/* Mobile title (bottom) */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1px solid #ff3333',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            color: '#ff3333', 
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Webgis Astacala
          </h1>
        </div>
      )}
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 80 : 40,
        right: isMobile ? 10 : 15,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: isMobile ? '8px 10px' : '10px 15px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        border: '1px solid #333',
        maxWidth: isMobile ? '150px' : 'auto'
      }}>
        <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 'bold', color: 'white', marginBottom: isMobile ? 6 : 8 }}>
          Legenda
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '4px' : '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: isMobile ? 10 : 12, height: isMobile ? 10 : 12, borderRadius: '50%', backgroundColor: '#ff3333', marginRight: isMobile ? 6 : 8 }}></div>
            <span style={{ color: 'white', fontSize: isMobile ? 10 : 11 }}>Divisi Pendakian</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: isMobile ? 10 : 12, height: isMobile ? 10 : 12, borderRadius: '50%', backgroundColor: '#33ff33', marginRight: isMobile ? 6 : 8 }}></div>
            <span style={{ color: 'white', fontSize: isMobile ? 10 : 11 }}>Divisi Panjat Tebing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: isMobile ? 10 : 12, height: isMobile ? 10 : 12, borderRadius: '50%', backgroundColor: '#3333ff', marginRight: isMobile ? 6 : 8 }}></div>
            <span style={{ color: 'white', fontSize: isMobile ? 10 : 11 }}>Divisi Paralayang</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: isMobile ? 10 : 12, height: isMobile ? 10 : 12, borderRadius: '50%', backgroundColor: '#ffcc00', marginRight: isMobile ? 6 : 8 }}></div>
            <span style={{ color: 'white', fontSize: isMobile ? 10 : 11 }}>Divisi Caving</span>
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
        padding: isMobile ? '6px 10px' : '8px 15px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderTop: '1px solid #333',
        color: '#999',
        fontSize: isMobile ? '11px' : '13px'
      }}>
        <div>
          © Astacala 2025
        </div>
      </div>
    </div>
  );
};

export default MapComponent;