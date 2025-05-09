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
    
    // TAMBAHAN BARU: Fetch ISS data gua
    const issDataResponse = await fetch('http://ec2-13-239-62-109.ap-southeast-2.compute.amazonaws.com/items/iss_data?limit=-1');
    const issDataRaw = await issDataResponse.json();
    
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
    
    // TAMBAHAN BARU: Transform ISS data gua
    const issDataPoints = issDataRaw.data.map(cave => {
      // Pastikan lat dan long bukan string kosong atau null
      if (!cave.lat || !cave.long || cave.lat === " " || cave.long === " ") return null;
      
      // Convert strings to numbers
      const lat = parseFloat(cave.lat);
      const long = parseFloat(cave.long);
      
      // Validasi apakah konversi berhasil
      if (isNaN(lat) || isNaN(long)) return null;
      
      return {
        name: cave.nama_potensi_karst,
        description: cave.deskripsi || 'Tidak ada deskripsi',
        coordinates: [long, lat], // Format [longitude, latitude] untuk MapLibre
        division: 'caving',
        id: cave.id,
        source: 'iss_data',
        // Store ISS data as flat properties
        sumberData: cave.sumber_data || null,
        jenisPotensiKarst: cave.jenis_potensi_karst || null,
        typeGua: cave.type_gua?.trim() || null,
        statusPemetaanGua: cave.status_pemetaan_gua?.trim() || null,
        // Tambahan properti untuk popup
        code: cave.code || null
      };
    }).filter(item => item !== null);
    
    return {
      props: {
        cavingData,
        cavingAstPoints,
        rockClimbingPoints,
        issDataPoints // Menambahkan data ISS ke dalam props
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
        rockClimbingPoints: [],
        issDataPoints: [] // Menambahkan empty array untuk data ISS
      },
      revalidate: 60 // Try again sooner if there was an error
    };
  }
}

export default function MapPage({ cavingData, cavingAstPoints, rockClimbingPoints, issDataPoints }) {
  return (
    <>
      <Head>
        <title>Webgis Astacala</title>
        <meta name="description" content="Peta lokasi kegiatan Astacala" />
        {/* Style CSS tetap sama seperti sebelumnya */}
      </Head>
      
      {/* Pass all data to the map component, termasuk data ISS */}
      <DynamicMap 
        cavingData={cavingData} 
        cavingAstPoints={cavingAstPoints} 
        rockClimbingPoints={rockClimbingPoints}
        issDataPoints={issDataPoints} // Menambahkan data ISS ke DynamicMap
      />
    </>
  );
}