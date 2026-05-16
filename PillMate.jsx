import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
  primary: "#00C6A7",
  primaryDark: "#009E85",
  accent: "#FF6B6B",
  accentBlue: "#4A90D9",
  navy: "#0A1628",
  navyMid: "#0F2040",
  navyLight: "#1A2F52",
  cardDark: "#111E36",
  cardLight: "#FFFFFF",
  textPrimary: "#E8F4F2",
  textMuted: "#8BA8B5",
  success: "#2ECC71",
  warning: "#F39C12",
  danger: "#E74C3C",
  purple: "#8B5CF6",
  pink: "#EC4899",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const ROLES = ["patient", "doctor", "nurse", "admin"];

const MOCK_USERS = {
  patient: { name: "Alex Chen", email: "alex@example.com", role: "patient", avatar: "AC", plan: "Pro" },
  doctor: { name: "Dr. Priya Sharma", email: "dr.priya@pillmate.com", role: "doctor", avatar: "PS", speciality: "Cardiologist" },
  nurse: { name: "Nurse Maria López", email: "maria@pillmate.com", role: "nurse", avatar: "ML", ward: "ICU Ward 3" },
  admin: { name: "Admin Raj Kumar", email: "admin@pillmate.com", role: "admin", avatar: "RK" },
};

const MEDICINES = [
  { id: 1, name: "Metformin 500mg", time: "08:00 AM", taken: true, type: "Tablet", color: "#00C6A7" },
  { id: 2, name: "Lisinopril 10mg", time: "02:00 PM", taken: false, type: "Capsule", color: "#4A90D9" },
  { id: 3, name: "Atorvastatin 20mg", time: "09:00 PM", taken: false, type: "Tablet", color: "#8B5CF6" },
  { id: 4, name: "Vitamin D3 1000IU", time: "08:00 AM", taken: true, type: "Softgel", color: "#F39C12" },
];

const APPOINTMENTS = [
  { id: 1, doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "May 18, 2026", time: "10:30 AM", type: "Video", status: "upcoming" },
  { id: 2, doctor: "Dr. Arjun Mehta", specialty: "Dermatologist", date: "May 22, 2026", time: "03:00 PM", type: "In-person", status: "upcoming" },
  { id: 3, doctor: "Dr. Sarah Kim", specialty: "Endocrinologist", date: "May 12, 2026", time: "11:00 AM", type: "Video", status: "completed" },
];

const PATIENTS = [
  { id: 1, name: "Alex Chen", age: 34, condition: "Type 2 Diabetes", status: "stable", lastVisit: "May 12" },
  { id: 2, name: "Rohan Gupta", age: 56, condition: "Hypertension", status: "critical", lastVisit: "May 15" },
  { id: 3, name: "Sita Patel", age: 42, condition: "Asthma", status: "stable", lastVisit: "May 10" },
  { id: 4, name: "James Wilson", age: 67, condition: "Heart Failure", status: "monitoring", lastVisit: "May 16" },
];

const VITALS_DATA = [
  { patient: "Alex Chen", bp: "118/76", hr: 72, spo2: 98, temp: "98.4°F", status: "normal" },
  { patient: "Rohan Gupta", bp: "158/98", hr: 92, spo2: 94, temp: "100.2°F", status: "critical" },
  { patient: "Sita Patel", bp: "122/80", hr: 78, spo2: 96, temp: "98.6°F", status: "normal" },
];

const ANALYTICS_STATS = [
  { label: "Total Users", value: "24,831", change: "+12.4%", icon: "👥", color: COLORS.primary },
  { label: "Active Doctors", value: "1,247", change: "+5.1%", icon: "🩺", color: COLORS.accentBlue },
  { label: "Monthly Revenue", value: "₹18.4L", change: "+23.7%", icon: "💰", color: COLORS.success },
  { label: "Appointments", value: "8,902", change: "+18.2%", icon: "📅", color: COLORS.purple },
];

const HEALTH_TIPS = [
  "💧 Drink 8 glasses of water today — you've had 5 so far",
  "🚶 You're 2,000 steps away from your daily goal",
  "💊 Lisinopril due in 2 hours — set a reminder?",
  "😴 Your sleep average is 6.2h — aim for 7-8h",
];

const CHART_DATA = [65, 72, 68, 80, 75, 90, 85];
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// ─── MINI CHART ───────────────────────────────────────────────────────────────
function MiniBarChart({ data, color = COLORS.primary, labels }) {
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
          {labels && <span className="text-[9px]" style={{ color: COLORS.textMuted }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── PILL BADGE ───────────────────────────────────────────────────────────────
function Badge({ children, color = COLORS.primary, small }) {
  return (
    <span className={cn("rounded-full font-semibold", small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs")}
      style={{ background: color + "22", color }}>
      {children}
    </span>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ children, className, glow, onClick }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      whileHover={onClick ? { scale: 1.015 } : {}}
      onClick={onClick}
      className={cn("rounded-2xl p-5 border transition-all", className, onClick && "cursor-pointer")}
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

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, i }) {
  return (
    <motion.div variants={fadeUp} custom={i} initial="hidden" animate="visible"
      className="rounded-2xl p-5 border flex flex-col gap-2"
      style={{ background: COLORS.cardDark, borderColor: COLORS.navyLight }}>
      <div className="flex items-center justify-between">
        <div className="text-2xl">{icon}</div>
        {sub && <Badge color={color} small>{sub}</Badge>}
      </div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-sm" style={{ color: COLORS.textMuted }}>{label}</div>
    </motion.div>
  );
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 36, color = COLORS.primary }) {
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, ${color}99)`, fontSize: size * 0.36 }}>
      {initials}
    </div>
  );
}

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────
function Toggle({ on, onToggle, label }) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm" style={{ color: COLORS.textMuted }}>{label}</span>}
      <div onClick={onToggle} className="relative w-11 h-6 rounded-full cursor-pointer transition-all"
        style={{ background: on ? COLORS.primary : COLORS.navyLight }}>
        <motion.div animate={{ x: on ? 22 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow" />
      </div>
    </div>
  );
}

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────
const NAV_ITEMS = {
  patient: [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "medicines", label: "Medicines", icon: "💊" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "health", label: "Health Tracker", icon: "❤️" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "chat", label: "Doctor Chat", icon: "💬" },
    { id: "profile", label: "My Profile", icon: "👤" },
    { id: "ai", label: "AI Assistant", icon: "🤖" },
  ],
  doctor: [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "patients", label: "My Patients", icon: "🧑‍⚕️" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "prescriptions", label: "Prescriptions", icon: "📝" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "chat", label: "Messages", icon: "💬" },
    { id: "profile", label: "Profile", icon: "👤" },
  ],
  nurse: [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "vitals", label: "Vitals Monitor", icon: "📡" },
    { id: "tasks", label: "Tasks", icon: "✅" },
    { id: "logs", label: "Med Logs", icon: "📋" },
    { id: "alerts", label: "Alerts", icon: "🚨" },
    { id: "schedule", label: "Schedule", icon: "🗓️" },
    { id: "profile", label: "Profile", icon: "👤" },
  ],
  admin: [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "doctors", label: "Doctors", icon: "🩺" },
    { id: "revenue", label: "Revenue", icon: "💰" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "logs", label: "System Logs", icon: "🗂️" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ],
};

function Sidebar({ role, active, setActive, collapsed, setCollapsed, onLogout }) {
  const items = NAV_ITEMS[role] || [];
  const roleColors = { patient: COLORS.primary, doctor: COLORS.accentBlue, nurse: COLORS.pink, admin: COLORS.purple };
  const rc = roleColors[role];

  return (
    <motion.aside animate={{ width: collapsed ? 72 : 240 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex flex-col border-r flex-shrink-0 overflow-hidden"
      style={{ background: COLORS.navyMid, borderColor: COLORS.navyLight }}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: COLORS.navyLight }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})` }}>💊</div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="text-lg font-black tracking-tight" style={{ color: COLORS.textPrimary }}>
              PillMate
            </motion.span>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(c => !c)} className="ml-auto text-lg opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <Badge color={rc}>{role.charAt(0).toUpperCase() + role.slice(1)} Portal</Badge>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {items.map(item => (
          <motion.button key={item.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
            onClick={() => setActive(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
            style={{
              background: active === item.id ? rc + "22" : "transparent",
              color: active === item.id ? rc : COLORS.textMuted,
              fontWeight: active === item.id ? 600 : 400,
            }}>
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-sm whitespace-nowrap">{item.label}</motion.span>
              )}
            </AnimatePresence>
            {active === item.id && (
              <motion.div layoutId="nav-indicator" className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: rc }} />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: COLORS.navyLight }}>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left hover:bg-red-500/10"
          style={{ color: COLORS.danger }}>
          <span className="text-lg">🚪</span>
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar({ user, darkMode, setDarkMode, notifications = 3 }) {
  const [showNotif, setShowNotif] = useState(false);
  const roleLabels = { patient: "Patient", doctor: "Doctor", nurse: "Nurse", admin: "Administrator" };
  const roleColors = { patient: COLORS.primary, doctor: COLORS.accentBlue, nurse: COLORS.pink, admin: COLORS.purple };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
      style={{ background: COLORS.navyMid, borderColor: COLORS.navyLight }}>
      <div>
        <h2 className="text-base font-semibold" style={{ color: COLORS.textPrimary }}>
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user.name.split(" ")[0]} 👋
        </h2>
        <p className="text-xs" style={{ color: COLORS.textMuted }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Toggle on={darkMode} onToggle={() => setDarkMode(d => !d)} label={darkMode ? "🌙" : "☀️"} />

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotif(s => !s)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: COLORS.textMuted }}>
            🔔
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                style={{ background: COLORS.accent }}>{notifications}</span>
            )}
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-11 w-72 rounded-2xl border shadow-2xl z-50 p-3"
                style={{ background: COLORS.cardDark, borderColor: COLORS.navyLight }}>
                <div className="text-xs font-semibold mb-2 px-1" style={{ color: COLORS.textMuted }}>NOTIFICATIONS</div>
                {HEALTH_TIPS.slice(0, 3).map((tip, i) => (
                  <div key={i} className="p-2.5 rounded-xl mb-1 text-xs hover:bg-white/5 cursor-pointer"
                    style={{ color: COLORS.textPrimary }}>{tip}</div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: roleColors[user.role] + "15", border: `1px solid ${roleColors[user.role]}33` }}>
          <Avatar initials={user.avatar} size={28} color={roleColors[user.role]} />
          <div className="hidden sm:block">
            <div className="text-xs font-semibold leading-tight" style={{ color: COLORS.textPrimary }}>{user.name.split(" ")[0]}</div>
            <div className="text-[10px]" style={{ color: roleColors[user.role] }}>{roleLabels[user.role]}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PATIENT DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
function PatientDashboard() {
  return (
    <div className="space-y-6">
      {/* Health Tip Banner */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="rounded-2xl p-4 flex items-center gap-4"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.accentBlue}22)`, border: `1px solid ${COLORS.primary}33` }}>
        <div className="text-3xl">🤖</div>
        <div>
          <div className="text-xs font-semibold mb-0.5" style={{ color: COLORS.primary }}>AI HEALTH INSIGHT</div>
          <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
            Your blood sugar is trending well! Keep taking Metformin on schedule. Next HbA1c check recommended in 3 weeks.
          </div>
        </div>
        <button className="ml-auto text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0"
          style={{ background: COLORS.primary, color: "#fff" }}>View Report</button>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "💊", label: "Medicines Today", value: "4", sub: "2 taken", color: COLORS.primary },
          { icon: "📅", label: "Next Appointment", value: "May 18", sub: "In 2 days", color: COLORS.accentBlue },
          { icon: "💧", label: "Water Intake", value: "5/8", sub: "Glasses", color: COLORS.accentBlue },
          { icon: "😴", label: "Avg Sleep", value: "6.4h", sub: "This week", color: COLORS.purple },
        ].map((s, i) => <StatCard key={i} {...s} i={i} />)}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Medicine Schedule */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>Today's Medicines</h3>
            <Badge color={COLORS.primary}>4 scheduled</Badge>
          </div>
          <div className="space-y-3">
            {MEDICINES.map((med, i) => (
              <motion.div key={med.id} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: COLORS.navyLight + "88" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: med.color + "22" }}>💊</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: COLORS.textPrimary }}>{med.name}</div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>{med.time} · {med.type}</div>
                </div>
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all",
                  med.taken ? "opacity-100" : "opacity-60 hover:opacity-100 cursor-pointer")}
                  style={{ background: med.taken ? COLORS.success + "33" : COLORS.navyLight }}>
                  {med.taken ? "✅" : "⏳"}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Weekly Adherence Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>Adherence Rate</h3>
            <Badge color={COLORS.success}>87% avg</Badge>
          </div>
          <MiniBarChart data={CHART_DATA} color={COLORS.primary} labels={WEEK_LABELS} />
          <div className="mt-3 text-xs text-center" style={{ color: COLORS.textMuted }}>
            Medication taken (%) — past 7 days
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>Upcoming Appointments</h3>
            <button className="text-xs font-semibold" style={{ color: COLORS.primary }}>+ Book</button>
          </div>
          <div className="space-y-3">
            {APPOINTMENTS.filter(a => a.status === "upcoming").map((apt, i) => (
              <motion.div key={apt.id} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: COLORS.navyLight + "88" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: COLORS.accentBlue + "22" }}>
                  {apt.type === "Video" ? "📹" : "🏥"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: COLORS.textPrimary }}>{apt.doctor}</div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>{apt.date} · {apt.time}</div>
                </div>
                <Badge color={apt.type === "Video" ? COLORS.primary : COLORS.accentBlue} small>{apt.type}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Health Tracker */}
        <Card>
          <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textPrimary }}>Health Trackers</h3>
          <div className="space-y-4">
            {[
              { label: "Water Intake", value: 5, max: 8, icon: "💧", color: COLORS.accentBlue },
              { label: "Steps", value: 6800, max: 10000, icon: "🚶", color: COLORS.success },
              { label: "Sleep Quality", value: 6.4, max: 8, icon: "😴", color: COLORS.purple },
              { label: "Calories", value: 1640, max: 2000, icon: "🔥", color: COLORS.accent },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: COLORS.textPrimary }}>{t.label}</span>
                    <span style={{ color: t.color }}>{t.value} / {t.max}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: COLORS.navyLight }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: t.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(t.value / t.max) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SOS & Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "SOS Emergency", icon: "🆘", color: COLORS.danger, desc: "Call ambulance" },
          { label: "AI Chatbot", icon: "🤖", color: COLORS.primary, desc: "Ask health questions" },
          { label: "QR Profile", icon: "📱", color: COLORS.accentBlue, desc: "Emergency data" },
          { label: "Upload Report", icon: "📤", color: COLORS.purple, desc: "Lab / X-ray / MRI" },
        ].map((action, i) => (
          <motion.button key={i} variants={fadeUp} custom={i} initial="hidden" animate="visible"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="rounded-2xl p-4 border text-left transition-all"
            style={{ background: action.color + "11", borderColor: action.color + "33" }}>
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-sm font-semibold" style={{ color: action.color }}>{action.label}</div>
            <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>{action.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DOCTOR DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
function DoctorDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "🧑‍⚕️", label: "Active Patients", value: "127", sub: "+3 today", color: COLORS.accentBlue },
          { icon: "📅", label: "Today's Appointments", value: "8", sub: "2 pending", color: COLORS.primary },
          { icon: "📝", label: "Prescriptions Issued", value: "24", sub: "This week", color: COLORS.success },
          { icon: "⭐", label: "Patient Rating", value: "4.9", sub: "312 reviews", color: COLORS.warning },
        ].map((s, i) => <StatCard key={i} {...s} i={i} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Patient List */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>My Patients</h3>
            <button className="text-xs font-semibold" style={{ color: COLORS.accentBlue }}>View All →</button>
          </div>
          <div className="space-y-3">
            {PATIENTS.map((p, i) => {
              const sc = { stable: COLORS.success, critical: COLORS.danger, monitoring: COLORS.warning };
              return (
                <motion.div key={p.id} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
                  style={{ background: COLORS.navyLight + "88" }}>
                  <Avatar initials={p.name[0] + p.name.split(" ")[1]?.[0]} size={36} color={sc[p.status]} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: COLORS.textPrimary }}>{p.name}</div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>{p.condition} · Age {p.age}</div>
                  </div>
                  <Badge color={sc[p.status]} small>{p.status}</Badge>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textPrimary }}>Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: "09:00", patient: "Alex Chen", type: "Follow-up", mode: "Video" },
              { time: "10:30", patient: "Rohan Gupta", type: "Consultation", mode: "In-person" },
              { time: "12:00", patient: "Sita Patel", type: "Review", mode: "Video" },
              { time: "15:00", patient: "James Wilson", type: "Emergency", mode: "In-person" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                className="flex items-center gap-3">
                <div className="text-xs font-bold w-12 flex-shrink-0" style={{ color: COLORS.accentBlue }}>{s.time}</div>
                <div className="flex-1 min-w-0 p-2.5 rounded-xl" style={{ background: COLORS.navyLight + "88" }}>
                  <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{s.patient}</div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>{s.type}</div>
                </div>
                <Badge color={s.mode === "Video" ? COLORS.primary : COLORS.accentBlue} small>{s.mode}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* AI Prescription Helper */}
        <Card glow>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>AI Prescription Assistant</h3>
            <Badge color={COLORS.primary} small>AI</Badge>
          </div>
          <div className="text-sm mb-3" style={{ color: COLORS.textMuted }}>
            Enter symptoms and patient history — AI suggests evidence-based prescriptions.
          </div>
          <div className="p-3 rounded-xl mb-3 text-sm" style={{ background: COLORS.navyLight, color: COLORS.textPrimary }}>
            <span style={{ color: COLORS.primary }}>Patient: </span>Rohan Gupta, 56M, Hypertension<br />
            <span style={{ color: COLORS.primary }}>Suggestion: </span>Amlodipine 5mg OD + lifestyle modification
          </div>
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})`, color: "#fff" }}>
            Generate Prescription →
          </button>
        </Card>

        {/* Analytics */}
        <Card>
          <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textPrimary }}>Weekly Patient Flow</h3>
          <MiniBarChart data={[12, 18, 14, 22, 19, 8, 4]} color={COLORS.accentBlue} labels={WEEK_LABELS} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Avg. Consultation", value: "18 min", icon: "⏱️" },
              { label: "Prescription Rate", value: "94%", icon: "📝" },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: COLORS.navyLight + "88" }}>
                <div className="text-lg mb-1">{m.icon}</div>
                <div className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{m.value}</div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>{m.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// NURSE DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
function NurseDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "🏥", label: "Patients Under Care", value: "18", sub: "ICU Ward 3", color: COLORS.pink },
          { icon: "🚨", label: "Critical Alerts", value: "2", sub: "Immediate action", color: COLORS.danger },
          { icon: "✅", label: "Tasks Completed", value: "14/20", sub: "Today", color: COLORS.success },
          { icon: "💉", label: "Meds Administered", value: "47", sub: "Doses today", color: COLORS.warning },
        ].map((s, i) => <StatCard key={i} {...s} i={i} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Vitals Monitor */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>Live Vitals</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: COLORS.success }} />
              <span className="text-xs" style={{ color: COLORS.textMuted }}>Live</span>
            </div>
          </div>
          <div className="space-y-3">
            {VITALS_DATA.map((v, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                className="p-3 rounded-xl" style={{ background: COLORS.navyLight + "88" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{v.patient}</div>
                  <Badge color={v.status === "critical" ? COLORS.danger : COLORS.success} small>{v.status}</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { l: "BP", val: v.bp },
                    { l: "HR", val: `${v.hr}bpm` },
                    { l: "SpO₂", val: `${v.spo2}%` },
                    { l: "Temp", val: v.temp },
                  ].map((m, j) => (
                    <div key={j} className="text-center">
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>{m.l}</div>
                      <div className="text-xs font-bold" style={{ color: v.status === "critical" && j < 2 ? COLORS.danger : COLORS.textPrimary }}>{m.val}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Task List */}
        <Card>
          <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textPrimary }}>Today's Tasks</h3>
          <div className="space-y-2">
            {[
              { task: "Administer Insulin — Alex Chen", time: "08:00", done: true, priority: "high" },
              { task: "Change IV drip — Rohan Gupta", time: "09:00", done: true, priority: "critical" },
              { task: "Vitals check — Ward 3", time: "10:00", done: false, priority: "normal" },
              { task: "Wound dressing — James Wilson", time: "11:00", done: false, priority: "high" },
              { task: "Blood draw — Sita Patel", time: "13:00", done: false, priority: "normal" },
            ].map((t, i) => {
              const pc = { critical: COLORS.danger, high: COLORS.warning, normal: COLORS.primary };
              return (
                <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{ background: COLORS.navyLight + "88", opacity: t.done ? 0.6 : 1 }}>
                  <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: t.done ? COLORS.success : pc[t.priority], background: t.done ? COLORS.success + "33" : "transparent" }}>
                    {t.done && <span className="text-[10px]">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: COLORS.textPrimary, textDecoration: t.done ? "line-through" : "none" }}>
                      {t.task}
                    </div>
                  </div>
                  <div className="text-xs flex-shrink-0" style={{ color: COLORS.textMuted }}>{t.time}</div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ANALYTICS_STATS.map((s, i) => <StatCard key={i} icon={s.icon} label={s.label} value={s.value} sub={s.change} color={s.color} i={i} />)}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>Monthly Revenue (₹ Lakhs)</h3>
            <Badge color={COLORS.success}>+23.7%</Badge>
          </div>
          <MiniBarChart data={[8.2, 10.4, 9.1, 13.7, 11.8, 15.2, 18.4]} color={COLORS.success}
            labels={["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"]} />
        </Card>

        {/* Subscription Split */}
        <Card>
          <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textPrimary }}>Plan Distribution</h3>
          <div className="space-y-3">
            {[
              { plan: "Free", pct: 42, color: COLORS.textMuted, count: "10.4K" },
              { plan: "Pro", pct: 38, color: COLORS.primary, count: "9.4K" },
              { plan: "Family", pct: 14, color: COLORS.accentBlue, count: "3.5K" },
              { plan: "Enterprise", pct: 6, color: COLORS.purple, count: "1.5K" },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: p.color }}>{p.plan}</span>
                  <span style={{ color: COLORS.textMuted }}>{p.count} ({p.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: COLORS.navyLight }}>
                  <motion.div className="h-full rounded-full" style={{ background: p.color }}
                    initial={{ width: 0 }} animate={{ width: `${p.pct}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity & Top Doctors */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textPrimary }}>System Activity</h3>
          <div className="space-y-2">
            {[
              { event: "New doctor registered: Dr. Arjun Mehta", time: "2m ago", icon: "🩺", color: COLORS.accentBlue },
              { event: "Payment received: ₹599 Pro plan", time: "8m ago", icon: "💰", color: COLORS.success },
              { event: "SOS alert triggered by patient #1042", time: "15m ago", icon: "🆘", color: COLORS.danger },
              { event: "Prescription uploaded via OCR", time: "32m ago", icon: "📄", color: COLORS.primary },
              { event: "New review: 5★ for Dr. Priya Sharma", time: "1h ago", icon: "⭐", color: COLORS.warning },
            ].map((a, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: COLORS.navyLight + "88" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: a.color + "22" }}>{a.icon}</div>
                <div className="flex-1 text-xs" style={{ color: COLORS.textPrimary }}>{a.event}</div>
                <div className="text-xs flex-shrink-0" style={{ color: COLORS.textMuted }}>{a.time}</div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textPrimary }}>Top Performing Doctors</h3>
          <div className="space-y-3">
            {[
              { name: "Dr. Priya Sharma", spec: "Cardiologist", patients: 312, rating: 4.9 },
              { name: "Dr. Arjun Mehta", spec: "Dermatologist", patients: 278, rating: 4.8 },
              { name: "Dr. Sarah Kim", spec: "Endocrinologist", patients: 241, rating: 4.9 },
              { name: "Dr. Vikram Rao", spec: "Neurologist", patients: 196, rating: 4.7 },
            ].map((d, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: i === 0 ? COLORS.warning : COLORS.navyLight, color: i === 0 ? "#000" : COLORS.textMuted }}>
                  {i + 1}
                </div>
                <Avatar initials={d.name.split(" ")[1][0] + (d.name.split(" ")[2]?.[0] || "")} size={32} color={COLORS.accentBlue} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: COLORS.textPrimary }}>{d.name}</div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>{d.spec}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color: COLORS.warning }}>⭐ {d.rating}</div>
                  <div className="text-[10px]" style={{ color: COLORS.textMuted }}>{d.patients} pts</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// AI CHAT PANEL
// ════════════════════════════════════════════════════════════════════════════
function AIChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm PillMate AI 🤖 — your personal health assistant. Ask me about your medicines, symptoms, appointments, or health tips!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const QUICK = ["What's my next dose?", "Symptom checker", "Drug interactions", "Find a doctor"];

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are PillMate AI, a friendly, concise health assistant. Help with medicine reminders, symptoms, and general health questions. Keep responses under 80 words. Never diagnose — always recommend consulting a doctor for serious concerns.",
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await resp.json();
      const aiText = data.content?.[0]?.text || "I'm having trouble right now. Please try again!";
      setMessages(m => [...m, { role: "ai", text: aiText }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Connection error. Please check your network and try again." }]);
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="flex flex-col h-full rounded-2xl border overflow-hidden"
      style={{ background: COLORS.cardDark, borderColor: COLORS.navyLight }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: COLORS.navyLight }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
          style={{ background: COLORS.primary + "22" }}>🤖</div>
        <div>
          <div className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>PillMate AI</div>
          <div className="text-xs" style={{ color: COLORS.primary }}>● Online</div>
        </div>
        {onClose && <button onClick={onClose} className="ml-auto text-lg" style={{ color: COLORS.textMuted }}>✕</button>}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm"
              style={{
                background: m.role === "user" ? COLORS.primary : COLORS.navyLight,
                color: COLORS.textPrimary,
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl" style={{ background: COLORS.navyLight }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: COLORS.primary }}
                    animate={{ y: [0, -6, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => sendMessage(q)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all hover:border-primary"
            style={{ borderColor: COLORS.navyLight, color: COLORS.textMuted, background: COLORS.navyMid }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2" style={{ borderColor: COLORS.navyLight }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about your health..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: COLORS.navyLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.navyLight}` }} />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
          style={{ background: COLORS.primary, color: "#fff" }}>→</button>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ════════════════════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState("patient");
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleConfig = {
    patient: { label: "Patient", icon: "🧑", color: COLORS.primary, desc: "Manage your health journey" },
    doctor: { label: "Doctor", icon: "👨‍⚕️", color: COLORS.accentBlue, desc: "Manage patients & prescriptions" },
    nurse: { label: "Nurse", icon: "👩‍⚕️", color: COLORS.pink, desc: "Monitor & care for patients" },
    admin: { label: "Admin", icon: "🛡️", color: COLORS.purple, desc: "Manage the entire platform" },
  };
  const rc = roleConfig[selectedRole];

  const handleSubmit = () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onLogin({ ...MOCK_USERS[selectedRole] });
    }, 1400);
  };

  const handleOTP = () => {
    if (!email) { setError("Enter your email first"); return; }
    setOtpSent(true);
    setError("");
  };

  return (
    <div className="min-h-screen flex" style={{ background: COLORS.navy }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12"
        style={{ background: `linear-gradient(135deg, ${COLORS.navyMid}, ${COLORS.navyLight})` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})` }}>💊</div>
          <span className="text-2xl font-black tracking-tight" style={{ color: COLORS.textPrimary }}>PillMate</span>
        </div>

        <div className="space-y-6">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-5xl font-black leading-tight" style={{ color: COLORS.textPrimary }}>
            Your Complete<br />
            <span style={{ color: COLORS.primary }}>Healthcare</span><br />
            Companion
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-lg" style={{ color: COLORS.textMuted }}>
            AI-powered medicine reminders, doctor consultations, health tracking & more — all in one place.
          </motion.p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "💊", label: "Smart Reminders" },
              { icon: "🤖", label: "AI Health Chat" },
              { icon: "📹", label: "Video Consults" },
              { icon: "📊", label: "Health Analytics" },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: COLORS.navy + "88", border: `1px solid ${COLORS.navyLight}` }}>
                <span className="text-2xl">{f.icon}</span>
                <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 text-sm" style={{ color: COLORS.textMuted }}>
          <span>Trusted by</span>
          <span className="font-bold" style={{ color: COLORS.primary }}>50,000+</span>
          <span>healthcare professionals & patients</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})` }}>💊</div>
            <span className="text-xl font-black" style={{ color: COLORS.textPrimary }}>PillMate</span>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-1" style={{ color: COLORS.textPrimary }}>
              {mode === "login" ? "Welcome back" : mode === "register" ? "Create account" : "Reset password"}
            </h2>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              {mode === "login" ? "Sign in to continue to your dashboard" : "Join PillMate today — it's free"}
            </p>
          </div>

          {/* Role Selector */}
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: COLORS.textMuted }}>SELECT YOUR ROLE</div>
            <div className="grid grid-cols-4 gap-2">
              {ROLES.map(r => (
                <motion.button key={r} whileTap={{ scale: 0.96 }} onClick={() => setSelectedRole(r)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all"
                  style={{
                    background: selectedRole === r ? roleConfig[r].color + "22" : COLORS.navyMid,
                    borderColor: selectedRole === r ? roleConfig[r].color : COLORS.navyLight,
                  }}>
                  <span className="text-xl">{roleConfig[r].icon}</span>
                  <span className="text-[10px] font-semibold"
                    style={{ color: selectedRole === r ? roleConfig[r].color : COLORS.textMuted }}>
                    {roleConfig[r].label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {error && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: COLORS.danger + "22", color: COLORS.danger }}>
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: COLORS.textMuted }}>EMAIL</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: COLORS.navyMid, color: COLORS.textPrimary, border: `1px solid ${COLORS.navyLight}` }} />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: COLORS.textMuted }}>PASSWORD</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: COLORS.navyMid, color: COLORS.textPrimary, border: `1px solid ${COLORS.navyLight}` }} />
              </div>
            )}

            {/* OTP Section */}
            {mode === "login" && (
              <div className="flex items-center gap-2">
                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP (optional)"
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: COLORS.navyMid, color: COLORS.textPrimary, border: `1px solid ${COLORS.navyLight}` }} />
                <button onClick={handleOTP}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
                  style={{ background: otpSent ? COLORS.success + "22" : COLORS.primary + "22", color: otpSent ? COLORS.success : COLORS.primary }}>
                  {otpSent ? "✓ Sent" : "Send OTP"}
                </button>
              </div>
            )}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={mode === "forgot" ? handleOTP : handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${rc.color}, ${rc.color}bb)`, color: "#fff" }}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }} />
                  Authenticating...
                </div>
              ) : mode === "login" ? `Sign in as ${rc.label}` : mode === "register" ? "Create Account" : "Send Reset Link"}
            </motion.button>

            {/* Google SSO */}
            <button className="w-full py-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all hover:bg-white/5"
              style={{ borderColor: COLORS.navyLight, color: COLORS.textMuted }}>
              <span>🔵</span> Continue with Google
            </button>
          </div>

          {/* Mode toggles */}
          <div className="flex items-center justify-between text-xs" style={{ color: COLORS.textMuted }}>
            <button onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="hover:underline" style={{ color: rc.color }}>
              {mode === "login" ? "Create new account" : "Already have an account?"}
            </button>
            {mode === "login" && (
              <button onClick={() => setMode("forgot")} className="hover:underline">Forgot password?</button>
            )}
          </div>

          {/* Demo hint */}
          <div className="text-center text-xs px-4 py-3 rounded-xl" style={{ background: COLORS.primary + "11", color: COLORS.textMuted }}>
            💡 <span style={{ color: COLORS.primary }}>Demo mode:</span> Any email/password works — role is auto-selected
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ════════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const FEATURES = [
    { icon: "💊", title: "Smart Pill Reminders", desc: "AI-powered reminders via push, WhatsApp & voice — never miss a dose" },
    { icon: "🤖", title: "AI Health Assistant", desc: "24/7 symptom checker, drug interaction alerts, and personalized health insights" },
    { icon: "📹", title: "Video Consultations", desc: "Instant HD video calls with verified doctors — no waiting rooms" },
    { icon: "📱", title: "OCR Prescription Scan", desc: "Photograph your prescription and AI extracts & schedules your medicines" },
    { icon: "❤️", title: "Wearable Sync", desc: "Connect Google Fit, Apple Health, and smartwatches for holistic tracking" },
    { icon: "🆘", title: "SOS Emergency", desc: "One-tap emergency alert sends your location & medical profile to contacts" },
  ];

  const PLANS = [
    { name: "Free", price: "₹0", period: "forever", color: COLORS.textMuted, features: ["5 medicine reminders", "Basic health tracker", "AI chatbot (10/day)", "1 family member"] },
    { name: "Pro", price: "₹299", period: "/month", color: COLORS.primary, popular: true, features: ["Unlimited reminders", "Video consultations", "OCR prescription scan", "Wearable sync", "Priority support", "5 family members"] },
    { name: "Family", price: "₹599", period: "/month", color: COLORS.accentBlue, features: ["Everything in Pro", "10 family members", "Shared health dashboard", "Family emergency alerts", "Dedicated nurse support"] },
  ];

  const TESTIMONIALS = [
    { name: "Anita Sharma", role: "Type 2 Diabetic Patient", quote: "PillMate's AI reminders changed my life. My HbA1c dropped from 9.2 to 6.8 in 4 months!", avatar: "AS", stars: 5 },
    { name: "Dr. Rahul Mehta", role: "Senior Cardiologist, Apollo", quote: "The prescription AI is remarkably accurate. My workflow is 40% faster with PillMate.", avatar: "RM", stars: 5 },
    { name: "Sunita Patel", role: "Caregiver, Managing 3 family members", quote: "I manage my parents' and husband's medicines all from one app. Absolute lifesaver.", avatar: "SP", stars: 5 },
  ];

  const FAQS = [
    { q: "Is my health data secure?", a: "Yes. We use end-to-end AES-256 encryption, comply with HIPAA & DPDP Act, and never sell your data." },
    { q: "Can I use it offline?", a: "PillMate is a PWA — medicine reminders and core features work offline. Syncs when back online." },
    { q: "How does the AI prescription scan work?", a: "Our OCR engine reads handwritten or printed prescriptions, auto-identifies medicines, dosages, and creates a schedule." },
    { q: "Do doctors on PillMate get verified?", a: "All doctors are verified with MCI registration, credentials checked by our medical team before onboarding." },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: COLORS.navy, color: COLORS.textPrimary }}>
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-50 backdrop-blur-md"
        style={{ borderColor: COLORS.navyLight, background: COLORS.navy + "ee" }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-black"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})` }}>💊</div>
          <span className="text-xl font-black tracking-tight">PillMate</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: COLORS.textMuted }}>
          {["Features", "Pricing", "Testimonials", "FAQ", "Blog"].map(item => (
            <button key={item} className="hover:text-white transition-colors">{item}</button>
          ))}
        </div>
        <button onClick={onGetStarted}
          className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})`, color: "#fff" }}>
          Get Started Free →
        </button>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
            style={{ background: COLORS.primary }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold"
            style={{ background: COLORS.primary + "22", color: COLORS.primary, border: `1px solid ${COLORS.primary}44` }}>
            🚀 Now with GPT-4o powered AI Health Assistant
          </div>
          <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-6">
            Never Miss A<br />
            <span style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Dose. Ever.
            </span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: COLORS.textMuted }}>
            AI-powered medicine reminders, instant doctor consultations, health tracking, and emergency SOS — your complete healthcare companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onGetStarted}
              className="px-8 py-4 rounded-2xl text-base font-bold shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})`, color: "#fff",
                boxShadow: `0 20px 60px ${COLORS.primary}40` }}>
              Start Free — No credit card 🚀
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl text-base font-semibold border"
              style={{ borderColor: COLORS.navyLight, color: COLORS.textMuted }}>
              📹 Watch Demo
            </motion.button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm" style={{ color: COLORS.textMuted }}>
            {["50K+ Users", "1,200+ Doctors", "4.9★ Rating", "HIPAA Compliant"].map((t, i) => (
              <span key={i} className="flex items-center gap-1"><span style={{ color: COLORS.primary }}>✓</span>{t}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Everything you need to<br /><span style={{ color: COLORS.primary }}>manage your health</span></h2>
            <p className="text-base" style={{ color: COLORS.textMuted }}>One app — patients, doctors, nurses, and admins, all connected.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="p-5 rounded-2xl border hover:border-primary/40 transition-all cursor-pointer group"
                style={{ background: COLORS.navyMid, borderColor: COLORS.navyLight }}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold mb-1.5" style={{ color: COLORS.textPrimary }}>{f.title}</h3>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-16" style={{ background: COLORS.navyMid + "88" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Simple, transparent <span style={{ color: COLORS.primary }}>pricing</span></h2>
            <p style={{ color: COLORS.textMuted }}>Choose the plan that fits your health journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="rounded-2xl p-6 border relative overflow-hidden"
                style={{
                  background: plan.popular ? `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.accentBlue}22)` : COLORS.cardDark,
                  borderColor: plan.popular ? COLORS.primary : COLORS.navyLight,
                  boxShadow: plan.popular ? `0 0 40px ${COLORS.primary}22` : "none",
                }}>
                {plan.popular && (
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{ background: COLORS.primary, color: "#fff" }}>POPULAR</div>
                )}
                <div className="text-sm font-semibold mb-1" style={{ color: plan.color }}>{plan.name}</div>
                <div className="mb-4">
                  <span className="text-4xl font-black" style={{ color: COLORS.textPrimary }}>{plan.price}</span>
                  <span className="text-sm ml-1" style={{ color: COLORS.textMuted }}>{plan.period}</span>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <span style={{ color: plan.color }}>✓</span>
                      <span style={{ color: COLORS.textPrimary }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={onGetStarted}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: plan.popular ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})` : COLORS.navyLight,
                    color: plan.popular ? "#fff" : COLORS.textPrimary
                  }}>
                  Get {plan.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Loved by <span style={{ color: COLORS.primary }}>50,000+</span> users</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="p-5 rounded-2xl border" style={{ background: COLORS.navyMid, borderColor: COLORS.navyLight }}>
                <div className="flex gap-0.5 mb-3">
                  {Array(t.stars).fill("⭐").map((s, j) => <span key={j} className="text-sm">{s}</span>)}
                </div>
                <p className="text-sm mb-4 italic" style={{ color: COLORS.textPrimary }}>"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <Avatar initials={t.avatar} size={32} color={COLORS.primary} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{t.name}</div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16" style={{ background: COLORS.navyMid + "88" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-10">Frequently Asked <span style={{ color: COLORS.primary }}>Questions</span></h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.navyLight }}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                  style={{ background: COLORS.cardDark, color: COLORS.textPrimary }}>
                  <span className="text-sm font-semibold">{faq.q}</span>
                  <span className="text-lg ml-3 flex-shrink-0" style={{ color: COLORS.primary }}>
                    {activeFaq === i ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 text-sm" style={{ background: COLORS.cardDark, color: COLORS.textMuted }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto p-10 rounded-3xl"
          style={{ background: `linear-gradient(135deg, ${COLORS.navyMid}, ${COLORS.navyLight})`, border: `1px solid ${COLORS.primary}44` }}>
          <div className="text-5xl mb-4">💊</div>
          <h2 className="text-3xl font-black mb-3" style={{ color: COLORS.textPrimary }}>
            Start your health journey today
          </h2>
          <p className="mb-6" style={{ color: COLORS.textMuted }}>Join 50,000+ users taking control of their health with PillMate.</p>
          <button onClick={onGetStarted}
            className="px-10 py-4 rounded-2xl text-base font-bold"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentBlue})`, color: "#fff" }}>
            Get Started Free →
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t text-center text-sm" style={{ borderColor: COLORS.navyLight, color: COLORS.textMuted }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">💊</span>
          <span className="font-black text-base" style={{ color: COLORS.textPrimary }}>PillMate</span>
        </div>
        <p className="mb-3">© 2026 PillMate Health Technologies Pvt. Ltd. · HIPAA Compliant · DPDP Act Compliant</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us", "Blog", "Careers"].map(link => (
            <button key={link} className="hover:text-white transition-colors">{link}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
export default function PillMate() {
  const [page, setPage] = useState("landing"); // landing | login | app
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAI, setShowAI] = useState(false);

  const handleLogin = (u) => { setUser(u); setPage("app"); setActiveNav("dashboard"); };
  const handleLogout = () => { setUser(null); setPage("landing"); setActiveNav("dashboard"); };

  const renderDashboard = () => {
    if (activeNav === "ai" || showAI) return <AIChatPanel onClose={() => { setShowAI(false); setActiveNav("dashboard"); }} />;
    switch (user?.role) {
      case "doctor": return <DoctorDashboard />;
      case "nurse": return <NurseDashboard />;
      case "admin": return <AdminDashboard />;
      default: return <PatientDashboard />;
    }
  };

  const getPageTitle = () => {
    const nav = NAV_ITEMS[user?.role]?.find(n => n.id === activeNav);
    return nav ? `${nav.icon} ${nav.label}` : "Dashboard";
  };

  if (page === "landing") {
    return <LandingPage onGetStarted={() => setPage("login")} />;
  }

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: COLORS.navy, fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>
      {/* Load Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1A2F52; border-radius: 4px; }
        input::placeholder { color: #8BA8B5 !important; }
      `}</style>

      {/* Sidebar */}
      <Sidebar role={user?.role} active={activeNav} setActive={(id) => { setActiveNav(id); setShowAI(false); }}
        collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} onLogout={handleLogout} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={user} darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 max-w-6xl mx-auto">
            {/* Page Title */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-black" style={{ color: COLORS.textPrimary }}>{getPageTitle()}</h1>
                <p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>
                  {user?.role === "patient" ? `${user.plan} Plan` : user?.speciality || user?.ward || "PillMate Admin"}
                </p>
              </div>
              {user?.role === "patient" && activeNav !== "ai" && !showAI && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAI(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: COLORS.primary + "22", color: COLORS.primary, border: `1px solid ${COLORS.primary}44` }}>
                  🤖 Ask AI
                </motion.button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeNav + showAI}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}>
                {showAI || activeNav === "ai"
                  ? <div className="h-[calc(100vh-200px)]"><AIChatPanel onClose={() => { setShowAI(false); setActiveNav("dashboard"); }} /></div>
                  : renderDashboard()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
