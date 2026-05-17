import { motion } from "framer-motion";
import { COLORS } from "../../constants/colors";
import { cn, scaleIn } from "../../utils/helpers";

export default function Card({ children, className, glow, onClick }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      whileHover={onClick ? { scale: 1.015 } : {}}
      onClick={onClick}
      className={cn(
        "rounded-2xl p-5 border transition-all",
        className,
        onClick && "cursor-pointer"
      )}
      style={{
        background: COLORS.cardDark,
        borderColor: COLORS.navyLight,
        boxShadow: glow ? `0 0 24px ${COLORS.primary}22` : "none",
      }}
    >
      {children}
    </motion.div>
  );
}
