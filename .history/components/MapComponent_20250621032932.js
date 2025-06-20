//kode import React, { useEffect, useRef, useState } from 'react';
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
        
        if (feature.properties.division === 'caving') {
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
                  ${feature.properties.kota || 'Lokasi'}, ${feature.properties.provinsi || 'Indonesia'}
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
                
                ${feature.properties.linkRop ? `
                <button style="
                  flex: 1;
                  padding: ${isMobile ? '8px' : '10px'};
                  border: none;
                  border-radius: 8px;
                  background: #f8f9fa;
                  color: #495057;
                  font-size: ${isMobile ? '12px' : '13px'};
                  font-weight: 500;
                  cursor: pointer;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 4px;
                  transition: all 0.2s;
                  border: 1px solid #dee2e6;
                " onclick="window.open('${feature.properties.linkRop}', '_blank')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#495057" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  ROP
                </button>
                ` : ''}
                
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
                  ${feature.properties.source === 'iss_data' ? 'ISS Data' : 
                    feature.properties.source === 'astacala' ? 'Astacala' : 
                    feature.properties.source === 'external' ? 'Verified' : 'Active'}
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
                ">Informasi Gua</div>`;
          
          // ISS Data specific fields
          if (feature.properties.source === 'iss_data') {
            if (feature.properties.description) {
              popupContent += `
                <div style="margin-bottom: ${isMobile ? '12px' : '16px'};">
                  <div style="display: flex; align-items: start; gap: 12px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <div style="flex: 1;">
                      <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #6c757d; margin-bottom: 2px;">Deskripsi</div>
                      <div style="font-size: ${isMobile ? '13px' : '14px'}; color: #2c3e50;">${feature.properties.description}</div>
                    </div>
                  </div>
                </div>`;
            }
            
            popupContent += `
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: ${isMobile ? '12px' : '16px'};">
                <div style="display: flex; align-items: start; gap: 10px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                  <div>
                    <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Sumber</div>
                    <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.sumberData || '-'}</div>
                  </div>
                </div>
                
                <div style="display: flex; align-items: start; gap: 10px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div>
                    <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Jenis</div>
                    <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.jenisPotensiKarst || '-'}</div>
                  </div>
                </div>
              </div>`;
          }
          
          // Astacala caving specific fields
          else if (feature.properties.source === 'astacala') {
            popupContent += `
              <div style="display: flex; flex-direction: column; gap: ${isMobile ? '12px' : '16px'};">
                ${feature.properties.kegiatan ? `
                <div style="display: flex; align-items: start; gap: 12px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <div style="flex: 1;">
                    <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #6c757d; margin-bottom: 2px;">Kegiatan</div>
                    <div style="font-size: ${isMobile ? '13px' : '14px'}; color: #2c3e50;">${feature.properties.kegiatan}</div>
                  </div>
                </div>
                ` : ''}
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: ${isMobile ? '12px' : '16px'};">
                  ${feature.properties.kedalaman ? `
                  <div style="display: flex; align-items: start; gap: 10px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    <div>
                      <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Kedalaman</div>
                      <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.kedalaman} m</div>
                    </div>
                  </div>
                  ` : ''}
                  
                  ${feature.properties.karakterLorong ? `
                  <div style="display: flex; align-items: start; gap: 10px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                      <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Karakter</div>
                      <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.karakterLorong}</div>
                    </div>
                  </div>
                  ` : ''}
                </div>
                
                ${feature.properties.waktuKegiatan ? `
                <div style="display: flex; align-items: center; gap: 10px; padding-top: 8px; border-top: 1px solid #e9ecef;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #6c757d;">${feature.properties.waktuKegiatan}</div>
                </div>
                ` : ''}
              </div>`;
          }
          
          // Klapanunggal/External specific fields
          else if (feature.properties.source === 'external') {
            popupContent += `
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: ${isMobile ? '12px' : '16px'};">
                ${feature.properties.elevasiMulutGua ? `
                <div style="display: flex; align-items: start; gap: 10px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  <div>
                    <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Elevasi</div>
                    <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.elevasiMulutGua} m</div>
                  </div>
                </div>
                ` : ''}
                
                ${feature.properties.totalKedalaman ? `
                <div style="display: flex; align-items: start; gap: 10px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  <div>
                    <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Kedalaman</div>
                    <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.totalKedalaman} m</div>
                  </div>
                </div>
                ` : ''}
                
                ${feature.properties.totalPanjang ? `
                <div style="display: flex; align-items: start; gap: 10px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                    <path d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                  </svg>
                  <div>
                    <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Panjang</div>
                    <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.totalPanjang} m</div>
                  </div>
                </div>
                ` : ''}
                
                ${feature.properties.statusExplore ? `
                <div style="display: flex; align-items: start; gap: 10px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  <div>
                    <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Status</div>
                    <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.statusExplore}</div>
                  </div>
                </div>
                ` : ''}
              </div>
              
              ${feature.properties.sinonim ? `
              <div style="margin-top: ${isMobile ? '12px' : '16px'}; padding-top: ${isMobile ? '12px' : '16px'}; border-top: 1px solid #e9ecef;">
                <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d; margin-bottom: 4px;">Nama Lain</div>
                <div style="font-size: ${isMobile ? '13px' : '14px'}; color: #2c3e50; font-style: italic;">${feature.properties.sinonim}</div>
              </div>
              ` : ''}
            `;
          }
          
          popupContent += `
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
                  background: #ffcc00;
                  color: #2c3e50;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: ${isMobile ? '10px' : '11px'};
                  font-weight: 600;
                ">CAVING</div>
              </div>
            </div>
          `;
        } else if (feature.properties.division === 'panjatTebing') {
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
                  ${feature.properties.kota || 'Lokasi'}, ${feature.properties.provinsi || 'Indonesia'}
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
                
                ${feature.properties.linkRop ? `
                <button style="
                  flex: 1;
                  padding: ${isMobile ? '8px' : '10px'};
                  border: none;
                  border-radius: 8px;
                  background: #f8f9fa;
                  color: #495057;
                  font-size: ${isMobile ? '12px' : '13px'};
                  font-weight: 500;
                  cursor: pointer;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 4px;
                  transition: all 0.2s;
                  border: 1px solid #dee2e6;
                " onclick="window.open('${feature.properties.linkRop}', '_blank')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#495057" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  ROP
                </button>
                ` : ''}
                
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
                ">Informasi Tebing</div>
                
                ${feature.properties.description ? `
                <div style="margin-bottom: ${isMobile ? '12px' : '16px'};">
                  <div style="display: flex; align-items: start; gap: 12px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <div style="flex: 1;">
                      <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #6c757d; margin-bottom: 2px;">Deskripsi</div>
                      <div style="font-size: ${isMobile ? '13px' : '14px'}; color: #2c3e50;">${feature.properties.description}</div>
                    </div>
                  </div>
                </div>
                ` : ''}
                
                ${feature.properties.kegiatan ? `
                <div style="margin-bottom: ${isMobile ? '12px' : '16px'};">
                  <div style="display: flex; align-items: start; gap: 12px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <div style="flex: 1;">
                      <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #6c757d; margin-bottom: 2px;">Kegiatan</div>
                      <div style="font-size: ${isMobile ? '13px' : '14px'}; color: #2c3e50;">${feature.properties.kegiatan}</div>
                    </div>
                  </div>
                </div>
                ` : ''}
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: ${isMobile ? '12px' : '16px'};">
                  ${feature.properties.ketinggian ? `
                  <div style="display: flex; align-items: start; gap: 10px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <div>
                      <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Ketinggian</div>
                      <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">${feature.properties.ketinggian} m</div>
                    </div>
                  </div>
                  ` : ''}
                  
                  <div style="display: flex; align-items: start; gap: 10px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                    <div>
                      <div style="font-size: ${isMobile ? '11px' : '12px'}; color: #6c757d;">Tipe</div>
                      <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #2c3e50; font-weight: 500;">Panjat Tebing</div>
                    </div>
                  </div>
                </div>
                
                ${feature.properties.waktuKegiatan ? `
                <div style="display: flex; align-items: center; gap: 10px; margin-top: ${isMobile ? '12px' : '16px'}; padding-top: ${isMobile ? '12px' : '16px'}; border-top: 1px solid #e9ecef;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #6c757d;">${feature.properties.waktuKegiatan}</div>
                </div>
                ` : ''}
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
                  background: #33ff33;
                  color: #2c3e50;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: ${isMobile ? '10px' : '11px'};
                  font-weight: 600;
                ">ROCK CLIMBING</div>
              </div>
            </div>
          `;
        } else {
          // Default popup for other divisions
          popupContent = `
            <div style="
              background: white;
              color: #2c3e50;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: ${isMobile ? '16px' : '20px'};
              border-radius: 12px;
              min-width: ${isMobile ? '200px' : '250px'};
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            ">
              <div style="
                font-size: ${isMobile ? '16px' : '18px'};
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 8px;
              ">${feature.properties.name}</div>
              <div style="
                font-size: ${isMobile ? '12px' : '13px'};
                color: #6c757d;
                margin-bottom: 12px;
              ">${divisionNames[feature.properties.division]}</div>
              <div style="
                font-size: ${isMobile ? '13px' : '14px'};
                color: #495057;
                line-height: 1.5;
              ">${feature.properties.description}</div>
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
      maxPitch: 85,
      attributionControl: false // Disable attribution
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
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 51, 51, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 51, 51, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 51, 51, 0);
          }
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(255, 51, 51, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 51, 51, 0.8), 0 0 30px rgba(255, 51, 51, 0.6);
          }
          100% {
            box-shadow: 0 0 5px rgba(255, 51, 51, 0.5);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-45deg) scale(0.8);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .hover-glow:hover {
          animation: glow 2s ease-in-out infinite;
        }
        
        .pulse-on-hover:hover {
          animation: pulse 1s;
        }
        
        /* Remove default maplibre popup styles */
        .maplibregl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          max-width: none !important;
        }

        .maplibregl-popup-tip {
          display: none !important;
        }

        .maplibregl-popup-close-button {
          position: absolute;
          right: 8px;
          top: 8px;
          padding: 4px;
          font-size: 18px;
          line-height: 1;
          color: #6c757d;
          background: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .maplibregl-popup-close-button:hover {
          background: #f8f9fa;
          color: #495057;
        }

        /* Button hover effects in popup */
        .maplibregl-popup button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .maplibregl-popup button:active {
          transform: translateY(0);
        }

        /* Smooth transitions */
        .maplibregl-popup {
          animation: popupFadeIn 0.2s ease-out;
        }

        @keyframes popupFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .maplibregl-popup {
            max-width: calc(100vw - 20px) !important;
          }
          
          .maplibregl-popup-content > div {
            max-width: 100% !important;
          }
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
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '8px' : '10px',
        zIndex: 10,
        animation: 'slideIn 0.6s ease-out'
      }}>
        {/* Home button */}
        <button 
          onClick={() => router.push('/')}
          className="hover-lift pulse-on-hover"
          style={{
            ...toolButtonStyle,
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: '1px solid #333',
            transition: 'all 0.3s ease',
            animationDelay: '0.1s',
            animation: 'rotateIn 0.5s ease-out forwards'
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
          className="hover-lift"
          style={{
            ...toolButtonStyle,
            backgroundColor: showFilters ? '#ff3333' : '#1a1a1a',
            color: 'white',
            border: showFilters ? '1px solid #ff3333' : '1px solid #333',
            transition: 'all 0.3s ease',
            animationDelay: '0.2s',
            animation: 'rotateIn 0.5s ease-out 0.2s forwards',
            opacity: 0
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
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: isMobile ? '10px' : '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          border: '1px solid #ff3333',
          zIndex: 10,
          minWidth: isMobile ? '180px' : '200px',
          maxHeight: isMobile ? '70vh' : 'auto',
          overflowY: 'auto',
          animation: 'slideIn 0.3s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            fontSize: isMobile ? 12 : 14, 
            fontWeight: 'bold', 
            color: '#ff3333', 
            marginBottom: isMobile ? 8 : 10
          }}>
            Filter Divisi
          </div>
          
          {/* Checkbox filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '8px' }}>
            {[
              { key: 'all', label: 'Semua Divisi', color: 'white' },
              { key: 'pendaki', label: 'Divisi Pendakian', color: '#ff3333' },
              { key: 'panjatTebing', label: 'Divisi Panjat Tebing', color: '#33ff33' },
              { key: 'paralayang', label: 'Divisi Paralayang', color: '#3333ff' },
              { key: 'caving', label: 'Divisi Caving', color: '#ffcc00' }
            ].map((item) => (
              <label 
                key={item.key}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: item.color, 
                  cursor: 'pointer', 
                  fontSize: isMobile ? '12px' : '14px',
                  padding: '4px',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  transform: 'translateX(0)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <input 
                  type="checkbox" 
                  checked={activeFilters[item.key]}
                  onChange={() => handleFilterChange(item.key)}
                  style={{ 
                    marginRight: '8px', 
                    width: isMobile ? '16px' : '18px', 
                    height: isMobile ? '16px' : '18px',
                    cursor: 'pointer'
                  }}
                />
                {item.label}
              </label>
            ))}
            
            {/* Data Source Filter */}
            <div style={{ 
              borderTop: '1px solid #333', 
              marginTop: '8px', 
              paddingTop: '8px'
            }}>
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: 'white', 
                  cursor: 'pointer', 
                  fontSize: isMobile ? '12px' : '14px',
                  padding: '4px',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  transform: 'translateX(0)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <input 
                  type="checkbox" 
                  checked={activeFilters.astacalaOnly}
                  onChange={() => handleFilterChange('astacalaOnly')}
                  style={{ 
                    marginRight: '8px', 
                    width: isMobile ? '16px' : '18px', 
                    height: isMobile ? '16px' : '18px',
                    cursor: 'pointer'
                  }}
                />
                Hanya Data Astacala
              </label>
            </div>
            
            {/* 3D Terrain Checkbox */}
            <div style={{ 
              borderTop: '1px solid #333', 
              marginTop: '8px', 
              paddingTop: '8px'
            }}>
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: 'white', 
                  cursor: 'pointer', 
                  fontSize: isMobile ? '12px' : '14px',
                  padding: '4px',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  transform: 'translateX(0)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <input 
                  type="checkbox" 
                  checked={is3D}
                  onChange={toggle3D}
                  style={{ 
                    marginRight: '8px', 
                    width: isMobile ? '16px' : '18px', 
                    height: isMobile ? '16px' : '18px',
                    cursor: 'pointer'
                  }}
                />
                Tampilan 3D Terrain
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Map style switcher - Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 40 : 50,
        left: isMobile ? 10 : 15,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: 'slideInBottom 0.6s ease-out'
      }}>
        {/* Toggle button for map styles */}
        <button
          onClick={() => setShowMapStyles(!showMapStyles)}
          className="hover-lift"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            backgroundColor: showMapStyles ? '#ff3333' : '#1a1a1a',
            color: 'white',
            border: showMapStyles ? '1px solid #ff3333' : '1px solid #333',
            transition: 'all 0.3s ease'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
          </svg>
        </button>
        
        {/* Map style options - shown when expanded */}
        {showMapStyles && (
          <div style={{
            display: 'flex',
            gap: isMobile ? '6px' : '8px',
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            padding: isMobile ? '6px' : '8px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            border: '1px solid #333',
            animation: 'slideIn 0.3s ease-out',
            backdropFilter: 'blur(10px)'
          }}>
            {['outdoor', 'satellite'].map((style, index) => (
              <button 
                key={style}
                onClick={() => changeMapStyle(style)}
                className="hover-lift"
                style={{
                  padding: isMobile ? '4px 8px' : '5px 10px',
                  border: mapStyle === style ? '1px solid #ff3333' : '1px solid #333',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: mapStyle === style ? '#ff3333' : '#1a1a1a',
                  color: 'white',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: mapStyle === style ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.3s ease-out ${index * 0.1}s forwards`,
                  opacity: 0
                }}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        )}
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
        animation: 'slideInTop 0.8s ease-out, glow 3s ease-in-out infinite',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          fontSize: isMobile ? 16 : 20, 
          fontWeight: 'bold', 
          color: '#ff3333', 
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: isMobile ? '0.5px' : '1px',
          textShadow: '0 0 10px rgba(255, 51, 51, 0.5)'
        }}>
          Webgis Astacala
        </h1>
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
            width: buttonSize,
            height: buttonSize,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            backgroundColor: showLegend ? '#ff3333' : '#1a1a1a',
            color: 'white',
            border: showLegend ? '1px solid #ff3333' : '1px solid #333',
            transition: 'all 0.3s ease',
            animation: 'slideInRight 0.8s ease-out'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
        
        {/* Legend content - shown when expanded */}
        {showLegend && (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: isMobile ? '8px 10px' : '10px 15px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            border: '1px solid #333',
            maxWidth: isMobile ? '150px' : 'auto',
            animation: 'slideInRight 0.3s ease-out',
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
              {[
                { color: '#ff3333', label: 'Divisi Pendakian' },
                { color: '#33ff33', label: 'Divisi Panjat Tebing' },
                { color: '#3333ff', label: 'Divisi Paralayang' },
                { color: '#ffcc00', label: 'Divisi Caving' }
              ].map((item) => (
                <div 
                  key={item.label}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center'
                  }}
                >
                  <div style={{ 
                    width: isMobile ? 10 : 12, 
                    height: isMobile ? 10 : 12, 
                    borderRadius: '50%', 
                    backgroundColor: item.color, 
                    marginRight: isMobile ? 6 : 8
                  }}></div>
                  <span style={{ 
                    color: 'white', 
                    fontSize: isMobile ? 10 : 11
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
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
          © Astacala 2025
        </div>
      </div>
    </div>
  );
};

export default MapComponent;