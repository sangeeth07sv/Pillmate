import { COLORS } from "../../constants/colors";

export default function Avatar({ initials, size = 36, color = COLORS.primary }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}
