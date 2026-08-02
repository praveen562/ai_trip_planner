export interface Destination {
  name: string;
  country: string;
  routeCode: string;
  imageUrl: string;
}

/**
 * Placeholder imagery for now — Card has an onError fallback to a
 * gradient tile, so a slow/unreachable image never shows as a broken
 * <img>. Once Step 10 wires up the backend, this becomes real,
 * user-uploaded/Unsplash-enriched destination photography via the
 * existing Places module.
 */
export const DESTINATIONS: Destination[] = [
  {
    name: 'Kyoto',
    country: 'Japan',
    routeCode: 'NVR · 014',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'
  },
  {
    name: 'Santorini',
    country: 'Greece',
    routeCode: 'NVR · 027',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'
  },
  {
    name: 'Ubud',
    country: 'Indonesia',
    routeCode: 'NVR · 041',
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80'
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    routeCode: 'NVR · 052',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80'
  },
  {
    name: 'Queenstown',
    country: 'New Zealand',
    routeCode: 'NVR · 063',
    imageUrl: 'https://images.unsplash.com/photo-1589871173980-9c93bf5ce02c?w=800&q=80'
  },
  {
    name: 'Marrakech',
    country: 'Morocco',
    routeCode: 'NVR · 078',
    imageUrl: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=800&q=80'
  }
];
