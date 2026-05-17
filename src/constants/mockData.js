import { COLORS } from './colors';

export const ROLES = ["patient", "doctor", "nurse", "admin"];

export const MOCK_USERS = {
  patient: { name: "Alex Chen", email: "alex@example.com", role: "patient", avatar: "AC", plan: "Pro" },
  doctor: { name: "Dr. Priya Sharma", email: "dr.priya@pillmate.com", role: "doctor", avatar: "PS", speciality: "Cardiologist" },
  nurse: { name: "Nurse Maria López", email: "maria@pillmate.com", role: "nurse", avatar: "ML", ward: "ICU Ward 3" },
  admin: { name: "Admin Raj Kumar", email: "admin@pillmate.com", role: "admin", avatar: "RK" },
};

export const MEDICINES = [
  { id: 1, name: "Metformin 500mg", time: "08:00 AM", taken: true, type: "Tablet", color: "#00C6A7" },
  { id: 2, name: "Lisinopril 10mg", time: "02:00 PM", taken: false, type: "Capsule", color: "#4A90D9" },
  { id: 3, name: "Atorvastatin 20mg", time: "09:00 PM", taken: false, type: "Tablet", color: "#8B5CF6" },
  { id: 4, name: "Vitamin D3 1000IU", time: "08:00 AM", taken: true, type: "Softgel", color: "#F39C12" },
];

export const APPOINTMENTS = [
  { id: 1, doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "May 18, 2026", time: "10:30 AM", type: "Video", status: "upcoming" },
  { id: 2, doctor: "Dr. Arjun Mehta", specialty: "Dermatologist", date: "May 22, 2026", time: "03:00 PM", type: "In-person", status: "upcoming" },
  { id: 3, doctor: "Dr. Sarah Kim", specialty: "Endocrinologist", date: "May 12, 2026", time: "11:00 AM", type: "Video", status: "completed" },
];

export const PATIENTS = [
  { id: 1, name: "Alex Chen", age: 34, condition: "Type 2 Diabetes", status: "stable", lastVisit: "May 12" },
  { id: 2, name: "Rohan Gupta", age: 56, condition: "Hypertension", status: "critical", lastVisit: "May 15" },
  { id: 3, name: "Sita Patel", age: 42, condition: "Asthma", status: "stable", lastVisit: "May 10" },
  { id: 4, name: "James Wilson", age: 67, condition: "Heart Failure", status: "monitoring", lastVisit: "May 16" },
];

export const VITALS_DATA = [
  { patient: "Alex Chen", bp: "118/76", hr: 72, spo2: 98, temp: "98.4°F", status: "normal" },
  { patient: "Rohan Gupta", bp: "158/98", hr: 92, spo2: 94, temp: "100.2°F", status: "critical" },
  { patient: "Sita Patel", bp: "122/80", hr: 78, spo2: 96, temp: "98.6°F", status: "normal" },
];

export const ANALYTICS_STATS = [
  { label: "Total Users", value: "24,831", change: "+12.4%", icon: "👥", color: COLORS.primary },
  { label: "Active Doctors", value: "1,247", change: "+5.1%", icon: "🩺", color: COLORS.accentBlue },
  { label: "Monthly Revenue", value: "₹18.4L", change: "+23.7%", icon: "💰", color: COLORS.success },
  { label: "Appointments", value: "8,902", change: "+18.2%", icon: "📅", color: COLORS.purple },
];

export const HEALTH_TIPS = [
  "💧 Drink 8 glasses of water today — you've had 5 so far",
  "🚶 You're 2,000 steps away from your daily goal",
  "💊 Lisinopril due in 2 hours — set a reminder?",
  "😴 Your sleep average is 6.2h — aim for 7-8h",
];

export const CHART_DATA = [65, 72, 68, 80, 75, 90, 85];
export const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
