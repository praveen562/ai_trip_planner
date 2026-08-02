import { motion, useReducedMotion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { SectionTitle } from '../../../components/ui/SectionTitle';

/**
 * A stylized dot-map (Stripe/Vercel-style), not a rotating 3D globe —
 * restrained and quicker to scan than a literal spinning-earth cliché.
 * Continents are abstracted as dot clusters; three waypoints are
 * connected by a drawn dashed path with a plane easing along it.
 */
const CONTINENT_DOTS: Array<[number, number]> = [
  // North America
  [60, 70], [80, 65], [100, 75], [70, 90], [90, 95], [50, 90],
  // South America
  [110, 140], [120, 160], [105, 175],
  // Europe
  [260, 65], [280, 60], [270, 80], [290, 75],
  // Africa
  [270, 120], [285, 140], [260, 150], [290, 160], [275, 175],
  // Asia
  [340, 60], [370, 70], [400, 65], [420, 85], [390, 100], [360, 90],
  // Australia
  [430, 190], [450, 195], [440, 205]
];

const WAYPOINTS = {
  a: { x: 280, y: 70, label: 'London' },
  b: { x: 390, y: 95, label: 'Tokyo' },
  c: { x: 280, y: 150, label: 'Cape Town' }
};

const PATH_D = `M ${WAYPOINTS.a.x} ${WAYPOINTS.a.y} Q 340 40 ${WAYPOINTS.b.x} ${WAYPOINTS.b.y} T ${WAYPOINTS.c.x} ${WAYPOINTS.c.y}`;

export function RouteMap() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Anywhere, optimized"
          title="One route, wherever the trip takes you"
          description="Naviora orders every saved place into the most efficient path — across a neighborhood or across a continent."
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          <svg viewBox="0 0 480 220" className="w-full" role="img" aria-label="Stylized world map with a connected travel route">
            {CONTINENT_DOTS.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={2.5} className="fill-gray-200" />
            ))}

            <path
              d={PATH_D}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              strokeLinecap="round"
              opacity={0.6}
            />

            {Object.values(WAYPOINTS).map((wp) => (
              <g key={wp.label}>
                <circle cx={wp.x} cy={wp.y} r={5} className="fill-primary" />
                <circle cx={wp.x} cy={wp.y} r={9} className="fill-primary/20" />
              </g>
            ))}

            {!shouldReduceMotion && (
              <motion.foreignObject
                width={18}
                height={18}
                animate={{
                  x: [WAYPOINTS.a.x - 9, 340 - 9, WAYPOINTS.b.x - 9, WAYPOINTS.c.x - 9],
                  y: [WAYPOINTS.a.y - 9, 40 - 9, WAYPOINTS.b.y - 9, WAYPOINTS.c.y - 9]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear', times: [0, 0.4, 0.7, 1] }}
              >
                <div className="flex size-[18px] items-center justify-center rounded-full bg-primary text-white shadow-md">
                  <Plane className="size-3" />
                </div>
              </motion.foreignObject>
            )}
          </svg>

          <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
            {Object.values(WAYPOINTS).map((wp) => (
              <span key={wp.label} className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                {wp.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
