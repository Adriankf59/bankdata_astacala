const BASE_URL = 'http://43.157.225.71:8080/api/v1';

/**
 * Fetch caves GeoJSON data from the Bank Data API
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
export async function fetchCavesGeoJSON() {
  const response = await fetch(`${BASE_URL}/caves/geojson`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Transform GeoJSON features to MapComponent format
 * @param {Object} geojson - GeoJSON FeatureCollection
 * @returns {Array} Array of cave points in MapComponent format
 */
export function transformCaveFeatures(geojson) {
  if (!geojson || !geojson.features) {
    return [];
  }

  return geojson.features
    .filter(feature => {
      // Filter out features with invalid geometry
      if (!feature.geometry || !feature.geometry.coordinates) {
        console.warn('Skipping feature with invalid geometry:', feature);
        return false;
      }
      return true;
    })
    .map(feature => {
      const props = feature.properties || {};
      return {
        name: props.nama_gua || 'Gua Tanpa Nama',
        description: props.nama_gua || 'Gua Tanpa Nama',
        coordinates: feature.geometry.coordinates, // Already [lng, lat]
        division: 'caving',
        id: `bankdata-${props.id || 'unknown'}`,
        source: 'bankdata_api',
        // Cave-specific properties - use null instead of undefined
        elevasi: props.elevasi ?? null,
        kedalaman: props.kedalaman ?? null,
        panjang: props.panjang ?? null,
        karakterLorong: props.karakter_lorong ?? null,
        statusExplore: props.status_explore ?? null,
        kota: props.kota ?? null,
        provinsi: props.provinsi ?? null,
        sinonim: props.sinonim ?? null,
      };
    });
}
