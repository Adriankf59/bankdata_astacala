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
    <div style={{ 
      textAlign: 'center',
      padding: '20px',
      maxWidth: '90%'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 200,
        marginBottom: 20,
        margin: '0 auto'
      }}>
        <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" 
                fontFamily="'Arial Black', sans-serif" fontSize="24" fontWeight="bold" fill="#ff3333">
            ASTACALA
          </text>
        </svg>
      </div>
      <p style={{ 
        fontSize: 'clamp(14px, 4vw, 16px)', 
        color: '#aaa', 
        margin: '20px 0' 
      }}>
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
    // Import API functions
    const { fetchCavesGeoJSON, transformCaveFeatures } = await import('../lib/api/caves');

    console.log('Fetching caves data from Bank Data API...');

    // Fetch caves data from new API
    const cavesGeoJSON = await fetchCavesGeoJSON();
    const cavingData = transformCaveFeatures(cavesGeoJSON);

    console.log(`Loaded ${cavingData.length} cave points from Bank Data API`);

    return {
      props: {
        cavingData,
        // Other props set to empty arrays for backward compatibility
        cavingAstPoints: [],
        rockClimbingPoints: [],
        issDataPoints: [],
        divingPoints: [],
        paralayangPoints: []
      },
      // Re-generate the page at most once per hour
      revalidate: 3600
    };
  } catch (error) {
    console.error("Error fetching caves data:", error);
    // Return empty data if fetch fails
    return {
      props: {
        cavingData: [],
        cavingAstPoints: [],
        rockClimbingPoints: [],
        issDataPoints: [],
        divingPoints: [],
        paralayangPoints: []
      },
      revalidate: 60 // Try again sooner if there was an error
    };
  }
}

export default function MapPage({ cavingData, cavingAstPoints, rockClimbingPoints, issDataPoints, divingPoints, paralayangPoints }) {
  return (
    <>
      <Head>
        <title>Webgis Astacala</title>
        <meta name="description" content="Peta lokasi kegiatan Astacala" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
          
          /* Custom popup styling - responsive */
          .maplibregl-popup-content {
            background-color: transparent !important;
            background: transparent !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            color: white !important;
            max-width: min(90vw, 380px) !important;
            font-size: clamp(12px, 3vw, 14px) !important;
          }

          .maplibregl-popup {
            max-width: min(90vw, 380px) !important;
          }
          
          .maplibregl-popup-close-button {
            color: #ff3333 !important;
            font-size: clamp(16px, 4vw, 18px) !important;
            padding-right: 6px !important;
          }
          
          .maplibregl-popup-tip {
            border-top-color: #1a1a1a !important;
            border-bottom-color: #1a1a1a !important;
          }
          
          /* Mobile-specific popup adjustments */
          @media (max-width: 640px) {
            .maplibregl-popup {
              max-width: 85vw !important;
            }
            
            .maplibregl-popup-content {
              max-height: 40vh !important;
              overflow-y: auto !important;
            }
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
          
          /* Mobile scrollbar */
          @media (max-width: 768px) {
            ::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }
          }
          
          /* Map controls responsive positioning */
          @media (max-width: 640px) {
            .maplibregl-ctrl-top-right {
              top: 10px !important;
              right: 10px !important;
            }
            
            .maplibregl-ctrl-bottom-right {
              bottom: 20px !important;
              right: 10px !important;
            }
            
            .maplibregl-ctrl button {
              width: 35px !important;
              height: 35px !important;
            }
          }
          
          /* Tablet-specific adjustments */
          @media (min-width: 641px) and (max-width: 1024px) {
            .maplibregl-ctrl button {
              width: 40px !important;
              height: 40px !important;
            }
          }
          
          /* Ensure map container is responsive */
          .map-container {
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
          }
          
          /* Touch-friendly tap targets */
          @media (hover: none) and (pointer: coarse) {
            button, a, .clickable {
              min-height: 44px;
              min-width: 44px;
            }
          }
        `}</style>
      </Head>
      
      {/* Pass all data to the map component */}
      <DynamicMap 
        cavingData={cavingData} 
        cavingAstPoints={cavingAstPoints} 
        rockClimbingPoints={rockClimbingPoints}
        issDataPoints={issDataPoints}
        divingPoints={divingPoints}
        paralayangPoints={paralayangPoints}
      />
    </>
  );
}