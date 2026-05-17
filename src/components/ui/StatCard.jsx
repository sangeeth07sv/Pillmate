import { motion } from "framer-motion";
import { COLORS } from "../../constants/colors";
import Badge from "./Badge";
import { fadeUp } from "../../utils/helpers";

export default function StatCard({ icon, label, value, sub, color, i }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={i}
      initial="hidden"
      animate="visible"
      className="rounded-2xl p-5 border flex flex-col gap-2"
      style={{ background: COLORS.cardDark, borderColor: COLORS.navyLight }}
    >
      <div className="flex items-center justify-between">
        <div className="text-2xl">{icon}</div>
        {sub && <Badge color={color} small>{sub}</Badge>}
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: COLORS.textMuted }}>
        {label}
      </div>
    </motion.div>
  );
}
