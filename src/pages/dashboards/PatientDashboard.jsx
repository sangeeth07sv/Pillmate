import { motion } from "framer-motion";
import { COLORS } from "../../constants/colors";
import { MEDICINES, APPOINTMENTS, CHART_DATA, WEEK_LABELS } from "../../constants/mockData";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import StatCard from "../ui/StatCard";
import MiniBarChart from "../ui/MiniBarChart";
import { fadeUp, cn } from "../../utils/helpers";

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      {/* Health Tip Banner */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl p-4 flex items-center gap-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.accentBlue}22)`,
          border: `1px solid ${COLORS.primary}33`,
        }}
      >
        <div className="text-3xl">🤖</div>
        <div>
          <div className="text-xs font-semibold mb-0.5" style={{ color: COLORS.primary }}>
            AI HEALTH INSIGHT
          </div>
          <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
            Your blood sugar is trending well! Keep taking Metformin on schedule. Next HbA1c check
            recommended in 3 weeks.
          </div>
        </div>
        <button
          className="ml-auto text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0"
          style={{ background: COLORS.primary, color: "#fff" }}
        >
          View Report
        </button>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: "💊",
            label: "Medicines Today",
            value: "4",
            sub: "2 taken",
            color: COLORS.primary,
          },
          {
            icon: "📅",
            label: "Next Appointment",
            value: "May 18",
            sub: "In 2 days",
            color: COLORS.accentBlue,
          },
          {
            icon: "💧",
            label: "Water Intake",
            value: "5/8",
            sub: "Glasses",
            color: COLORS.accentBlue,
          },
          { icon: "😴", label: "Avg Sleep", value: "6.4h", sub: "This week", color: COLORS.purple },
        ].map((s, i) => (
          <StatCard key={i} {...s} i={i} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Medicine Schedule */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>
              Today's Medicines
            </h3>
            <Badge color={COLORS.primary}>4 scheduled</Badge>
          </div>
          <div className="space-y-3">
            {MEDICINES.map((med, i) => (
              <motion.div
                key={med.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: COLORS.navyLight + "88" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: med.color + "22" }}
                >
                  💊
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: COLORS.textPrimary }}>
                    {med.name}
                  </div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>
                    {med.time} · {med.type}
                  </div>
                </div>
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all",
                    med.taken ? "opacity-100" : "opacity-60 hover:opacity-100 cursor-pointer"
                  )}
                  style={{ background: med.taken ? COLORS.success + "33" : COLORS.navyLight }}
                >
                  {med.taken ? "✅" : "⏳"}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Weekly Adherence Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>
              Adherence Rate
            </h3>
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
            <h3 className="font-bold text-base" style={{ color: COLORS.textPrimary }}>
              Upcoming Appointments
            </h3>
            <button className="text-xs font-semibold" style={{ color: COLORS.primary }}>
              + Book
            </button>
          </div>
          <div className="space-y-3">
            {APPOINTMENTS.filter((a) => a.status === "upcoming").map((apt, i) => (
              <motion.div
                key={apt.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: COLORS.navyLight + "88" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: COLORS.accentBlue + "22" }}
                >
                  {apt.type === "Video" ? "📹" : "🏥"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: COLORS.textPrimary }}>
                    {apt.doctor}
                  </div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>
                    {apt.date} · {apt.time}
                  </div>
                </div>
                <Badge
                  color={apt.type === "Video" ? COLORS.primary : COLORS.accentBlue}
                  small
                >
                  {apt.type}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Health Tracker */}
        <Card>
          <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textPrimary }}>
            Health Trackers
          </h3>
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
                    <span style={{ color: t.color }}>
                      {t.value} / {t.max}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: COLORS.navyLight }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: t.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(t.value / t.max) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                    />
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
          <motion.button
            key={i}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-2xl p-4 border text-left transition-all"
            style={{ background: action.color + "11", borderColor: action.color + "33" }}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-sm font-semibold" style={{ color: action.color }}>
              {action.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>
              {action.desc}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
