import dynamic from 'next/dynamic';
import React from 'react';
import Head from 'next/head';

// Create a placeholder while the map is loading
const MapLoading = () => (
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
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 200,
        marginBottom: 20
      }}>
        <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" 
                fontFamily="'Arial Black', sans-serif" fontSize="24" fontWeight="bold" fill="#ff3333">
            ASTACALA
          </text>
        </svg>
      </div>
      <p style={{ fontSize: 16, color: '#aaa', margin: '20px 0' }}>
        Loading map...
      </p>
      <div style={{ 
        width: 40, 
        height: 40, 
        border: '3px solid #222',
        borderTop: '3px solid #ff3333',
        borderRadius: '50%',
        margin: '0 auto',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  </div>
);

// Dynamically load the map component with no SSR
const DynamicMap = dynamic(
  () => import('../components/MapComponent'),
  { 
    ssr: false,
    loading: MapLoading 
  }
);

// Function to parse coordinates from "6.46966°S 106.95931°E" format to [longitude, latitude]
const parseCoordinates = (coordString) => {
  try {
    // Check if coordString is null or undefined
    if (!coordString) {
      console.error("Error parsing coordinates: null");
      return null;
    }
    
    // Check if coordinates are in the format "-6.826774033660179, 107.4439211531441"
    if (coordString.includes(',')) {
      const parts = coordString.split(',');
      const latitude = parseFloat(parts[0].trim());
      const longitude = parseFloat(parts[1].trim());
      return [longitude, latitude]; // MapLibre uses [longitude, latitude]
    }
    
    // Extract the numbers and directions
    const parts = coordString.split(' ');
    
    // Parse latitude
    const latPart = parts[0];
    const latValue = parseFloat(latPart);
    const isLatSouth = latPart.includes('S');
    const latitude = isLatSouth ? -latValue : latValue;
    
    // Parse longitude
    const lngPart = parts[1];
    const lngValue = parseFloat(lngPart);
    const isLngWest = lngPart.includes('W');
    const longitude = isLngWest ? -lngValue : lngValue;
    
    return [longitude, latitude]; // MapLibre uses [longitude, latitude]
  } catch (error) {
    console.error("Error parsing coordinates:", coordString, error);
    return null;
  }
};

// Function to parse coordinates from "6°50'59\"S 107°24'10\"E" format
const parseDMSCoordinates = (coordString) => {
  try {
    // Check if coordString is null or undefined
    if (!coordString) {
      console.error("Error parsing DMS coordinates: null");
      return null;
    }
    
    // Regular expression to extract degrees, minutes, seconds and direction
    const regex = /(\d+)°(\d+)'(\d+)"([NS])\s+(\d+)°(\d+)'(\d+)"([EW])/;
    const match = coordString.match(regex);
    
    if (!match) {
      console.error("DMS coordinate format not recognized:", coordString);
      return null;
    }
    
    const latDeg = parseInt(match[1]);
    const latMin = parseInt(match[2]);
    const latSec = parseInt(match[3]);
    const latDir = match[4];
    
    const lngDeg = parseInt(match[5]);
    const lngMin = parseInt(match[6]);
    const lngSec = parseInt(match[7]);
    const lngDir = match[8];
    
    // Convert to decimal degrees
    let latitude = latDeg + latMin/60 + latSec/3600;
    latitude = latDir === 'S' ? -latitude : latitude;
    
    let longitude = lngDeg + lngMin/60 + lngSec/3600;
    longitude = lngDir === 'W' ? -longitude : longitude;
    
    return [longitude, latitude];
  } catch (error) {
    console.error("Error parsing DMS coordinates:", coordString, error);
    return null;
  }
};

// Fetch data at build time
export async function getStaticProps() {
  try {
    // Fetch cave data (external)
    const caveResponse = await fetch('http://ec2-13-239-62-109.ap-southeast-2.compute.amazonaws.com/items/caves?limit=-1');
    const caveData = await caveResponse.json();
    
    // Fetch Astacala cave data
    const cavingAstResponse = await fetch('http://ec2-13-239-62-109.ap-southeast-2.compute.amazonaws.com/items/caving_ast');
    const cavingAstData = await cavingAstResponse.json();
    
    // Fetch rock climbing data
    const rockClimbingResponse = await fetch('http://ec2-13-239-62-109.ap-southeast-2.compute.amazonaws.com/items/rock_climbing');
    const rockClimbingData = await rockClimbingResponse.json();
    
    // Transform the external cave data
    const cavingData = caveData.data.map(cave => {
      const coordinates = parseCoordinates(cave.titik_koordinat);
      
      // Skip items with invalid coordinates
      if (!coordinates) return null;
      
      return {
        name: cave.nama_gua,
        description: `Sinonim: ${cave.sinonim || 'Tidak ada'}<br>Elevasi: ${cave.elevasi_mulut_gua} m<br>Status: ${cave.status_explore}`,
        coordinates: coordinates,
        division: 'caving',
        id: cave.id,
        source: 'external',
        // Store cave data as flat properties to avoid nesting issues
        karakterLorong: cave.karakter_lorong || null,
        totalKedalaman: cave.total_kedalaman || null,
        totalPanjang: cave.total_panjang || null
      };
    }).filter(item => item !== null); // Remove any null items (invalid coordinates)
    
    // Transform the Astacala cave data
    const cavingAstPoints = cavingAstData.data.map(cave => {
      const coordinates = parseDMSCoordinates(cave.titik_koordinat);
      
      // Skip items with invalid coordinates
      if (!coordinates) return null;
      
      return {
        name: cave.nama_gua,
        description: cave.deskripsi || 'Tidak ada deskripsi',
        coordinates: coordinates,
        division: 'caving',
        id: cave.id,
        source: 'astacala',
        // Store cave data as flat properties
        kegiatan: cave.kegiatan || null,
        kota: cave.kota || null,
        provinsi: cave.provinsi || null,
        kedalaman: cave.kedalaman || null,
        karakterLorong: cave.karakter_lorong || null,
        waktuKegiatan: cave.waktu_kegiatan || null,
        linkRop: cave.link_rop || null
      };
    }).filter(item => item !== null);
    
    // Transform the rock climbing data
    const rockClimbingPoints = rockClimbingData.data.map(rc => {
      const coordinates = parseCoordinates(rc.titik_koordinat);
      
      // Skip items with invalid coordinates
      if (!coordinates) return null;
      
      return {
        name: rc.nama_lokasi,
        description: rc.deskripsi || 'Tidak ada deskripsi',
        coordinates: coordinates,
        division: 'panjatTebing',
        id: rc.id,
        source: 'astacala',
        // Store rock climbing data as flat properties
        kegiatan: rc.kegiatan || null,
        kota: rc.kota || null,
        provinsi: rc.provinsi || null,
        ketinggian: rc.ketinggian || null,
        waktuKegiatan: rc.waktu_kegiatan || null,
        linkRop: rc.link_rop || null
      };
    }).filter(item => item !== null);
    
    return {
      props: {
        cavingData,
        cavingAstPoints,
        rockClimbingPoints
      },
      // Re-generate the page at most once per hour
      revalidate: 3600
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return empty data if fetch fails
    return {
      props: {
        cavingData: [],
        cavingAstPoints: [],
        rockClimbingPoints: []
      },
      revalidate: 60 // Try again sooner if there was an error
    };
  }
}

export default function MapPage({ cavingData, cavingAstPoints, rockClimbingPoints }) {
  return (
    <>
      <Head>
        <title>Webgis Astacala</title>
        <meta name="description" content="Peta lokasi kegiatan Astacala" />
        <style jsx global>{`
          /* Reset CSS to ensure full viewport usage */
          html, body, #__next {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background-color: #000000;
          }
          
          /* Animation for loading spinner */
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Button hover effects */
          button:hover {
            filter: brightness(1.2);
            transition: all 0.2s ease;
          }
          
          button:active {
            filter: brightness(0.9);
          }
          
          /* Navigation control customization */
          .maplibregl-ctrl-zoom-in, 
          .maplibregl-ctrl-zoom-out, 
          .maplibregl-ctrl-compass {
            background-color: #1a1a1a !important;
            color: white !important;
          }
          
          .maplibregl-ctrl-zoom-in span, 
          .maplibregl-ctrl-zoom-out span, 
          .maplibregl-ctrl-compass span {
            filter: invert(1);
          }
          
          .maplibregl-ctrl button:hover {
            background-color: #333 !important;
          }
          
          /* Custom popup styling */
          .maplibregl-popup-content {
            background-color: #1a1a1a !important;
            padding: 12px !important;
            border: 1px solid #ff3333 !important;
            border-radius: 4px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5) !important;
            color: white !important;
          }
          
          .maplibregl-popup-close-button {
            color: #ff3333 !important;
            font-size: 18px !important;
            padding-right: 6px !important;
          }
          
          .maplibregl-popup-tip {
            border-top-color: #1a1a1a !important;
            border-bottom-color: #1a1a1a !important;
          }
          
          /* Scrollbar customization */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #1a1a1a;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #ff3333;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #ff5555;
          }
        `}</style>
      </Head>
      
      {/* Pass all data to the map component */}
      <DynamicMap 
        cavingData={cavingData} 
        cavingAstPoints={cavingAstPoints} 
        rockClimbingPoints={rockClimbingPoints} 
      />
    </>
  );
}