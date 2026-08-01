import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Props {
  title: string;
  to?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export default function SectionHeader({ title, to, icon, subtitle }: Props) {
  return (
    <div className="flex items-end justify-between mb-5 gap-4">
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2"
        >
          {icon}
          {title}
        </motion.h2>
        {subtitle && <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:gap-2 transition-all">
          View all <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
