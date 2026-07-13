"use client";

import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

export function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-6 max-w-sm rounded-xl border border-purple-400/30 bg-[#0a0e1af0] p-6 text-white shadow-2xl"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-purple-300">{siteConfig.name}</p>
            <h2 className="mt-2 text-xl font-semibold">{siteConfig.heroTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{siteConfig.about}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-lg border border-purple-400/40 py-2 text-xs uppercase tracking-[0.2em] text-purple-200 transition-colors hover:bg-purple-500/20"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
