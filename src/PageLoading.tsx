import React from "react";
import { motion } from "framer-motion";

// Full-page loading element tailored for a Laundry service app
// - Shows a cute washing machine with spinning drum and floating bubbles
// - Includes an optional skeleton layout to hint at incoming content
// - Works on light/dark themes
// - Drop it anywhere: <LaundryPageLoader message="Fetching your fresh folds..." />

type LaundryPageLoaderProps = {
  message?: string;
  showSkeleton?: boolean; // show page skeleton placeholders (header + list)
};

const Bubble: React.FC<{ delay?: number; size?: number; left?: string }>
 = ({ delay = 0, size = 10, left = "50%" }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: [0, 1, 1, 0], y: [-4, -12, -24, -36] }}
      transition={{ duration: 2.4, repeat: Infinity, delay }}
      className="absolute bottom-0"
      style={{ left, width: size, height: size }}
    >
      <span className="block w-full h-full rounded-full bg-cyan-300/70 dark:bg-cyan-400/60 blur-[0.5px]" />
    </motion.span>
  );
};

const WashingMachine: React.FC = () => {
  return (
    <div className="relative mx-auto h-40 w-40 rounded-3xl bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 shadow-xl border border-slate-200/70 dark:border-slate-700 overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 h-8 bg-slate-200/80 dark:bg-slate-700/60" />

      {/* Door ring */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-28 w-28 rounded-full bg-slate-300/60 dark:bg-slate-700/60 p-1 shadow-inner">
          {/* Glass */}
          <div className="relative h-full w-full rounded-full bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-slate-900/40 overflow-hidden">
            {/* Water */}
            <div className="absolute inset-0 rounded-full bg-cyan-300/70 dark:bg-cyan-400/40" />

            {/* Rotating drum with clothes */}
            <div className="absolute inset-0 grid place-items-center">
              <motion.div
                className="h-20 w-20 rounded-full border-4 border-dashed border-white/80 dark:border-white/30"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 2.4 }}
              />
              <motion.div
                className="absolute h-4 w-8 rounded-sm bg-fuchsia-400/80"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 2.4 }}
                style={{ transformOrigin: "-16px 20px" }}
              />
              <motion.div
                className="absolute h-3 w-6 rounded-sm bg-amber-300/90"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 2.4 }}
                style={{ transformOrigin: "36px -8px" }}
              />
            </div>

            {/* Bubbles rising */}
            <div className="absolute inset-0">
              <Bubble delay={0.1} size={8} left="28%" />
              <Bubble delay={0.5} size={10} left="60%" />
              <Bubble delay={0.9} size={6} left="42%" />
            </div>
          </div>
        </div>
      </div>

      {/* Knob */}
      <div className="absolute right-2 top-2 h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-600" />
      {/* Indicator light */}
      <motion.span
        className="absolute right-8 top-2 h-2.5 w-2.5 rounded-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
        style={{ background: "radial-gradient(circle at 30% 30%, #34d399, #059669)" }}
      />
    </div>
  );
};

const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`rounded-xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse ${className || ""}`} />
);

const LaundryPageLoader: React.FC<LaundryPageLoaderProps> = ({
  message = "Getting your laundry ready...",
  showSkeleton = true,
}) => {
  return (
    <div className="min-h-[70vh] w-full grid place-items-center p-6">
      <div className="w-full max-w-3xl">
        {/* Card */}
        <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <WashingMachine />
            <div className="flex-1 text-center md:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100"
              >
                {message}
              </motion.h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Spinning cycles, fluffing folds, minty-fresh status updates.
              </p>

              {/* Progress bar */}
              <div className="mt-4 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                  initial={{ x: "-50%" }}
                  animate={{ x: ["-50%", "50%", "-50%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {showSkeleton && (
            <div className="mt-8 space-y-4">
              {/* Header row */}
              <div className="flex items-center gap-4">
                <SkeletonBlock className="h-10 w-28" />
                <SkeletonBlock className="h-10 flex-1" />
                <SkeletonBlock className="h-10 w-24" />
              </div>
              {/* List items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <SkeletonBlock className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <SkeletonBlock className="h-3 w-2/3" />
                        <SkeletonBlock className="h-3 w-1/2" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <SkeletonBlock className="h-8 w-20" />
                      <SkeletonBlock className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tiny helper text */}
        {/* <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Tip: You can hide skeletons with <code>showSkeleton={{false}}</code>.
        </p> */}
      </div>
    </div>
  );
};

export default LaundryPageLoader;
