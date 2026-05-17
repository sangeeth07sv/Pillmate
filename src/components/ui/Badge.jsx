import { COLORS } from "../../constants/colors";
import { cn } from "../../utils/helpers";

export default function Badge({ children, color = COLORS.primary, small }) {
  return (
    <span
      className={cn(
        "rounded-full font-semibold",
        small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      )}
      style={{ background: color + "22", color }}
    >
      {children}
    </span>
  );
}
