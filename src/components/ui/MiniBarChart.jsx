import { motion } from "framer-motion";
import { COLORS } from "../../constants/colors";

export default function MiniBarChart({ data, color = COLORS.primary, labels }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-20 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <motion.div
            className="w-full rounded-t-md"
            style={{ backgroundColor: color, opacity: 0.85 }}
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 64}px` }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
          />
          {labels && (
            <span className="text-[9px]" style={{ color: COLORS.textMuted }}>
              {labels[i]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
