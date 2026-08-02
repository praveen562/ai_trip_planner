import { motion } from 'framer-motion';
import { ItineraryDayCard } from '../../../components/common/ItineraryDayCard';
import type { ItineraryDay } from '../../../types/itinerary';

export function ItineraryTab({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="space-y-5">
      {days.map((day, i) => (
        <motion.div
          key={day.dayNumber}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          <ItineraryDayCard day={day} />
        </motion.div>
      ))}
    </div>
  );
}
