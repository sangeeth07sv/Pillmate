import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "../../constants/colors";
import { NAV_ITEMS } from "../../constants/navigation";
import Badge from "../ui/Badge";
import { cn } from "../../utils/helpers";

export default function Sidebar({
  role,
  active,
  setActive,
  collapsed,
  setCollapsed,
  onLogout,
}) {
  const items = NAV_ITEMS[role] || [];
  const roleColors = {
    patient: COLORS.primary,
    doctor: COLORS.accentBlue,
    nurse: COLORS.pink,
    admin: COLORS.purple,
  };
  const rc = roleColors[role];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex flex-col border-r flex-shrink-0 overflow-hidden"
      style={{ background: COLORS.navyMid, borderColor: COLORS.navyLight }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 p-4 border-b"
        style={{ borderColor: COLORS.navyLight }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})`,
          }}
        >
          💊
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-lg font-black tracking-tight"
              style={{ color: COLORS.textPrimary }}
            >
              PillMate
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto text-lg opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <Badge color={rc}>
            {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </Badge>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
            style={{
              background: active === item.id ? rc + "22" : "transparent",
              color: active === item.id ? rc : COLORS.textMuted,
              fontWeight: active === item.id ? 600 : 400,
            }}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {active === item.id && (
              <motion.div
                layoutId="nav-indicator"
                className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: rc }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: COLORS.navyLight }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left hover:bg-red-500/10"
          style={{ color: COLORS.danger }}
        >
          <span className="text-lg">🚪</span>
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
