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

// Fetch cave data at build time
export async function getStaticProps() {
  try {
    // Fetch the cave data
    const response = await fetch('http://ec2-13-239-62-109.ap-southeast-2.compute.amazonaws.com/items/caves');
    const data = await response.json();
    
    // Transform the API data to match our points format
    const cavingData = data.data.map(cave => {
      const coordinates = parseCoordinates(cave.titik_koordinat);
      
      // Skip items with invalid coordinates
      if (!coordinates) return null;
      
      return {
        name: cave.nama_gua,
        description: `Sinonim: ${cave.sinonim || 'Tidak ada'}<br>Elevasi: ${cave.elevasi_mulut_gua} m<br>Status: ${cave.status_explore}`,
        coordinates: coordinates,
        division: 'caving',
        id: cave.id,
        // Store cave data in a format that can be properly serialized for props
        caveData: {
          karakterLorong: cave.karakter_lorong || null,
          totalKedalaman: cave.total_kedalaman || null,
          totalPanjang: cave.total_panjang || null
        }
      };
    }).filter(item => item !== null); // Remove any null items (invalid coordinates)
    
    return {
      props: {
        cavingData
      },
      // Re-generate the page at most once per hour
      revalidate: 3600
    };
  } catch (error) {
    console.error("Error fetching cave data:", error);
    // Return empty data if fetch fails
    return {
      props: {
        cavingData: []
      },
      revalidate: 60 // Try again sooner if there was an error
    };
  }
}

export default function MapPage({ cavingData }) {
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
      
      {/* Pass the caving data to the map component */}
      <DynamicMap cavingData={cavingData} />
    </>
  );
}