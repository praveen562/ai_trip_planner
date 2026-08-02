import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { DESTINATIONS } from '../../../constants/destinations';
import { cn } from '../../../utils/cn';

function DestinationTile({ destination, delay }: { destination: (typeof DESTINATIONS)[number]; delay: number }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
    >
      {imageFailed ? (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/40" />
      ) : (
        <img
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className={cn(
            'absolute inset-0 size-full object-cover transition-transform duration-500',
            'group-hover:scale-105'
          )}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-mono text-xs tracking-wide text-white/60">{destination.routeCode}</p>
        <h3 className="font-display text-xl font-semibold text-white">{destination.name}</h3>
        <p className="text-sm text-white/70">{destination.country}</p>
      </div>
    </motion.div>
  );
}

export function Destinations() {
  return (
    <section id="destinations" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Where to next"
          title="Popular with Naviora travelers"
          description="A few places people are planning trips to this season."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {DESTINATIONS.map((destination, i) => (
            <DestinationTile key={destination.name} destination={destination} delay={(i % 3) * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
