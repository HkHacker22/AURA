'use client';

import { motion } from 'framer-motion';
import { Mic, Save, Plus } from 'lucide-react';

interface FloatingActionsProps {
  onBrainDump?: () => void;
  onSaveMe?: () => void;
  onAddTask?: () => void;
}

export function FloatingActions({ onBrainDump, onSaveMe, onAddTask }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddTask}
        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBrainDump}
        className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-secondary/25"
      >
        <Mic className="w-6 h-6 text-white" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSaveMe}
        className="w-14 h-14 rounded-full bg-danger flex items-center justify-center shadow-lg shadow-danger/25"
      >
        <Save className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}