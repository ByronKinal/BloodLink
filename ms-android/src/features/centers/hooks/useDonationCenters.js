import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as centersApi from '../api/centers.api';
import { getErrorMessage } from '../../../shared/utils/apiError';

async function resolveCoords() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return {};

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (err) {
    console.log('No se pudo obtener la ubicacion:', err?.message);
    return {};
  }
}

export function useDonationCenters({ urgentOnly = false } = {}) {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCenters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const coords = await resolveCoords();
      const data = urgentOnly
        ? await centersApi.getUrgentCenters(coords)
        : await centersApi.getCenters(coords);
      setCenters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Error fetching donation centers:', err?.message);
      setError(getErrorMessage(err, 'No se pudieron cargar los centros de donación.'));
    } finally {
      setLoading(false);
    }
  }, [urgentOnly]);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  return { centers, loading, error, refetch: fetchCenters };
}
