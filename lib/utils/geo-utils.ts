export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  useMetric: boolean
): number => {
  const R = useMetric ? 6371 : 3959; // Earth's radius in km or miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};