import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Head from 'next/head';
import Link from 'next/link';

// Ambil data sisi server untuk menghindari masalah CORS
export async function getServerSideProps(context) {
  const { jalur, point, nama, sungai } = context.query;

  if (!jalur || !point) {
    return {
      props: {
        routeData: [],
        pointData: [],
        nama: nama || null,
        sungai: sungai || null,
        error: 'Parameter yang diperlukan tidak ada'
      }
    };
  }

  const baseURL = 'http://52.64.175.183';

  try {
    // Ambil data rute
    const routeResponse = await fetch(`${baseURL}/items/${jalur}?limit=-1`);
    if (!routeResponse.ok) {
      throw new Error(`Pengambilan rute gagal: ${routeResponse.status}`);
    }
    const routeJson = await routeResponse.json();

    // Ambil data titik
    const pointResponse = await fetch(`${baseURL}/items/${point}?limit=-1`);
    if (!pointResponse.ok) {
      throw new Error(`Pengambilan titik gagal: ${pointResponse.status}`);
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
    console.error('Kesalahan pengambilan sisi server:', error);
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

  // Kunci API MapTiler
  const MAPTILER_KEY = 'Bt7BC1waN22lhYojEJO1';

  // Simpan event listener untuk menghapusnya nanti
  const eventListenersRef = useRef([]);

  // Periksa perangkat seluler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fungsi untuk menghapus semua event listener
  const removeAllEventListeners = (mapInstance) => {
    eventListenersRef.current.forEach(({ type, layer, handler }) => {
      mapInstance.off(type, layer, handler);
    });
    eventListenersRef.current = [];
  };

  // Fungsi untuk menambahkan event listener dan melacaknya
  const addTrackedEventListener = (mapInstance, type, layer, handler) => {
    mapInstance.on(type, layer, handler);
    eventListenersRef.current.push({ type, layer, handler });
  };

  // Sesuaikan peta untuk menampilkan semua data
  const fitMapToBounds = (mapInstance) => {
    if (!routeData || !pointData || routeData.length === 0 || pointData.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();

    // Tambahkan koordinat rute ke batas
    routeData.forEach(route => {
      if (route.geom && route.geom.coordinates) {
        route.geom.coordinates.forEach(coord => {
          if (coord && coord.length >= 2) {
            bounds.extend([coord[0], coord[1]]);
          }
        });
      }
    });

    // Tambahkan koordinat titik ke batas
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

  // Tambahkan data rute dan titik ke peta
  const addDataToMap = (mapInstance) => {
    if (!mapInstance || !routeData || !pointData || routeData.length === 0 || pointData.length === 0) {
      console.warn('Tidak ada data untuk ditampilkan di peta');
      return;
    }

    console.log('Menambahkan data ke peta...', { routeData: routeData.length, pointData: pointData.length });

    // Tambahkan rute sungai dengan warna biru untuk air
    routeData.forEach((route, index) => {
      if (route.geom && route.geom.coordinates && route.geom.coordinates.length > 0) {
        const sourceId = `river-route-${index}`;
        const layerId = `river-line-${index}`;

        // Hapus sumber/lapisan yang ada jika ada
        if (mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
        }
        if (mapInstance.getSource(sourceId)) {
          mapInstance.removeSource(sourceId);
        }

        // Tambahkan sumber untuk setiap rute
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

        // Tambahkan lapisan garis untuk rute sungai dengan warna biru
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

        // Tambahkan handler klik untuk rute
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

    // Hapus lapisan/sumber titik yang ada
    if (mapInstance.getLayer('river-points-labels')) {
      mapInstance.removeLayer('river-points-labels');
    }
    if (mapInstance.getLayer('river-points-layer')) {
      mapInstance.removeLayer('river-points-layer');
    }
    if (mapInstance.getSource('river-points')) {
      mapInstance.removeSource('river-points');
    }

    // Tambahkan titik pos pemeriksaan dengan warna berbeda berdasarkan jenisnya
    const pointFeatures = pointData.map(point => ({
      type: 'Feature',
      geometry: point.geom,
      properties: {
        name: point.name || 'Titik Tidak Dikenal',
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

      // Tambahkan lapisan titik dengan pewarnaan bersyarat
      mapInstance.addLayer({
        id: 'river-points-layer',
        type: 'circle',
        source: 'river-points',
        paint: {
          'circle-radius': isMobile ? 8 : 10,
          'circle-color': [
            'case',
            ['==', ['get', 'type'], 'start'], '#4caf50',  // Hijau untuk start
            ['==', ['get', 'type'], 'finish'], '#f44336', // Merah untuk finish
            '#ff9800'  // Oranye untuk pos pemeriksaan
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Tambahkan label untuk titik
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

      // Tambahkan handler klik untuk titik
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
              <span>${
                properties.type === 'start' ? 'Titik Start' :
                properties.type === 'finish' ? 'Titik Finish' : 'Checkpoint'
              }</span>
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

    console.log('Data sungai berhasil ditambahkan');
  };

  // Alihkan medan 3D
  const toggle3D = () => {
    if (!map) return;

    setIs3D(v => {
      const next = !v;

      if (next) {
        // Aktifkan 3D
        if (!map.getSource('terrain')) {
          map.addSource('terrain', {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`
          });
        }
        map.setTerrain({ source: 'terrain' });
      } else {
        // Nonaktifkan 3D
        map.setTerrain(null);
      }

      return next;
    });
  };

  // Ubah gaya peta
  const changeMapStyle = (newStyle) => {
    if (!map || !map.loaded()) return;

    console.log('Mengubah gaya peta menjadi:', newStyle);
    setMapStyle(newStyle);

    // Simpan status peta saat ini
    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();

    // Hapus semua event listener sebelum mengubah gaya
    removeAllEventListeners(map);

    // Atur gaya baru
    map.setStyle(`https://api.maptiler.com/maps/${newStyle}/style.json?key=${MAPTILER_KEY}`);

    // Gunakan beberapa handler acara untuk memastikan data ditambahkan kembali
    const handleStyleLoad = () => {
      console.log('Gaya dimuat, memulihkan status peta...');

      // Pulihkan posisi peta
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);

      // Tambahkan kembali medan jika 3D diaktifkan
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
          console.error('Kesalahan menambahkan medan:', err);
        }
      }

      // Gunakan requestAnimationFrame untuk memastikan gaya dirender sepenuhnya
      requestAnimationFrame(() => {
        console.log('Menambahkan kembali lapisan data...');
        addDataToMap(map);

        // Sesuaikan batas setelah penundaan singkat
        setTimeout(() => {
          fitMapToBounds(map);
        }, 300);
      });
    };

    // Dengarkan acara style.load
    map.once('style.load', handleStyleLoad);

    // Juga dengarkan acara idle sebagai cadangan
    map.once('idle', () => {
      // Periksa apakah lapisan data ada, jika tidak, tambahkan
      if (!map.getLayer('river-points-layer')) {
        console.log('Lapisan data hilang setelah idle, menambahkan kembali...');
        addDataToMap(map);
      }
    });
  };

  // Inisialisasi peta
  useEffect(() => {
    if (!mapContainerRef.current || !routeData || !pointData || routeData.length === 0 || pointData.length === 0) return;

    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${MAPTILER_KEY}`,
      center: [107.38, -7.12], // Pusat default untuk Indonesia
      zoom: isMobile ? 11 : 12,
      maxPitch: 85,
      attributionControl: false
    });

    newMap.addControl(new maplibregl.NavigationControl({
      showCompass: true
    }), 'top-right');

    // Tunggu hingga peta dimuat sepenuhnya sebelum menambahkan data
    newMap.on('load', () => {
      console.log('Peta dimuat, menambahkan data sungai...');
      addDataToMap(newMap);

      // Sesuaikan batas setelah data ditambahkan
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
  }, []); // Hanya jalankan sekali saat pemasangan

  // Tampilkan pesan kesalahan jika tidak ada data
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
            Tidak Dapat Memuat Data Peta Sungai
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#aaa',
            marginBottom: '20px',
            maxWidth: '400px'
          }}>
            {error ? `Kesalahan: ${error}` : 'Tidak ada data yang tersedia untuk ditampilkan'}
          </p>
          <Link href="/">
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#1e88e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Kembali ke Beranda
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
        <title>{nama ? `${nama} - Peta Sungai` : 'Peta Sungai'}</title>
        <meta name="description" content={`Peta interaktif menampilkan ${nama || 'rute sungai'}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
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
        {/* Kontainer peta */}
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

        {/* Tombol kembali */}
        <div style={{
          position: 'absolute',
          left: isMobile ? 10 : 15,
          top: isMobile ? 10 : 15,
          zIndex: 10
        }}>
          <Link href="/">
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

        {/* Header judul */}
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
          border: '1px solid #1e88e5',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            fontSize: isMobile ? 14 : 18,
            fontWeight: 'bold',
            color: '#1e88e5',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: isMobile ? '0.5px' : '1px'
          }}>
            Peta Sungai
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
          {sungai && (
            <p style={{
              fontSize: isMobile ? 10 : 12,
              color: '#888',
              margin: '2px 0 0 0'
            }}>
              {sungai}
            </p>
          )}
        </div>

        {/* Kontrol peta */}
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
          {/* Alihkan 3D */}
          <button
            onClick={toggle3D}
            className="hover-lift"
            style={{
              ...toolButtonStyle,
              backgroundColor: is3D ? '#1e88e5' : '#1a1a1a',
              border: is3D ? '1px solid #1e88e5' : '1px solid #333'
            }}
            title="Alihkan Medan 3D"
          >
            <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 'bold' }}>3D</span>
          </button>

          {/* Alihkan gaya peta */}
          <button
            onClick={() => changeMapStyle(mapStyle === 'outdoor' ? 'satellite' : 'outdoor')}
            className="hover-lift"
            style={toolButtonStyle}
            title="Ubah Gaya Peta"
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

        {/* Legenda */}
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
          {/* Tombol alihkan untuk legenda */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="hover-lift"
            style={{
              ...toolButtonStyle,
              backgroundColor: showLegend ? '#1e88e5' : '#1a1a1a',
              border: showLegend ? '1px solid #1e88e5' : '1px solid #333'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>

          {/* Konten legenda */}
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
                    backgroundColor: '#1e88e5',
                    marginRight: isMobile ? 6 : 8
                  }}></div>
                  <span style={{
                    color: 'white',
                    fontSize: isMobile ? 10 : 11
                  }}>
                    Rute Sungai
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: isMobile ? 10 : 12,
                    height: isMobile ? 10 : 12,
                    borderRadius: '50%',
                    backgroundColor: '#4caf50',
                    marginRight: isMobile ? 6 : 8
                  }}></div>
                  <span style={{
                    color: 'white',
                    fontSize: isMobile ? 10 : 11
                  }}>
                    Titik Start
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: isMobile ? 10 : 12,
                    height: isMobile ? 10 : 12,
                    borderRadius: '50%',
                    backgroundColor: '#f44336',
                    marginRight: isMobile ? 6 : 8
                  }}></div>
                  <span style={{
                    color: 'white',
                    fontSize: isMobile ? 10 : 11
                  }}>
                    Titik Finish
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: isMobile ? 10 : 12,
                    height: isMobile ? 10 : 12,
                    borderRadius: '50%',
                    backgroundColor: '#ff9800',
                    marginRight: isMobile ? 6 : 8
                  }}></div>
                  <span style={{
                    color: 'white',
                    fontSize: isMobile ? 10 : 11
                  }}>
                    Checkpoint
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bilah hak cipta bawah */}
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
            © 2025 - Peta Sungai
          </div>
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