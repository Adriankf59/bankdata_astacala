import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter } from 'next/router';

const MapComponent = ({ cavingData = [], cavingAstPoints = [], rockClimbingPoints = [], issDataPoints = [], divingPoints = [], paralayangPoints = [] }) => {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [map, setMap] = useState(null);
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
        caving: newValue,
        diving: newValue
      };
    } else if (division === 'astacalaOnly') {
      newFilters.astacalaOnly = !newFilters.astacalaOnly;
    } else {
      newFilters[division] = !newFilters[division];
      newFilters.all = newFilters.pendaki && newFilters.panjatTebing && newFilters.paralayang && newFilters.caving && newFilters.diving;
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
    
    if (filters.diving) {
      divisionFilter.push(['==', ['get', 'division'], 'diving']);
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
      ...issDataPoints,
      ...divingPoints,
      ...paralayangPoints
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
              // Astacala caving fields
              kegiatan: p.kegiatan || null,
              kota: p.kota || null,
              provinsi: p.provinsi || null,
              linkRop: p.linkRop || null,
              waktuKegiatan: p.waktuKegiatan || null,
              karakterLorong: p.karakterLorong || null,
              kedalaman: p.kedalaman || null,
              // Klapanunggal caving fields
              totalKedalaman: p.totalKedalaman || null,
              totalPanjang: p.totalPanjang || null,
              elevasiMulutGua: p.elevasiMulutGua || null,
              statusExplore: p.statusExplore || null,
              sinonim: p.sinonim || null,
              // Rock climbing fields
              ketinggian: p.ketinggian || null,
              // ISS data fields
              sumberData: p.sumberData || null,
              jenisPotensiKarst: p.jenisPotensiKarst || null,
              typeGua: p.typeGua || null,
              statusPemetaanGua: p.statusPemetaanGua || null,
              code: p.code || null,
              // Paralayang fields
              lokasi: p.lokasi || null
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
            'diving', '#00ccff',
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
        if (feature.properties.division === 'diving') color = '#00ccff';
        
        const divisionNames = {
          pendaki: 'Divisi Pendakian',
          panjatTebing: 'Divisi Panjat Tebing',
          paralayang: 'Divisi Paralayang',
          caving: 'Divisi Caving',
          diving: 'Divisi Diving'
        };
        
        const sourceLabels = {
          astacala: 'Data Kegiatan Astacala',
          external: 'Data Klapanunggal',
          static: 'Data Statis',
          iss_data: 'Data ISS Karst',
          unknown: 'Sumber Tidak Diketahui'
        };
        
        // Create responsive popup content
        const baseFontSize = isMobile ? '12px' : '14px';
        const headerFontSize = isMobile ? '16px' : '18px';
        const labelWidth = isMobile ? '100px' : '130px';
        
        let popupContent = '';
        
        if (feature.properties.division === 'diving') {
          popupContent = `
            <div style="
              background: white;
              color: #2c3e50;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 0;
              border-radius: 12px;
              overflow: hidden;
              min-width: ${isMobile ? '280px' : '320px'};
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            ">
              <!-- Header -->
              <div style="
                background: #f8f9fa;
                padding: ${isMobile ? '12px 16px' : '16px 20px'};
                border-bottom: 1px solid #e9ecef;
              ">
                <div style="
                  font-size: ${isMobile ? '16px' : '18px'};
                  font-weight: 600;
                  color: #2c3e50;
                  margin-bottom: 4px;
                ">${feature.properties.name}</div>
                <div style="
                  font-size: ${isMobile ? '12px' : '13px'};
                  color: #6c757d;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Lokasi Diving
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div style="
                display: flex;
                gap: 8px;
                padding: ${isMobile ? '12px 16px' : '16px 20px'};
                border-bottom: 1px solid #e9ecef;
              ">
                <button style="
                  flex: 1;
                  padding: ${isMobile ? '8px' : '10px'};
                  border: none;
                  border-radius: 8px;
                  background: #007bff;
                  color: white;
                  font-size: ${isMobile ? '12px' : '13px'};
                  font-weight: 500;
                  cursor: pointer;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 4px;
                  transition: all 0.2s;
                " onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}', '_blank')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M3 11l19-9-9 19-2-8-8-2z"></path>
                  </svg>
                  Navigate
                </button>
                
                <div style="
                  flex: 1;
                  padding: ${isMobile ? '8px' : '10px'};
                  border-radius: 8px;
                  background: #28a745;
                  color: white;
                  font-size: ${isMobile ? '12px' : '13px'};
                  font-weight: 500;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 4px;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Active
                </div>
              </div>
              
              <!-- Details Section -->
              <div style="padding: ${isMobile ? '12px 16px' : '16px 20px'};">
                <div style="
                  font-size: ${isMobile ? '11px' : '12px'};
                  color: #6c757d;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: ${isMobile ? '12px' : '16px'};
                ">Informasi Lokasi Diving</div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div style="font-size: ${isMobile ? '13px' : '14px'}; color: #2c3e50;">
                    ${feature.properties.description || 'Lokasi diving yang indah'}
                  </div>
                </div>
              </div>
              
              <!-- Source Badge -->
              <div style="
                background: #f8f9fa;
                padding: ${isMobile ? '8px 16px' : '12px 20px'};
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
                <div style="
                  font-size: ${isMobile ? '11px' : '12px'};
                  color: #6c757d;
                ">${sourceLabels[feature.properties.source] || 'Unknown Source'}</div>
                <div style="
                  background: #00ccff;
                  color: #2c3e50;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: ${isMobile ? '10px' : '11px'};
                  font-weight: 600;
                ">DIVING</div>
              </div>
            </div>
          `;
        } else if (feature.properties.division === 'paralayang') {
          popupContent = `
            <div style="
              background: white;
              color: #2c3e50;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 0;
              border-radius: 12px;
              overflow: hidden;
              min-width: ${isMobile ? '280px' : '320px'};
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            ">
              <!-- Header -->
              <div style="
                background: #f8f9fa;
                padding: ${isMobile ? '12px 16px' : '16px 20px'};
                border-bottom: 1px solid #e9ecef;
              ">
                <div style="
                  font-size: ${isMobile ? '16px' : '18px'};
                  font-weight: 600;
                  color: #2c3e50;
                  margin-bottom: 4px;
                ">${feature.properties.name}</div>
                <div style="
                  font-size: ${isMobile ? '12px' : '13px'};
                  color: #6c757d;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  ${feature.properties.lokasi || 'Lokasi Paralayang'}
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div style="
                display: flex;
                gap: 8px;
                padding: ${isMobile ? '12px 16px' : '16px 20px'};
                border-bottom: 1px solid #e9ecef;
              ">
                <button style="
                  flex: 1;
                  padding: ${isMobile ? '8px' : '10px'};
                  border: none;
                  border-radius: 8px;
                  background: #007bff;
                  color: white;
                  font-size: ${isMobile ? '12px' : '13px'};
                  font-weight: 500;
                  cursor: pointer;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 4px;
                  transition: all 0.2s;
                " onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}', '_blank')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M3 11l19-9-9 19-2-8-8-2z"></path>
                  </svg>
                  Navigate
                </button>
                
                <div style="
                  flex: 1;
                  padding: ${isMobile ? '8px' : '10px'};
                  border-radius: 8px;
                  background: #28a745;
                  color: white;
                  font-size: ${isMobile ? '12px' : '13px'};
                  font-weight: 500;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 4px;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Active
                </div>
              </div>
              
              <!-- Details Section -->
              <div style="padding: ${isMobile ? '12px 16px' : '16px 20px'};">
                <div style="
                  font-size: ${isMobile ? '11px' : '12px'};
                  color: #6c757d;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: ${isMobile ? '12px' : '16px'};
                ">Informasi Lokasi Paralayang</div>
                
                ${feature.properties.lokasi ? `
                <div style="margin-bottom: ${isMobile ? '12px' : '16px'};">
                  <div style="display: flex; align-items: start; gap: 12px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div style="flex: 1;">
                      <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #6c757d; margin-bottom: 2px;">Alamat Lengkap</div>
                      <div style="font-size: ${isMobile ? '13px' : '14px'}; color: #2c3e50;">${feature.properties.lokasi}</div>
                    </div>
                  </div>
                </div>
                ` : ''}
                
                <div style="display: flex; align-items: center; gap: 10px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div style="font-size: ${isMobile ? '13px' : '14px'}; color: #2c3e50;">
                    Koordinat: ${feature.geometry.coordinates[1].toFixed(6)}, ${feature.geometry.coordinates[0].toFixed(6)}
                  </div>
                </div>
              </div>
              
              <!-- Source Badge -->
              <div style="
                background: #f8f9fa;
                padding: ${isMobile ? '8px 16px' : '12px 20px'};
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
                <div style="
                  font-size: ${isMobile ? '11px' : '12px'};
                  color: #6c757d;
                ">${sourceLabels[feature.properties.source] || 'Unknown Source'}</div>
                <div style="
                  background: #3333ff;
                  color: white;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: ${isMobile ? '10px' : '11px'};
                  font-weight: 600;
                ">PARALAYANG</div>
              </div>
            </div>
          `;
        } else if (feature.properties.division === 'caving') {