import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "../../constants/colors";
import { HEALTH_TIPS } from "../../constants/mockData";
import Toggle from "../ui/Toggle";
import Avatar from "../ui/Avatar";

export default function Topbar({
  user,
  darkMode,
  setDarkMode,
  notifications = 3,
}) {
  const [showNotif, setShowNotif] = useState(false);
  const roleLabels = {
    patient: "Patient",
    doctor: "Doctor",
    nurse: "Nurse",
    admin: "Administrator",
  };
  const roleColors = {
    patient: COLORS.primary,
    doctor: COLORS.accentBlue,
    nurse: COLORS.pink,
    admin: COLORS.purple,
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
      style={{ background: COLORS.navyMid, borderColor: COLORS.navyLight }}
    >
      <div>
        <h2
          className="text-base font-semibold"
          style={{ color: COLORS.textPrimary }}
        >
          Good{" "}
          {new Date().getHours() < 12
            ? "Morning"
            : new Date().getHours() < 17
              ? "Afternoon"
              : "Evening"}
          , {user.name.split(" ")[0]} 👋
        </h2>
        <p className="text-xs" style={{ color: COLORS.textMuted }}>
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Toggle on={darkMode} onToggle={() => setDarkMode((d) => !d)} label={darkMode ? "🌙" : "☀️"} />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif((s) => !s)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: COLORS.textMuted }}
          >
            🔔
            {notifications > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                style={{ background: COLORS.accent }}
              >
                {notifications}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-11 w-72 rounded-2xl border shadow-2xl z-50 p-3"
                style={{ background: COLORS.cardDark, borderColor: COLORS.navyLight }}
              >
                <div
                  className="text-xs font-semibold mb-2 px-1"
                  style={{ color: COLORS.textMuted }}
                >
                  NOTIFICATIONS
                </div>
                {HEALTH_TIPS.slice(0, 3).map((tip, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl mb-1 text-xs hover:bg-white/5 cursor-pointer"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {tip}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User chip */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{
            background: roleColors[user.role] + "15",
            border: `1px solid ${roleColors[user.role]}33`,
          }}
        >
          <Avatar
            initials={user.avatar}
            size={28}
            color={roleColors[user.role]}
          />
          <div className="hidden sm:block">
            <div
              className="text-xs font-semibold leading-tight"
              style={{ color: COLORS.textPrimary }}
            >
              {user.name.split(" ")[0]}
            </div>
            <div
              className="text-[10px]"
              style={{ color: roleColors[user.role] }}
            >
              {roleLabels[user.role]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
