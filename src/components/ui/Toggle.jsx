import { motion } from "framer-motion";
import { COLORS } from "../../constants/colors";

export default function Toggle({ on, onToggle, label }) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm" style={{ color: COLORS.textMuted }}>
          {label}
        </span>
      )}
      <div
        onClick={onToggle}
        className="relative w-11 h-6 rounded-full cursor-pointer transition-all"
        style={{ background: on ? COLORS.primary : COLORS.navyLight }}
      >
        <motion.div
          animate={{ x: on ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        />
      </div>
    </div>
  );
}
