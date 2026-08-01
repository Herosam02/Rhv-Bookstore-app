import { Star } from 'lucide-react';
import { classNames } from '../utils/format';
import { motion } from 'framer-motion';

interface Props {
  rating: number;
  count?: number;
  size?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export default function StarRating({ rating, count, size = 16, onChange, className }: Props) {
  const interactive = !!onChange;
  return (
    <div className={classNames('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.round(rating);
          return (
            <motion.button
              key={i}
              type="button"
              whileHover={interactive ? { scale: 1.2 } : undefined}
              disabled={!interactive}
              onClick={() => onChange?.(i)}
              className={classNames(
                'inline-flex',
                interactive ? 'cursor-pointer' : 'cursor-default',
                !interactive && 'pointer-events-none'
              )}
              aria-label={`${i} star`}
            >
              <Star
                size={size}
                className={
                  filled ? 'fill-brand-400 text-brand-400' : 'text-ink-300/50 dark:text-ink-100/20'
                }
              />
            </motion.button>
          );
        })}
      </div>
      {typeof count === 'number' && (
        <span className="text-xs text-ink-500/70 dark:text-ink-100/60">
          {rating.toFixed(1)} ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
