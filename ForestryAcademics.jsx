// "use client";

// import { useState, createContext, useContext, useEffect, useRef, useCallback } from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
// import { Users, BookOpen, GraduationCap, DollarSign, Menu, X, LogOut, Home, Calendar, FileText, Search, Moon, Sun, CheckCircle, XCircle, Download, Edit, Plus, AlertCircle, Phone, MapPin, User, Wallet, ChevronRight, Printer, UserCheck, Award, ClipboardList, Eye, Trash2, TrendingUp, Shield, Bell, Settings, UserPlus, BookMarked, BarChart2, RefreshCw, Key } from "lucide-react";

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  MOCK DATABASE                                                             */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// const uid = () => `id_${Math.random().toString(36).substr(2,8)}`;
// const todayStr = () => new Date().toISOString().split("T")[0];

// const SEED_DB = {
//   users: [
//     { id:"u1", name:"Director Khan", email:"admin@foresty.edu", password:"admin123", role:"admin", avatar:null },
//     { id:"u2", name:"Mr. Ahmed Raza", email:"ahmed@foresty.edu", password:"teacher123", role:"teacher", classId:"c1", avatar:null },
//     { id:"u3", name:"Ms. Sara Malik", email:"sara@foresty.edu", password:"teacher123", role:"teacher", classId:"c2", avatar:null },
//     { id:"u4", name:"Ali Hassan", username:"STU001", password:"stu001", role:"student", studentId:"s1", avatar:null },
//     { id:"u5", name:"Fatima Iqbal", username:"STU002", password:"stu002", role:"student", studentId:"s2", avatar:null },
//     { id:"u6", name:"Usman Baig", username:"STU003", password:"stu003", role:"student", studentId:"s3", avatar:null },
//     { id:"u7", name:"Ayesha Noor", username:"STU004", password:"stu004", role:"student", studentId:"s4", avatar:null },
//     { id:"u8", name:"Zain Sheikh", username:"STU005", password:"stu005", role:"student", studentId:"s5", avatar:null },
//   ],
//   classes: [
//     { id:"c1", name:"Grade 9-A", teacherId:"u2", section:"A", year:"2025" },
//     { id:"c2", name:"Grade 10-B", teacherId:"u3", section:"B", year:"2025" },
//     { id:"c3", name:"Grade 8-C", teacherId:null, section:"C", year:"2025" },
//   ],
//   students: [
//     { id:"s1", userId:"u4", classId:"c1", roll:"001", fatherName:"Hassan Ali", contact:"0300-1234567", address:"Street 5, Lahore", dob:"2010-03-15", gender:"Male" },
//     { id:"s2", userId:"u5", classId:"c1", roll:"002", fatherName:"Iqbal Hussain", contact:"0301-2345678", address:"Block A, Karachi", dob:"2010-07-22", gender:"Female" },
//     { id:"s3", userId:"u6", classId:"c2", roll:"001", fatherName:"Baig Sahib", contact:"0302-3456789", address:"Sector G-11, Islamabad", dob:"2009-11-08", gender:"Male" },
//     { id:"s4", userId:"u7", classId:"c2", roll:"002", fatherName:"Noor Ahmad", contact:"0303-4567890", address:"Garden Town, Lahore", dob:"2009-05-30", gender:"Female" },
//     { id:"s5", userId:"u8", classId:"c1", roll:"003", fatherName:"Sheikh Tariq", contact:"0304-5678901", address:"DHA, Karachi", dob:"2010-01-12", gender:"Male" },
//   ],
//   attendance: [
//     { id:"a1",  studentId:"s1", date:"2025-02-03", status:"Present" },
//     { id:"a2",  studentId:"s1", date:"2025-02-04", status:"Present" },
//     { id:"a3",  studentId:"s1", date:"2025-02-05", status:"Absent"  },
//     { id:"a4",  studentId:"s1", date:"2025-02-10", status:"Present" },
//     { id:"a5",  studentId:"s1", date:"2025-02-11", status:"Present" },
//     { id:"a6",  studentId:"s1", date:"2025-02-12", status:"Present" },
//     { id:"a7",  studentId:"s2", date:"2025-02-03", status:"Present" },
//     { id:"a8",  studentId:"s2", date:"2025-02-04", status:"Absent"  },
//     { id:"a9",  studentId:"s2", date:"2025-02-05", status:"Absent"  },
//     { id:"a10", studentId:"s2", date:"2025-02-10", status:"Present" },
//     { id:"a11", studentId:"s2", date:"2025-02-11", status:"Present" },
//     { id:"a12", studentId:"s3", date:"2025-02-03", status:"Present" },
//     { id:"a13", studentId:"s3", date:"2025-02-04", status:"Present" },
//     { id:"a14", studentId:"s3", date:"2025-02-05", status:"Present" },
//     { id:"a15", studentId:"s3", date:"2025-02-10", status:"Present" },
//     { id:"a16", studentId:"s4", date:"2025-02-03", status:"Absent"  },
//     { id:"a17", studentId:"s4", date:"2025-02-04", status:"Present" },
//     { id:"a18", studentId:"s4", date:"2025-02-05", status:"Present" },
//     { id:"a19", studentId:"s5", date:"2025-02-03", status:"Present" },
//     { id:"a20", studentId:"s5", date:"2025-02-04", status:"Present" },
//     { id:"a21", studentId:"s5", date:"2025-02-05", status:"Present" },
//     { id:"a22", studentId:"s5", date:"2025-02-10", status:"Absent"  },
//   ],
//   marks: [
//     { id:"mk1", studentId:"s1", subject:"Mathematics", total:100, obtained:87 },
//     { id:"mk2", studentId:"s1", subject:"English",     total:100, obtained:79 },
//     { id:"mk3", studentId:"s1", subject:"Science",     total:100, obtained:92 },
//     { id:"mk4", studentId:"s1", subject:"Urdu",        total:100, obtained:85 },
//     { id:"mk5", studentId:"s1", subject:"History",     total:100, obtained:73 },
//     { id:"mk6",  studentId:"s2", subject:"Mathematics", total:100, obtained:65 },
//     { id:"mk7",  studentId:"s2", subject:"English",     total:100, obtained:72 },
//     { id:"mk8",  studentId:"s2", subject:"Science",     total:100, obtained:58 },
//     { id:"mk9",  studentId:"s2", subject:"Urdu",        total:100, obtained:80 },
//     { id:"mk10", studentId:"s2", subject:"History",     total:100, obtained:69 },
//     { id:"mk11", studentId:"s3", subject:"Mathematics", total:100, obtained:94 },
//     { id:"mk12", studentId:"s3", subject:"English",     total:100, obtained:88 },
//     { id:"mk13", studentId:"s3", subject:"Science",     total:100, obtained:76 },
//     { id:"mk14", studentId:"s3", subject:"Urdu",        total:100, obtained:91 },
//     { id:"mk15", studentId:"s4", subject:"Mathematics", total:100, obtained:45 },
//     { id:"mk16", studentId:"s4", subject:"English",     total:100, obtained:62 },
//     { id:"mk17", studentId:"s4", subject:"Science",     total:100, obtained:71 },
//     { id:"mk18", studentId:"s4", subject:"Urdu",        total:100, obtained:55 },
//     { id:"mk19", studentId:"s5", subject:"Mathematics", total:100, obtained:90 },
//     { id:"mk20", studentId:"s5", subject:"English",     total:100, obtained:84 },
//     { id:"mk21", studentId:"s5", subject:"Science",     total:100, obtained:78 },
//     { id:"mk22", studentId:"s5", subject:"Urdu",        total:100, obtained:88 },
//   ],
//   fees: [
//     { id:"f1", studentId:"s1", total:15000, paid:15000, due:0, status:"Paid",    month:"February 2025" },
//     { id:"f2", studentId:"s2", total:15000, paid:8000,  due:7000, status:"Pending", month:"February 2025" },
//     { id:"f3", studentId:"s3", total:15000, paid:15000, due:0, status:"Paid",    month:"February 2025" },
//     { id:"f4", studentId:"s4", total:15000, paid:5000,  due:10000, status:"Pending", month:"February 2025" },
//     { id:"f5", studentId:"s5", total:15000, paid:15000, due:0, status:"Paid",    month:"February 2025" },
//   ],
// };

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  CONTEXTS                                                                  */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// const AuthCtx = createContext(null);
// const AppCtx  = createContext(null);

// function useAuth() { return useContext(AuthCtx); }
// function useApp()  { return useContext(AppCtx);  }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  UTILITY HELPERS                                                           */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// const gradeColor = p => p >= 90 ? "#16a34a" : p >= 75 ? "#2563eb" : p >= 50 ? "#d97706" : "#dc2626";
// const gradeLetter = p => p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : p >= 50 ? "D" : "F";

// function attendancePct(records) {
//   if (!records.length) return 0;
//   return Math.round((records.filter(r => r.status === "Present").length / records.length) * 100);
// }

// function exportCSV(filename, headers, rows) {
//   const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
//   a.download = filename;
//   a.click();
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  TOAST NOTIFICATION                                                        */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function ToastContainer({ toasts }) {
//   return (
//     <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
//       {toasts.map(t => (
//         <div key={t.id}
//           className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white text-sm font-medium min-w-64 transition-all
//             ${t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-blue-600"}`}>
//           {t.type === "success" ? <CheckCircle size={16}/> : t.type === "error" ? <XCircle size={16}/> : <AlertCircle size={16}/>}
//           {t.message}
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  MODAL                                                                     */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function Modal({ title, onClose, children, size = "md" }) {
//   const sizeClass = { sm:"max-w-sm", md:"max-w-lg", lg:"max-w-2xl", xl:"max-w-4xl" }[size];
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
//       onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto`}>
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
//           <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
//           <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><X size={18}/></button>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  STAT CARD                                                                 */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function StatCard({ icon: Icon, label, value, sub, color = "green" }) {
//   const colors = {
//     green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
//     blue:  "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
//     amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
//     red:   "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
//     purple:"bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
//   };
//   return (
//     <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-shadow">
//       <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
//         <Icon size={22}/>
//       </div>
//       <div>
//         <p className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{value}</p>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
//         {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  BADGE                                                                     */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function Badge({ text, color }) {
//   const c = {
//     green:  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
//     red:    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
//     amber:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
//     blue:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
//     gray:   "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
//     purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
//   }[color] || "bg-gray-100 text-gray-600";
//   return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c}`}>{text}</span>;
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  INPUT / BUTTON                                                            */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function Input({ label, ...props }) {
//   return (
//     <div>
//       {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
//       <input {...props}
//         className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
//           text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
//     </div>
//   );
// }

// function Select({ label, children, ...props }) {
//   return (
//     <div>
//       {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
//       <select {...props}
//         className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
//           text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
//         {children}
//       </select>
//     </div>
//   );
// }

// function Btn({ children, onClick, variant = "primary", size = "md", className = "", icon: Icon, disabled }) {
//   const base = "inline-flex items-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
//   const sz = { sm:"px-3 py-1.5 text-xs", md:"px-4 py-2 text-sm", lg:"px-5 py-2.5 text-base" }[size];
//   const variants = {
//     primary:  "bg-green-700 hover:bg-green-800 text-white focus:ring-green-500",
//     secondary:"bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 focus:ring-gray-400",
//     danger:   "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
//     ghost:    "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 focus:ring-gray-400",
//     outline:  "border border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500",
//   }[variant];
//   return (
//     <button onClick={onClick} disabled={disabled} className={`${base} ${sz} ${variants} ${className}`}>
//       {Icon && <Icon size={size === "sm" ? 13 : 15}/>}{children}
//     </button>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  SIDEBAR                                                                   */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function Sidebar({ items, currentPage, onNav, user, onLogout, dark, toggleDark, mobileOpen, setMobileOpen }) {
//   return (
//     <>
//       {/* Mobile overlay */}
//       {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)}/>}
//       <aside className={`fixed top-0 left-0 h-full z-30 flex flex-col w-64 bg-green-900 dark:bg-gray-950 text-white
//         transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
//         {/* Logo */}
//         <div className="flex items-center gap-3 px-5 py-5 border-b border-green-800/60">
//           <div className="w-9 h-9 rounded-xl bg-green-400/20 flex items-center justify-center">
//             <BookMarked size={20} className="text-green-300"/>
//           </div>
//           <div>
//             <p className="font-bold text-sm leading-none">Foresty</p>
//             <p className="text-green-400 text-xs">Academics</p>
//           </div>
//           <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden text-green-400"><X size={18}/></button>
//         </div>

//         {/* User pill */}
//         <div className="mx-3 mt-4 p-3 rounded-xl bg-green-800/40 flex items-center gap-3">
//           <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
//             {user.name?.[0]?.toUpperCase()}
//           </div>
//           <div className="min-w-0">
//             <p className="text-sm font-semibold truncate">{user.name}</p>
//             <p className="text-green-400 text-xs capitalize">{user.role}</p>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto">
//           {items.map(({ key, label, icon: Icon }) => (
//             <button key={key} onClick={() => { onNav(key); setMobileOpen(false); }}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
//                 ${currentPage === key ? "bg-green-600 text-white" : "text-green-200 hover:bg-green-800/50 hover:text-white"}`}>
//               <Icon size={17}/>{label}
//             </button>
//           ))}
//         </nav>

//         {/* Footer actions */}
//         <div className="px-3 py-4 border-t border-green-800/60 space-y-1">
//           <button onClick={toggleDark}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-green-200 hover:bg-green-800/50 hover:text-white transition-all">
//             {dark ? <Sun size={16}/> : <Moon size={16}/>}
//             {dark ? "Light Mode" : "Dark Mode"}
//           </button>
//           <button onClick={onLogout}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all">
//             <LogOut size={16}/>Sign Out
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  PAGE HEADER                                                               */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function PageHeader({ title, subtitle, actions, onMenuClick }) {
//   return (
//     <div className="flex items-center justify-between mb-6">
//       <div className="flex items-center gap-3">
//         <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
//           <Menu size={20}/>
//         </button>
//         <div>
//           <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
//           {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
//         </div>
//       </div>
//       {actions && <div className="flex items-center gap-2">{actions}</div>}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  DATA TABLE                                                                */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function DataTable({ columns, data, emptyMsg = "No records found" }) {
//   return (
//     <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
//       <table className="w-full text-sm">
//         <thead className="bg-gray-50 dark:bg-gray-800/60">
//           <tr>
//             {columns.map(c => (
//               <th key={c.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
//                 {c.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
//           {data.length === 0 ? (
//             <tr><td colSpan={columns.length} className="text-center py-10 text-gray-400">{emptyMsg}</td></tr>
//           ) : data.map((row, i) => (
//             <tr key={i} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//               {columns.map(c => (
//                 <td key={c.key} className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                   {c.render ? c.render(row) : row[c.key]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  PROGRESS BAR                                                              */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function ProgressBar({ value, color = "#16a34a", label }) {
//   return (
//     <div>
//       {label && <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400"><span>{label}</span><span>{value}%</span></div>}
//       <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
//         <div className="h-2.5 rounded-full transition-all duration-500" style={{ width:`${value}%`, backgroundColor:color }}/>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  LOGIN PAGE                                                                */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function LoginPage() {
//   const { login } = useAuth();
//   const { showToast } = useApp();
//   const [form, setForm] = useState({ identifier:"", password:"" });
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const demos = [
//     { label:"Admin", identifier:"admin@foresty.edu", password:"admin123" },
//     { label:"Teacher", identifier:"ahmed@foresty.edu", password:"teacher123" },
//     { label:"Student", identifier:"STU001", password:"stu001" },
//   ];

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setErr(""); setLoading(true);
//     setTimeout(() => {
//       const ok = login(form.identifier, form.password);
//       if (!ok) { setErr("Invalid credentials. Please try again."); setLoading(false); }
//     }, 600);
//   }

//   return (
//     <div className="min-h-screen flex" style={{ background:"linear-gradient(135deg,#052e16 0%,#166534 50%,#15803d 100%)" }}>
//       {/* Left panel */}
//       <div className="hidden lg:flex flex-col justify-center items-start w-1/2 px-20 text-white">
//         <div className="flex items-center gap-3 mb-8">
//           <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
//             <BookMarked size={24} className="text-green-300"/>
//           </div>
//           <div>
//             <p className="text-2xl font-black">Foresty Academics</p>
//             <p className="text-green-300 text-sm">Institute Management System</p>
//           </div>
//         </div>
//         <h2 className="text-4xl font-black leading-tight mb-4">Empower Learning,<br/><span className="text-green-300">Simplify Management</span></h2>
//         <p className="text-green-100/80 text-lg leading-relaxed max-w-md">A unified platform for admins, teachers and students to collaborate, track progress, and achieve academic excellence.</p>
//         <div className="mt-10 grid grid-cols-3 gap-4">
//           {[["Admin","Full control & analytics"],["Teacher","Manage your class"],["Student","Track your progress"]].map(([t,d]) => (
//             <div key={t} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//               <p className="font-bold text-sm">{t}</p>
//               <p className="text-green-200 text-xs mt-1">{d}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right panel - form */}
//       <div className="flex-1 flex items-center justify-center p-6">
//         <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-md">
//           <div className="flex items-center gap-2 mb-1 lg:hidden">
//             <BookMarked size={20} className="text-green-700"/>
//             <span className="font-black text-green-700">Foresty Academics</span>
//           </div>
//           <h2 className="text-2xl font-black text-gray-800 dark:text-white">Welcome Back</h2>
//           <p className="text-gray-400 text-sm mt-1 mb-6">Sign in to access your dashboard</p>

//           {/* Demo buttons */}
//           <div className="flex gap-2 mb-6">
//             {demos.map(d => (
//               <button key={d.label} onClick={() => setForm({ identifier:d.identifier, password:d.password })}
//                 className="flex-1 py-1.5 text-xs font-semibold border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
//                 {d.label}
//               </button>
//             ))}
//           </div>
//           <p className="text-xs text-gray-400 -mt-4 mb-4 text-center">Click above to auto-fill demo credentials</p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input label="Email / Username" type="text" placeholder="email or student username"
//               value={form.identifier} onChange={e => setForm(f => ({...f, identifier:e.target.value}))} required/>
//             <Input label="Password" type="password" placeholder="••••••••"
//               value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} required/>
//             {err && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg p-3">{err}</p>}
//             <Btn className="w-full justify-center py-3" disabled={loading}>
//               {loading ? "Signing in..." : "Sign In →"}
//             </Btn>
//           </form>

//           <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
//             <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">Demo Credentials</p>
//             {demos.map(d => (
//               <p key={d.label} className="text-xs text-gray-400 dark:text-gray-500">{d.label}: <span className="font-mono">{d.identifier}</span> / <span className="font-mono">{d.password}</span></p>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  ██████████████  ADMIN PAGES  ██████████████                               */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function AdminDashboard({ onMenu }) {
//   const { db } = useApp();
//   const totalPaid = db.fees.reduce((s,f) => s + f.paid, 0);
//   const totalDue  = db.fees.reduce((s,f) => s + f.due,  0);
//   const teachers = db.users.filter(u => u.role === "teacher");
//   const totalAtt = db.attendance.length;
//   const presentAtt = db.attendance.filter(a => a.status === "Present").length;

//   const attendanceData = db.classes.map(cls => {
//     const sids = db.students.filter(s => s.classId === cls.id).map(s => s.id);
//     const att = db.attendance.filter(a => sids.includes(a.studentId));
//     return { name: cls.name, present: att.filter(a => a.status==="Present").length, absent: att.filter(a => a.status==="Absent").length };
//   });

//   const feeData = [
//     { name:"Paid", value: totalPaid, color:"#16a34a" },
//     { name:"Pending", value: totalDue, color:"#f59e0b" },
//   ];

//   const marksData = ["Mathematics","English","Science","Urdu"].map(sub => ({
//     subject: sub,
//     avg: Math.round(db.marks.filter(m => m.subject === sub).reduce((s,m) => s + (m.obtained/m.total*100), 0) / (db.marks.filter(m=>m.subject===sub).length||1))
//   }));

//   return (
//     <div>
//       <PageHeader title="Institute Dashboard" subtitle="Academic year 2025 overview" onMenuClick={onMenu}/>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard icon={Users} label="Total Students" value={db.students.length} color="green"/>
//         <StatCard icon={GraduationCap} label="Total Teachers" value={teachers.length} color="blue"/>
//         <StatCard icon={BookOpen} label="Classes" value={db.classes.length} color="purple"/>
//         <StatCard icon={DollarSign} label="Pending Fees" value={`₨ ${totalDue.toLocaleString()}`} color="amber"/>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
//         <StatCard icon={UserCheck} label="Overall Attendance" value={`${totalAtt ? Math.round(presentAtt/totalAtt*100) : 0}%`} sub={`${presentAtt} present of ${totalAtt} records`} color="green"/>
//         <StatCard icon={Wallet} label="Total Fees Collected" value={`₨ ${totalPaid.toLocaleString()}`} sub="This month" color="blue"/>
//         <StatCard icon={TrendingUp} label="Paid Students" value={`${db.fees.filter(f=>f.status==="Paid").length}/${db.fees.length}`} sub="Fee cleared" color="purple"/>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
//         <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
//           <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 text-sm">Attendance by Class</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={attendanceData} barSize={28}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
//               <XAxis dataKey="name" tick={{fontSize:11}}/>
//               <YAxis tick={{fontSize:11}}/>
//               <Tooltip/>
//               <Bar dataKey="present" fill="#16a34a" name="Present" radius={[4,4,0,0]}/>
//               <Bar dataKey="absent"  fill="#fca5a5" name="Absent" radius={[4,4,0,0]}/>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
//           <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 text-sm">Average Marks by Subject</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={marksData} barSize={36}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
//               <XAxis dataKey="subject" tick={{fontSize:11}}/>
//               <YAxis domain={[0,100]} tick={{fontSize:11}}/>
//               <Tooltip formatter={v => [`${v}%`,"Average"]}/>
//               <Bar dataKey="avg" fill="#2563eb" radius={[4,4,0,0]}/>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
//         <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 text-sm">Class Overview</h3>
//         <DataTable
//           columns={[
//             { key:"name", label:"Class" },
//             { key:"teacher", label:"Class Teacher", render: row => { const t = db.users.find(u=>u.id===row.teacherId); return t ? t.name : <Badge text="Unassigned" color="amber"/>; } },
//             { key:"students", label:"Students", render: row => db.students.filter(s=>s.classId===row.id).length },
//             { key:"att", label:"Attendance %", render: row => {
//               const sids = db.students.filter(s=>s.classId===row.id).map(s=>s.id);
//               const att = db.attendance.filter(a=>sids.includes(a.studentId));
//               const pct = attendancePct(att);
//               return <Badge text={`${pct}%`} color={pct>=75?"green":pct>=50?"amber":"red"}/>;
//             }},
//             { key:"fees", label:"Fee Status", render: row => {
//               const sids = db.students.filter(s=>s.classId===row.id).map(s=>s.id);
//               const paid = db.fees.filter(f=>sids.includes(f.studentId)&&f.status==="Paid").length;
//               return <span className="text-sm text-gray-600 dark:text-gray-400">{paid}/{sids.length} Paid</span>;
//             }},
//           ]}
//           data={db.classes}
//         />
//       </div>
//     </div>
//   );
// }

// function AdminClasses({ onMenu }) {
//   const { db, setDb, showToast } = useApp();
//   const [search, setSearch] = useState("");
//   const [modal, setModal] = useState(null);
//   const [form, setForm] = useState({ name:"", year:"2025", teacherId:"" });

//   const teachers = db.users.filter(u => u.role === "teacher");
//   const filtered = db.classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

//   function save() {
//     if (!form.name) return showToast("Class name required","error");
//     if (modal === "add") {
//       const cls = { id:uid(), name:form.name, year:form.year, teacherId:form.teacherId||null };
//       if (form.teacherId) {
//         setDb(d => ({...d,
//           classes:[...d.classes, cls],
//           users: d.users.map(u => u.id===form.teacherId ? {...u, classId:cls.id} : u)
//         }));
//       } else {
//         setDb(d => ({...d, classes:[...d.classes, cls]}));
//       }
//       showToast("Class created successfully","success");
//     } else {
//       setDb(d => ({...d,
//         classes: d.classes.map(c => c.id===modal ? {...c, name:form.name, year:form.year, teacherId:form.teacherId||null} : c),
//         users: d.users.map(u => u.role==="teacher" ? (u.id===form.teacherId ? {...u, classId:modal} : (u.classId===modal ? {...u, classId:null} : u)) : u)
//       }));
//       showToast("Class updated","success");
//     }
//     setModal(null);
//   }

//   function del(cls) {
//     if (!window.confirm(`Delete ${cls.name}?`)) return;
//     setDb(d => ({...d,
//       classes: d.classes.filter(c => c.id !== cls.id),
//       users: d.users.map(u => u.classId===cls.id ? {...u, classId:null} : u),
//     }));
//     showToast("Class deleted","success");
//   }

//   function openEdit(cls) {
//     setForm({ name:cls.name, year:cls.year||"2025", teacherId:cls.teacherId||"" });
//     setModal(cls.id);
//   }

//   return (
//     <div>
//       <PageHeader title="Classes" subtitle="Manage academic classes" onMenuClick={onMenu}
//         actions={<Btn icon={Plus} onClick={() => { setForm({name:"",year:"2025",teacherId:""}); setModal("add"); }}>New Class</Btn>}/>

//       <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="relative flex-1 max-w-sm">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
//             <input className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Search classes..." value={search} onChange={e=>setSearch(e.target.value)}/>
//           </div>
//           <Badge text={`${filtered.length} classes`} color="gray"/>
//         </div>
//         <DataTable
//           columns={[
//             { key:"name", label:"Class Name" },
//             { key:"year", label:"Year" },
//             { key:"teacher", label:"Assigned Teacher", render: row => {
//               const t = db.users.find(u=>u.id===row.teacherId);
//               return t ? <span className="font-medium">{t.name}</span> : <Badge text="Unassigned" color="amber"/>;
//             }},
//             { key:"students", label:"Students", render: row => {
//               const n = db.students.filter(s=>s.classId===row.id).length;
//               return <Badge text={`${n} students`} color="blue"/>;
//             }},
//             { key:"actions", label:"Actions", render: row => (
//               <div className="flex gap-2">
//                 <Btn size="sm" variant="ghost" icon={Edit} onClick={() => openEdit(row)}>Edit</Btn>
//                 <Btn size="sm" variant="ghost" icon={Trash2} onClick={() => del(row)} className="text-red-500 hover:text-red-600">Delete</Btn>
//               </div>
//             )},
//           ]}
//           data={filtered}
//         />
//       </div>

//       {modal && (
//         <Modal title={modal==="add" ? "Create New Class" : "Edit Class"} onClose={() => setModal(null)}>
//           <div className="space-y-4">
//             <Input label="Class Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Grade 9-A"/>
//             <Input label="Academic Year" type="text" value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))} placeholder="2025"/>
//             <Select label="Assign Teacher" value={form.teacherId} onChange={e=>setForm(f=>({...f,teacherId:e.target.value}))}>
//               <option value="">— No teacher assigned —</option>
//               {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//             </Select>
//             <div className="flex justify-end gap-3 pt-2">
//               <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
//               <Btn onClick={save}>{modal==="add" ? "Create Class" : "Save Changes"}</Btn>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// function AdminTeachers({ onMenu }) {
//   const { db, setDb, showToast } = useApp();
//   const [search, setSearch] = useState("");
//   const [modal, setModal] = useState(null);
//   const [form, setForm] = useState({ name:"", email:"", password:"", classId:"" });

//   const teachers = db.users.filter(u => u.role==="teacher");
//   const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()));

//   function save() {
//     if (!form.name || !form.email || (modal==="add" && !form.password)) return showToast("Fill all required fields","error");
//     if (modal === "add") {
//       const id = uid();
//       const teacher = { id, name:form.name, email:form.email, password:form.password, role:"teacher", classId:form.classId||null };
//       setDb(d => ({...d,
//         users:[...d.users, teacher],
//         classes: d.classes.map(c => c.id===form.classId ? {...c, teacherId:id} : c)
//       }));
//       showToast(`Teacher account created. Email: ${form.email}`, "success");
//     } else {
//       setDb(d => ({...d, users: d.users.map(u => u.id===modal ? {...u, name:form.name, email:form.email, classId:form.classId||null} : u)}));
//       showToast("Teacher updated","success");
//     }
//     setModal(null);
//   }

//   function del(t) {
//     if (!window.confirm(`Remove teacher ${t.name}?`)) return;
//     setDb(d => ({...d,
//       users: d.users.filter(u => u.id !== t.id),
//       classes: d.classes.map(c => c.teacherId===t.id ? {...c, teacherId:null} : c)
//     }));
//     showToast("Teacher removed","success");
//   }

//   const unassignedClasses = db.classes.filter(c => !c.teacherId || (modal && modal!=="add" && c.teacherId===modal));

//   return (
//     <div>
//       <PageHeader title="Teachers" subtitle="Manage teaching staff" onMenuClick={onMenu}
//         actions={<Btn icon={UserPlus} onClick={() => { setForm({name:"",email:"",password:"",classId:""}); setModal("add"); }}>Add Teacher</Btn>}/>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {teachers.map(t => {
//           const cls = db.classes.find(c=>c.id===t.classId);
//           const stuCount = cls ? db.students.filter(s=>s.classId===cls.id).length : 0;
//           return (
//             <div key={t.id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center font-bold text-base">{t.name[0]}</div>
//                   <div>
//                     <p className="font-semibold text-gray-800 dark:text-white text-sm">{t.name}</p>
//                     <p className="text-xs text-gray-400">{t.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-1">
//                   <button onClick={() => { setForm({name:t.name,email:t.email,password:"",classId:t.classId||""}); setModal(t.id); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"><Edit size={13}/></button>
//                   <button onClick={() => del(t)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button>
//                 </div>
//               </div>
//               <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
//                 {cls ? <Badge text={cls.name} color="green"/> : <Badge text="No class" color="amber"/>}
//                 {cls && <span className="text-xs text-gray-400">{stuCount} students</span>}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="relative flex-1 max-w-sm">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
//             <input className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Search teachers..." value={search} onChange={e=>setSearch(e.target.value)}/>
//           </div>
//         </div>
//         <DataTable
//           columns={[
//             { key:"name", label:"Name" },
//             { key:"email", label:"Email" },
//             { key:"class", label:"Assigned Class", render: row => { const c=db.classes.find(cl=>cl.id===row.classId); return c ? <Badge text={c.name} color="green"/> : <Badge text="Unassigned" color="amber"/>; }},
//             { key:"students", label:"Students", render: row => {
//               const c=db.classes.find(cl=>cl.id===row.classId);
//               return c ? db.students.filter(s=>s.classId===c.id).length : "–";
//             }},
//             { key:"actions", label:"Actions", render: row => (
//               <div className="flex gap-2">
//                 <Btn size="sm" variant="ghost" icon={Edit} onClick={() => { setForm({name:row.name,email:row.email,password:"",classId:row.classId||""}); setModal(row.id); }}>Edit</Btn>
//                 <Btn size="sm" variant="ghost" icon={Trash2} onClick={() => del(row)} className="text-red-500">Delete</Btn>
//               </div>
//             )},
//           ]}
//           data={filtered}
//         />
//       </div>

//       {modal && (
//         <Modal title={modal==="add" ? "Add Teacher Account" : "Edit Teacher"} onClose={()=>setModal(null)}>
//           <div className="space-y-4">
//             <Input label="Full Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Mr. / Ms. Full Name"/>
//             <Input label="Email *" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="teacher@foresty.edu"/>
//             {modal==="add" && <Input label="Password *" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Set initial password"/>}
//             <Select label="Assign to Class" value={form.classId} onChange={e=>setForm(f=>({...f,classId:e.target.value}))}>
//               <option value="">— No class —</option>
//               {db.classes.filter(c=>!c.teacherId || c.id===form.classId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </Select>
//             <div className="flex justify-end gap-3 pt-2">
//               <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
//               <Btn onClick={save}>{modal==="add" ? "Create Account" : "Save Changes"}</Btn>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// function AdminAllStudents({ onMenu }) {
//   const { db } = useApp();
//   const [search, setSearch] = useState("");
//   const [filterClass, setFilterClass] = useState("");

//   const enriched = db.students.map(s => ({
//     ...s,
//     user: db.users.find(u=>u.id===s.userId),
//     cls: db.classes.find(c=>c.id===s.classId),
//     fees: db.fees.find(f=>f.studentId===s.id),
//     att: db.attendance.filter(a=>a.studentId===s.id),
//   }));

//   const filtered = enriched.filter(s =>
//     (!filterClass || s.classId === filterClass) &&
//     (s.user?.name?.toLowerCase().includes(search.toLowerCase()) || s.roll?.includes(search))
//   );

//   function downloadCSV() {
//     exportCSV("all-students.csv",
//       ["Roll","Name","Username","Class","Father","Contact","Attendance%","Fee Status"],
//       filtered.map(s => [s.roll, s.user?.name, s.user?.username||"–", s.cls?.name, s.fatherName, s.contact, `${attendancePct(s.att)}%`, s.fees?.status||"–"])
//     );
//   }

//   return (
//     <div>
//       <PageHeader title="All Students" subtitle={`${db.students.length} students enrolled`} onMenuClick={onMenu}
//         actions={<Btn icon={Download} variant="secondary" onClick={downloadCSV}>Export CSV</Btn>}/>

//       <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//         <div className="flex flex-wrap items-center gap-3 mb-4">
//           <div className="relative flex-1 min-w-48">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
//             <input className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Search by name or roll..." value={search} onChange={e=>setSearch(e.target.value)}/>
//           </div>
//           <select className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//             value={filterClass} onChange={e=>setFilterClass(e.target.value)}>
//             <option value="">All Classes</option>
//             {db.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//           </select>
//           <Badge text={`${filtered.length} results`} color="gray"/>
//         </div>
//         <DataTable
//           columns={[
//             { key:"roll", label:"Roll", render: r => <span className="font-mono font-semibold text-green-700 dark:text-green-400">{r.cls?.name?.split("-")[1] || ""}-{r.roll}</span> },
//             { key:"name", label:"Name", render: r => <span className="font-medium">{r.user?.name}</span> },
//             { key:"username", label:"Username", render: r => <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{r.user?.username || "–"}</code> },
//             { key:"class", label:"Class", render: r => <Badge text={r.cls?.name||"–"} color="purple"/> },
//             { key:"father", label:"Father", render: r => r.fatherName },
//             { key:"att", label:"Attendance", render: r => { const p=attendancePct(r.att); return <Badge text={`${p}%`} color={p>=75?"green":p>=50?"amber":"red"}/>; } },
//             { key:"fee", label:"Fee", render: r => <Badge text={r.fees?.status||"–"} color={r.fees?.status==="Paid"?"green":"amber"}/> },
//           ]}
//           data={filtered}
//         />
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  ██████████████  TEACHER PAGES  ██████████████                            */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function useTeacherClass() {
//   const { db } = useApp();
//   const { user } = useAuth();
//   const cls = db.classes.find(c => c.id === user.classId);
//   const students = db.students.filter(s => s.classId === (cls?.id));
//   return { cls, students };
// }

// function TeacherDashboard({ onMenu }) {
//   const { db } = useApp();
//   const { user } = useAuth();
//   const { cls, students } = useTeacherClass();

//   const sids = students.map(s=>s.id);
//   const att = db.attendance.filter(a => sids.includes(a.studentId));
//   const pct = attendancePct(att);

//   const feeSummary = { paid: db.fees.filter(f=>sids.includes(f.studentId)&&f.status==="Paid").length, total: sids.length };
//   const avgMarks = Math.round(db.marks.filter(m=>sids.includes(m.studentId)).reduce((s,m)=>s+(m.obtained/m.total*100),0) / (db.marks.filter(m=>sids.includes(m.studentId)).length||1));

//   const recentAtt = [...att].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8);

//   return (
//     <div>
//       <PageHeader title={cls ? `${cls.name} Dashboard` : "Dashboard"} subtitle={`Welcome, ${user.name}`} onMenuClick={onMenu}/>
//       {!cls && <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 text-center"><AlertCircle className="mx-auto text-amber-500 mb-2" size={32}/><p className="font-semibold text-amber-700 dark:text-amber-300">No class assigned to you yet</p><p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Contact admin to get a class assigned.</p></div>}
//       {cls && (
//         <>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <StatCard icon={Users} label="Total Students" value={students.length} color="green"/>
//             <StatCard icon={UserCheck} label="Avg. Attendance" value={`${pct}%`} color="blue"/>
//             <StatCard icon={Award} label="Class Avg. Marks" value={`${avgMarks}%`} color="purple"/>
//             <StatCard icon={Wallet} label="Fees Cleared" value={`${feeSummary.paid}/${feeSummary.total}`} color="amber"/>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
//               <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 text-sm">Student Attendance</h3>
//               <div className="space-y-3">
//                 {students.map(s => {
//                   const u = db.users.find(u=>u.id===s.userId);
//                   const sAtt = att.filter(a=>a.studentId===s.id);
//                   const p = attendancePct(sAtt);
//                   return (
//                     <div key={s.id}>
//                       <div className="flex justify-between text-xs mb-1">
//                         <span className="text-gray-700 dark:text-gray-300 font-medium">{u?.name}</span>
//                         <span className="text-gray-500">{p}%</span>
//                       </div>
//                       <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
//                         <div className="h-2 rounded-full transition-all" style={{ width:`${p}%`, backgroundColor: p>=75?"#16a34a":p>=50?"#f59e0b":"#ef4444" }}/>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
//               <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 text-sm">Recent Attendance Records</h3>
//               <div className="space-y-2">
//                 {recentAtt.map(a => {
//                   const s = students.find(st=>st.id===a.studentId);
//                   const u = db.users.find(u=>u.id===s?.userId);
//                   return (
//                     <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-gray-800">
//                       <div>
//                         <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{u?.name}</p>
//                         <p className="text-xs text-gray-400">{a.date}</p>
//                       </div>
//                       <Badge text={a.status} color={a.status==="Present"?"green":"red"}/>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function TeacherStudents({ onMenu }) {
//   const { db, setDb, showToast } = useApp();
//   const { cls, students } = useTeacherClass();
//   const [search, setSearch] = useState("");
//   const [modal, setModal] = useState(null);
//   const [viewStudent, setViewStudent] = useState(null);
//   const [form, setForm] = useState({ name:"", fatherName:"", contact:"", address:"", dob:"", gender:"Male", roll:"" });

//   const enriched = students.map(s => ({...s, user:db.users.find(u=>u.id===s.userId)}));
//   const filtered = enriched.filter(s => s.user?.name?.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search));

//   function nextRoll() {
//     if (!students.length) return "001";
//     const max = Math.max(...students.map(s => parseInt(s.roll)||0));
//     return String(max + 1).padStart(3, "0");
//   }

//   function save() {
//     if (!form.name || !form.fatherName) return showToast("Name and father name required","error");
//     if (modal === "add") {
//       const sid = uid(); const uid2 = uid();
//       const username = `STU${String(db.users.filter(u=>u.role==="student").length+1).padStart(3,"0")}`;
//       const password = username.toLowerCase();
//       const newUser = { id:uid2, name:form.name, username, password, role:"student", studentId:sid };
//       const newStu = { id:sid, userId:uid2, classId:cls.id, roll:form.roll||nextRoll(), fatherName:form.fatherName, contact:form.contact, address:form.address, dob:form.dob, gender:form.gender };
//       setDb(d => ({...d, users:[...d.users, newUser], students:[...d.students, newStu],
//         fees:[...d.fees, { id:uid(), studentId:sid, total:15000, paid:0, due:15000, status:"Pending", month:"February 2025" }]
//       }));
//       showToast(`Student added! Username: ${username} | Password: ${password}`, "success");
//     } else {
//       const s = students.find(st=>st.id===modal);
//       setDb(d => ({...d,
//         students: d.students.map(st => st.id===modal ? {...st, roll:form.roll, fatherName:form.fatherName, contact:form.contact, address:form.address, dob:form.dob, gender:form.gender} : st),
//         users: d.users.map(u => u.id===s.userId ? {...u, name:form.name} : u)
//       }));
//       showToast("Student updated","success");
//     }
//     setModal(null);
//   }

//   function del(s) {
//     if (!window.confirm(`Remove ${s.user?.name}?`)) return;
//     setDb(d => ({...d, students:d.students.filter(st=>st.id!==s.id), users:d.users.filter(u=>u.id!==s.userId)}));
//     showToast("Student removed","success");
//   }

//   return (
//     <div>
//       <PageHeader title="Students" subtitle={cls?.name} onMenuClick={onMenu}
//         actions={cls && <Btn icon={UserPlus} onClick={()=>{setForm({name:"",fatherName:"",contact:"",address:"",dob:"",gender:"Male",roll:nextRoll()});setModal("add");}}>Add Student</Btn>}/>

//       {!cls ? <div className="text-center py-12 text-gray-400">No class assigned</div> : (
//         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="relative flex-1 max-w-sm">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
//               <input className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Search by name or roll..." value={search} onChange={e=>setSearch(e.target.value)}/>
//             </div>
//           </div>
//           <DataTable
//             columns={[
//               { key:"roll", label:"Roll", render: r => <span className="font-mono font-bold text-green-700 dark:text-green-400">{r.roll}</span> },
//               { key:"name", label:"Student", render: r => (
//                 <div><p className="font-medium text-gray-800 dark:text-white">{r.user?.name}</p><p className="text-xs text-gray-400">{r.user?.username}</p></div>
//               )},
//               { key:"father", label:"Father Name", render: r => r.fatherName },
//               { key:"contact", label:"Contact", render: r => r.contact },
//               { key:"gender", label:"Gender", render: r => <Badge text={r.gender||"–"} color={r.gender==="Female"?"purple":"blue"}/> },
//               { key:"att", label:"Attendance", render: r => { const p=attendancePct(db.attendance.filter(a=>a.studentId===r.id)); return <Badge text={`${p}%`} color={p>=75?"green":p>=50?"amber":"red"}/>; } },
//               { key:"actions", label:"", render: r => (
//                 <div className="flex gap-1">
//                   <button onClick={()=>setViewStudent(r)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500"><Eye size={13}/></button>
//                   <button onClick={()=>{setForm({name:r.user?.name,fatherName:r.fatherName,contact:r.contact,address:r.address||"",dob:r.dob||"",gender:r.gender||"Male",roll:r.roll});setModal(r.id);}} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-green-500"><Edit size={13}/></button>
//                   <button onClick={()=>del(r)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button>
//                 </div>
//               )},
//             ]}
//             data={filtered}
//           />
//         </div>
//       )}

//       {modal && (
//         <Modal title={modal==="add"?"Add New Student":"Edit Student"} onClose={()=>setModal(null)}>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-2"><Input label="Full Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Student full name"/></div>
//             <Input label="Roll Number" value={form.roll} onChange={e=>setForm(f=>({...f,roll:e.target.value}))} placeholder="001"/>
//             <Select label="Gender" value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}>
//               <option>Male</option><option>Female</option><option>Other</option>
//             </Select>
//             <div className="col-span-2"><Input label="Father's Name *" value={form.fatherName} onChange={e=>setForm(f=>({...f,fatherName:e.target.value}))} placeholder="Father/Guardian name"/></div>
//             <Input label="Contact" value={form.contact} onChange={e=>setForm(f=>({...f,contact:e.target.value}))} placeholder="0300-0000000"/>
//             <Input label="Date of Birth" type="date" value={form.dob} onChange={e=>setForm(f=>({...f,dob:e.target.value}))}/>
//             <div className="col-span-2"><Input label="Address" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="Home address"/></div>
//             <div className="col-span-2 flex justify-end gap-3 pt-2">
//               <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
//               <Btn onClick={save}>{modal==="add"?"Add Student":"Save Changes"}</Btn>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {viewStudent && (
//         <Modal title="Student Profile" onClose={()=>setViewStudent(null)} size="lg">
//           <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-black text-2xl">{viewStudent.user?.name?.[0]}</div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">{viewStudent.user?.name}</h3>
//                 <p className="text-gray-400 text-sm">Roll: {viewStudent.roll} | {cls?.name}</p>
//                 <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded mt-1 inline-block">{viewStudent.user?.username} / {viewStudent.user?.password}</code>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               {[["Father","fatherName"],["Contact","contact"],["Address","address"],["DOB","dob"],["Gender","gender"]].map(([l,k])=>
//                 <div key={k} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3"><p className="text-gray-400 text-xs">{l}</p><p className="font-medium text-gray-700 dark:text-gray-300 mt-0.5">{viewStudent[k]||"–"}</p></div>
//               )}
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// function TeacherAttendance({ onMenu }) {
//   const { db, setDb, showToast } = useApp();
//   const { cls, students } = useTeacherClass();
//   const [date, setDate] = useState(todayStr());
//   const [attState, setAttState] = useState({});

//   useEffect(() => {
//     const existing = {};
//     students.forEach(s => {
//       const rec = db.attendance.find(a => a.studentId === s.id && a.date === date);
//       existing[s.id] = rec ? rec.status : "Present";
//     });
//     setAttState(existing);
//   }, [date, students]);

//   function saveAttendance() {
//     setDb(d => {
//       const filtered = d.attendance.filter(a => !(students.map(s=>s.id).includes(a.studentId) && a.date === date));
//       const newRecs = students.map(s => ({ id:uid(), studentId:s.id, date, status:attState[s.id]||"Present" }));
//       return {...d, attendance: [...filtered, ...newRecs]};
//     });
//     showToast("Attendance saved successfully","success");
//   }

//   function exportAttCSV() {
//     const dates = [...new Set(db.attendance.filter(a=>students.map(s=>s.id).includes(a.studentId)).map(a=>a.date))].sort();
//     const headers = ["Roll","Name",...dates];
//     const rows = students.map(s => {
//       const u = db.users.find(u=>u.id===s.userId);
//       return [s.roll, u?.name, ...dates.map(d => { const r = db.attendance.find(a=>a.studentId===s.id&&a.date===d); return r?.status||"–"; })];
//     });
//     exportCSV(`attendance-${cls?.name}-${date}.csv`, headers, rows);
//   }

//   const summary = students.map(s => {
//     const recs = db.attendance.filter(a=>a.studentId===s.id);
//     return { ...s, user:db.users.find(u=>u.id===s.userId), pct:attendancePct(recs), total:recs.length };
//   });

//   return (
//     <div>
//       <PageHeader title="Attendance" subtitle={cls?.name} onMenuClick={onMenu}
//         actions={<Btn icon={Download} variant="secondary" onClick={exportAttCSV}>Export CSV</Btn>}/>

//       {!cls ? <div className="text-center py-12 text-gray-400">No class assigned</div> : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm">Mark Attendance</h3>
//               <input type="date" value={date} onChange={e=>setDate(e.target.value)} max={todayStr()}
//                 className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
//             </div>
//             <div className="space-y-2 mb-4">
//               <div className="flex gap-2 mb-3">
//                 <Btn size="sm" variant="secondary" onClick={()=>setAttState(Object.fromEntries(students.map(s=>[s.id,"Present"])))}>All Present</Btn>
//                 <Btn size="sm" variant="secondary" onClick={()=>setAttState(Object.fromEntries(students.map(s=>[s.id,"Absent"])))}>All Absent</Btn>
//               </div>
//               {students.map(s => {
//                 const u = db.users.find(u=>u.id===s.userId);
//                 const status = attState[s.id] || "Present";
//                 return (
//                   <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center font-bold text-xs">{u?.name?.[0]}</div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-800 dark:text-white">{u?.name}</p>
//                         <p className="text-xs text-gray-400">Roll: {s.roll}</p>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       {["Present","Absent"].map(st => (
//                         <button key={st} onClick={()=>setAttState(a=>({...a,[s.id]:st}))}
//                           className={`px-3 py-1 rounded-full text-xs font-semibold transition-all
//                             ${status===st ? (st==="Present"?"bg-green-600 text-white":"bg-red-500 text-white") : "bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300"}`}>
//                           {st}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//             <Btn className="w-full justify-center" onClick={saveAttendance} icon={CheckCircle}>Save Attendance for {date}</Btn>
//           </div>

//           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//             <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 text-sm">Attendance Summary</h3>
//             <div className="space-y-4">
//               {summary.map(s => (
//                 <div key={s.id}>
//                   <div className="flex justify-between text-xs mb-1">
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">{s.user?.name}</span>
//                     <span className="text-gray-500">{s.pct}% ({s.total} days)</span>
//                   </div>
//                   <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
//                     <div className="h-2 rounded-full" style={{ width:`${s.pct}%`, backgroundColor:s.pct>=75?"#16a34a":s.pct>=50?"#f59e0b":"#ef4444" }}/>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function TeacherMarks({ onMenu }) {
//   const { db, setDb, showToast } = useApp();
//   const { cls, students } = useTeacherClass();
//   const [selStudent, setSelStudent] = useState(null);
//   const [modal, setModal] = useState(null);
//   const [form, setForm] = useState({ subject:"", total:100, obtained:"" });

//   const enriched = students.map(s => ({...s, user:db.users.find(u=>u.id===s.userId), marks:db.marks.filter(m=>m.studentId===s.id)}));

//   function openAdd(s) { setSelStudent(s); setForm({subject:"",total:100,obtained:""}); setModal("add"); }
//   function openEdit(s, m) { setSelStudent(s); setForm({subject:m.subject,total:m.total,obtained:m.obtained}); setModal(m.id); }

//   function save() {
//     if (!form.subject || form.obtained==="") return showToast("Fill all fields","error");
//     if (modal==="add") {
//       setDb(d => ({...d, marks:[...d.marks, { id:uid(), studentId:selStudent.id, subject:form.subject, total:Number(form.total), obtained:Number(form.obtained) }]}));
//       showToast("Marks added","success");
//     } else {
//       setDb(d => ({...d, marks:d.marks.map(m => m.id===modal ? {...m, subject:form.subject, total:Number(form.total), obtained:Number(form.obtained)} : m)}));
//       showToast("Marks updated","success");
//     }
//     setModal(null);
//   }

//   function delMark(id) {
//     setDb(d => ({...d, marks:d.marks.filter(m=>m.id!==id)}));
//     showToast("Mark deleted","success");
//   }

//   return (
//     <div>
//       <PageHeader title="Marks" subtitle={cls?.name} onMenuClick={onMenu}/>
//       {!cls ? <div className="text-center py-12 text-gray-400">No class assigned</div> : (
//         <div className="space-y-4">
//           {enriched.map(s => {
//             const avg = s.marks.length ? Math.round(s.marks.reduce((sum,m)=>sum+(m.obtained/m.total*100),0)/s.marks.length) : 0;
//             return (
//               <div key={s.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center font-bold">{s.user?.name?.[0]}</div>
//                     <div>
//                       <p className="font-semibold text-gray-800 dark:text-white">{s.user?.name}</p>
//                       <p className="text-xs text-gray-400">Roll: {s.roll} | Avg: <span style={{color:gradeColor(avg)}} className="font-semibold">{avg}% ({gradeLetter(avg)})</span></p>
//                     </div>
//                   </div>
//                   <Btn size="sm" icon={Plus} onClick={()=>openAdd(s)}>Add Subject</Btn>
//                 </div>
//                 {s.marks.length > 0 && (
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead><tr className="text-xs text-gray-400 border-b dark:border-gray-800">{["Subject","Total","Obtained","Percentage","Grade",""].map(h=><th key={h} className="text-left py-2 px-2">{h}</th>)}</tr></thead>
//                       <tbody>
//                         {s.marks.map(m => {
//                           const pct = Math.round(m.obtained/m.total*100);
//                           return (
//                             <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
//                               <td className="py-2 px-2 font-medium text-gray-700 dark:text-gray-300">{m.subject}</td>
//                               <td className="py-2 px-2 text-gray-500">{m.total}</td>
//                               <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{m.obtained}</td>
//                               <td className="py-2 px-2"><span style={{color:gradeColor(pct)}} className="font-semibold">{pct}%</span></td>
//                               <td className="py-2 px-2"><Badge text={gradeLetter(pct)} color={pct>=90?"green":pct>=70?"blue":pct>=50?"amber":"red"}/></td>
//                               <td className="py-2 px-2 flex gap-1">
//                                 <button onClick={()=>openEdit(s,m)} className="p-1 text-gray-400 hover:text-green-500"><Edit size={12}/></button>
//                                 <button onClick={()=>delMark(m.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={12}/></button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {modal && (
//         <Modal title={modal==="add"?"Add Subject Marks":"Edit Marks"} onClose={()=>setModal(null)}>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Student: <span className="font-semibold text-gray-700 dark:text-gray-300">{selStudent?.user?.name}</span></p>
//           <div className="space-y-4">
//             <Input label="Subject" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="e.g. Mathematics"/>
//             <Input label="Total Marks" type="number" value={form.total} onChange={e=>setForm(f=>({...f,total:e.target.value}))}/>
//             <Input label="Obtained Marks" type="number" value={form.obtained} onChange={e=>setForm(f=>({...f,obtained:e.target.value}))} min={0} max={form.total}/>
//             {form.obtained !== "" && <div className="text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
//               Percentage: <span style={{color:gradeColor(Math.round(form.obtained/form.total*100))}} className="font-bold">{Math.round(form.obtained/form.total*100)}%</span> — Grade: <strong>{gradeLetter(Math.round(form.obtained/form.total*100))}</strong>
//             </div>}
//             <div className="flex justify-end gap-3 pt-2">
//               <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
//               <Btn onClick={save}>Save Marks</Btn>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// function TeacherFees({ onMenu }) {
//   const { db, setDb, showToast } = useApp();
//   const { cls, students } = useTeacherClass();
//   const [modal, setModal] = useState(null);
//   const [form, setForm] = useState({ total:15000, paid:0, month:"" });

//   const enriched = students.map(s => ({...s, user:db.users.find(u=>u.id===s.userId), fee:db.fees.find(f=>f.studentId===s.id)}));

//   function openEdit(s) {
//     const f = s.fee || { total:15000, paid:0, month:"February 2025" };
//     setForm({ total:f.total, paid:f.paid, month:f.month||"" });
//     setModal(s.id);
//   }

//   function save() {
//     const total = Number(form.total), paid = Number(form.paid);
//     const due = Math.max(0, total - paid);
//     const status = due === 0 ? "Paid" : "Pending";
//     setDb(d => {
//       const existing = d.fees.find(f=>f.studentId===modal);
//       if (existing) return {...d, fees:d.fees.map(f => f.studentId===modal ? {...f,total,paid,due,status,month:form.month} : f)};
//       return {...d, fees:[...d.fees, { id:uid(), studentId:modal, total, paid, due, status, month:form.month }]};
//     });
//     showToast("Fee record updated","success");
//     setModal(null);
//   }

//   const totalCollected = enriched.reduce((s,r) => s + (r.fee?.paid||0), 0);
//   const totalDue = enriched.reduce((s,r) => s + (r.fee?.due||0), 0);

//   return (
//     <div>
//       <PageHeader title="Fee Management" subtitle={cls?.name} onMenuClick={onMenu}/>
//       {!cls ? <div className="text-center py-12 text-gray-400">No class assigned</div> : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <StatCard icon={CheckCircle} label="Fees Cleared" value={`${enriched.filter(s=>s.fee?.status==="Paid").length}/${students.length}`} color="green"/>
//             <StatCard icon={Wallet} label="Total Collected" value={`₨ ${totalCollected.toLocaleString()}`} color="blue"/>
//             <StatCard icon={AlertCircle} label="Total Pending" value={`₨ ${totalDue.toLocaleString()}`} color="amber"/>
//           </div>
//           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//             <DataTable
//               columns={[
//                 { key:"roll", label:"Roll", render: r => <span className="font-mono font-bold text-green-700 dark:text-green-400">{r.roll}</span> },
//                 { key:"name", label:"Student", render: r => r.user?.name },
//                 { key:"month", label:"Month", render: r => r.fee?.month || "–" },
//                 { key:"total", label:"Total", render: r => `₨ ${(r.fee?.total||0).toLocaleString()}` },
//                 { key:"paid", label:"Paid", render: r => <span className="text-green-600 font-semibold">₨ {(r.fee?.paid||0).toLocaleString()}</span> },
//                 { key:"due", label:"Due", render: r => <span className="text-red-500 font-semibold">₨ {(r.fee?.due||0).toLocaleString()}</span> },
//                 { key:"status", label:"Status", render: r => <Badge text={r.fee?.status||"Pending"} color={r.fee?.status==="Paid"?"green":"amber"}/> },
//                 { key:"actions", label:"", render: r => <Btn size="sm" variant="ghost" icon={Edit} onClick={()=>openEdit(r)}>Update</Btn> },
//               ]}
//               data={enriched}
//             />
//           </div>
//         </>
//       )}

//       {modal && (
//         <Modal title="Update Fee Record" onClose={()=>setModal(null)}>
//           <div className="space-y-4">
//             <Input label="Total Fee (₨)" type="number" value={form.total} onChange={e=>setForm(f=>({...f,total:e.target.value}))}/>
//             <Input label="Paid Amount (₨)" type="number" value={form.paid} onChange={e=>setForm(f=>({...f,paid:e.target.value}))} min={0} max={form.total}/>
//             <Input label="Month" value={form.month} onChange={e=>setForm(f=>({...f,month:e.target.value}))} placeholder="February 2025"/>
//             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-sm">
//               <div className="flex justify-between"><span className="text-gray-500">Due Amount:</span><span className="font-bold text-red-500">₨ {Math.max(0,form.total-form.paid).toLocaleString()}</span></div>
//               <div className="flex justify-between mt-1"><span className="text-gray-500">Status:</span><Badge text={Number(form.paid)>=Number(form.total)?"Paid":"Pending"} color={Number(form.paid)>=Number(form.total)?"green":"amber"}/></div>
//             </div>
//             <div className="flex justify-end gap-3 pt-2">
//               <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
//               <Btn onClick={save}>Save Fee Record</Btn>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  ██████████████  STUDENT PAGES  ██████████████                            */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function useStudentData() {
//   const { db } = useApp();
//   const { user } = useAuth();
//   const student = db.students.find(s => s.id === user.studentId);
//   const cls = db.classes.find(c => c.id === student?.classId);
//   const teacher = db.users.find(u => u.id === cls?.teacherId);
//   const marks = db.marks.filter(m => m.studentId === student?.id);
//   const attendance = db.attendance.filter(a => a.studentId === student?.id);
//   const fee = db.fees.find(f => f.studentId === student?.id);
//   return { student, cls, teacher, marks, attendance, fee };
// }

// function StudentDashboard({ onMenu, onNav }) {
//   const { user } = useAuth();
//   const { student, cls, teacher, marks, attendance, fee } = useStudentData();
//   const pct = attendancePct(attendance);
//   const avgM = marks.length ? Math.round(marks.reduce((s,m)=>s+(m.obtained/m.total*100),0)/marks.length) : 0;

//   return (
//     <div>
//       <PageHeader title="My Dashboard" subtitle="Academic Overview" onMenuClick={onMenu}/>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
//         {/* Profile card */}
//         <div className="lg:col-span-1 bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 text-white">
//           <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center font-black text-3xl mb-4">{user.name[0]}</div>
//           <h2 className="text-xl font-black">{user.name}</h2>
//           <p className="text-green-200 text-sm">{cls?.name}</p>
//           <div className="mt-4 space-y-2 text-sm text-green-100">
//             {student && <>
//               <div className="flex items-center gap-2"><User size={13}/> Roll: <strong>{student.roll}</strong></div>
//               <div className="flex items-center gap-2"><Phone size={13}/> {student.contact}</div>
//               <div className="flex items-center gap-2"><MapPin size={13}/> {student.address}</div>
//               {teacher && <div className="flex items-center gap-2"><GraduationCap size={13}/> Teacher: <strong>{teacher.name}</strong></div>}
//             </>}
//           </div>
//           <button onClick={()=>onNav("report")}
//             className="mt-4 w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-semibold flex items-center justify-center gap-2">
//             <Printer size={14}/> Download Report Card
//           </button>
//         </div>

//         <div className="lg:col-span-2 space-y-4">
//           <div className="grid grid-cols-3 gap-4">
//             <StatCard icon={UserCheck} label="Attendance" value={`${pct}%`} color={pct>=75?"green":pct>=50?"amber":"red"}/>
//             <StatCard icon={Award} label="Avg Marks" value={`${avgM}%`} color="blue"/>
//             <StatCard icon={Wallet} label="Fee" value={fee?.status||"–"} color={fee?.status==="Paid"?"green":"amber"}/>
//           </div>

//           <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
//             <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3 text-sm">Attendance Progress</h3>
//             <ProgressBar value={pct} color={pct>=75?"#16a34a":pct>=50?"#f59e0b":"#ef4444"}/>
//             <div className="flex justify-between mt-2 text-xs text-gray-400">
//               <span>{attendance.filter(a=>a.status==="Present").length} Present</span>
//               <span>{attendance.filter(a=>a.status==="Absent").length} Absent</span>
//               <span>{attendance.length} Total</span>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
//             <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3 text-sm">Performance by Subject</h3>
//             {marks.length > 0 ? (
//               <ResponsiveContainer width="100%" height={130}>
//                 <BarChart data={marks.map(m=>({subject:m.subject.slice(0,4),pct:Math.round(m.obtained/m.total*100)}))} barSize={28}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
//                   <XAxis dataKey="subject" tick={{fontSize:10}}/>
//                   <YAxis domain={[0,100]} tick={{fontSize:10}}/>
//                   <Tooltip formatter={v=>[`${v}%`,"Score"]}/>
//                   <Bar dataKey="pct" fill="#16a34a" radius={[4,4,0,0]}/>
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : <p className="text-gray-400 text-sm text-center py-4">No marks recorded yet</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StudentMarks({ onMenu }) {
//   const { marks } = useStudentData();
//   const total = marks.reduce((s,m)=>s+m.obtained,0);
//   const maxTotal = marks.reduce((s,m)=>s+m.total,0);
//   const avg = maxTotal ? Math.round(total/maxTotal*100) : 0;

//   return (
//     <div>
//       <PageHeader title="My Marks" subtitle="Subject-wise performance" onMenuClick={onMenu}/>
//       {marks.length === 0 ? (
//         <div className="text-center py-16 text-gray-400"><Award size={48} className="mx-auto mb-3 opacity-30"/><p>No marks recorded yet</p></div>
//       ) : (
//         <>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <StatCard icon={Award} label="Overall Average" value={`${avg}%`} color="green"/>
//             <StatCard icon={ClipboardList} label="Subjects" value={marks.length} color="blue"/>
//             <StatCard icon={TrendingUp} label="Highest" value={`${Math.max(...marks.map(m=>Math.round(m.obtained/m.total*100)))}%`} color="purple"/>
//             <StatCard icon={BarChart2} label="Grade" value={gradeLetter(avg)} color={avg>=75?"green":avg>=50?"amber":"red"}/>
//           </div>
//           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//             <DataTable
//               columns={[
//                 { key:"subject", label:"Subject", render: r => <span className="font-semibold text-gray-800 dark:text-white">{r.subject}</span> },
//                 { key:"total", label:"Total Marks" },
//                 { key:"obtained", label:"Obtained", render: r => <span className="font-bold">{r.obtained}</span> },
//                 { key:"pct", label:"Percentage", render: r => { const p=Math.round(r.obtained/r.total*100); return <span style={{color:gradeColor(p)}} className="font-bold">{p}%</span>; } },
//                 { key:"grade", label:"Grade", render: r => { const p=Math.round(r.obtained/r.total*100); return <Badge text={gradeLetter(p)} color={p>=90?"green":p>=70?"blue":p>=50?"amber":"red"}/>; } },
//                 { key:"bar", label:"Performance", render: r => { const p=Math.round(r.obtained/r.total*100); return <div className="w-28"><div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2"><div className="h-2 rounded-full" style={{width:`${p}%`,backgroundColor:gradeColor(p)}}/></div></div>; } },
//               ]}
//               data={marks}
//             />
//             <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-sm">
//               <span className="text-gray-500">Total: <strong>{total}/{maxTotal}</strong></span>
//               <span className="text-gray-500">Overall: <strong style={{color:gradeColor(avg)}}>{avg}% — {gradeLetter(avg)}</strong></span>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function StudentAttendancePage({ onMenu }) {
//   const { attendance } = useStudentData();
//   const pct = attendancePct(attendance);
//   const sorted = [...attendance].sort((a,b)=>b.date.localeCompare(a.date));

//   return (
//     <div>
//       <PageHeader title="My Attendance" subtitle="Date-wise attendance record" onMenuClick={onMenu}/>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <StatCard icon={Calendar} label="Total Days" value={attendance.length} color="blue"/>
//         <StatCard icon={CheckCircle} label="Present" value={attendance.filter(a=>a.status==="Present").length} color="green"/>
//         <StatCard icon={XCircle} label="Absent" value={attendance.filter(a=>a.status==="Absent").length} color="red"/>
//         <StatCard icon={TrendingUp} label="Percentage" value={`${pct}%`} color={pct>=75?"green":pct>=50?"amber":"red"}/>
//       </div>
//       <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 mb-4">
//         <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3 text-sm">Attendance Rate</h3>
//         <ProgressBar value={pct} color={pct>=75?"#16a34a":pct>=50?"#f59e0b":"#ef4444"}/>
//         <p className="text-xs mt-2 text-gray-400">{pct >= 75 ? "✅ Good attendance! Keep it up." : pct >= 50 ? "⚠️ Attendance is below the recommended 75%." : "❌ Critical: Very low attendance. Please contact your teacher."}</p>
//       </div>
//       <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
//         <DataTable
//           columns={[
//             { key:"date", label:"Date", render: r => <span className="font-mono">{r.date}</span> },
//             { key:"day", label:"Day", render: r => new Date(r.date).toLocaleDateString("en-US",{weekday:"long"}) },
//             { key:"status", label:"Status", render: r => (
//               <div className="flex items-center gap-2">
//                 {r.status==="Present" ? <CheckCircle size={14} className="text-green-500"/> : <XCircle size={14} className="text-red-500"/>}
//                 <Badge text={r.status} color={r.status==="Present"?"green":"red"}/>
//               </div>
//             )},
//           ]}
//           data={sorted}
//           emptyMsg="No attendance records found"
//         />
//       </div>
//     </div>
//   );
// }

// function StudentFees({ onMenu }) {
//   const { fee } = useStudentData();
//   return (
//     <div>
//       <PageHeader title="Fee Status" subtitle="Monthly fee information" onMenuClick={onMenu}/>
//       {!fee ? (
//         <div className="text-center py-16 text-gray-400"><Wallet size={48} className="mx-auto mb-3 opacity-30"/><p>No fee record found</p></div>
//       ) : (
//         <div className="max-w-lg">
//           <div className={`rounded-2xl p-6 mb-4 ${fee.status==="Paid"?"bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800":"bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"}`}>
//             <div className="flex items-center gap-3 mb-4">
//               {fee.status==="Paid" ? <CheckCircle size={28} className="text-green-600"/> : <AlertCircle size={28} className="text-amber-600"/>}
//               <div>
//                 <p className="text-sm text-gray-500">{fee.month}</p>
//                 <p className={`text-2xl font-black ${fee.status==="Paid"?"text-green-700 dark:text-green-400":"text-amber-700 dark:text-amber-400"}`}>{fee.status}</p>
//               </div>
//             </div>
//             <div className="space-y-3">
//               {[["Total Fee",fee.total,"gray"],["Amount Paid",fee.paid,"green"],["Amount Due",fee.due,"red"]].map(([l,v,c])=>(
//                 <div key={l} className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
//                   <span className="text-sm text-gray-500">{l}</span>
//                   <span className={`font-bold text-sm ${c==="green"?"text-green-600":c==="red"?"text-red-500":"text-gray-700 dark:text-gray-300"}`}>₨ {v.toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//             <ProgressBar value={Math.round(fee.paid/fee.total*100)} color="#16a34a" label=""/>
//             <p className="text-xs text-gray-400 mt-2 text-right">{Math.round(fee.paid/fee.total*100)}% cleared</p>
//           </div>
//           {fee.status!=="Paid" && <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-sm text-gray-500">Please contact your class teacher to update payment status.</div>}
//         </div>
//       )}
//     </div>
//   );
// }

// function StudentReportCard({ onMenu }) {
//   const { user } = useAuth();
//   const { student, cls, teacher, marks, attendance, fee } = useStudentData();
//   const pct = attendancePct(attendance);
//   const total = marks.reduce((s,m)=>s+m.obtained,0);
//   const maxTotal = marks.reduce((s,m)=>s+m.total,0);
//   const avg = maxTotal ? Math.round(total/maxTotal*100) : 0;

//   return (
//     <div>
//       <PageHeader title="Report Card" subtitle="Academic report" onMenuClick={onMenu}
//         actions={<Btn icon={Printer} onClick={()=>window.print()}>Print Report Card</Btn>}/>
//       <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-green-200 dark:border-green-800 p-8 max-w-3xl" id="report-card">
//         {/* Header */}
//         <div className="text-center border-b-2 border-green-700 pb-5 mb-5">
//           <div className="flex items-center justify-center gap-3 mb-2">
//             <BookMarked size={28} className="text-green-700"/>
//             <div>
//               <h1 className="text-2xl font-black text-green-900 dark:text-green-400">FORESTY ACADEMICS</h1>
//               <p className="text-sm text-gray-500">Academic Year 2025 — Progress Report</p>
//             </div>
//           </div>
//         </div>
//         {/* Student Info */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div className="space-y-2">
//             {[["Name",user.name],["Class",cls?.name],["Roll No.",student?.roll],["Gender",student?.gender]].map(([l,v])=>(
//               <div key={l} className="flex gap-2 text-sm"><span className="text-gray-400 w-24">{l}:</span><span className="font-semibold text-gray-800 dark:text-gray-200">{v||"–"}</span></div>
//             ))}
//           </div>
//           <div className="space-y-2">
//             {[["Father",student?.fatherName],["Contact",student?.contact],["Teacher",teacher?.name],["Date",new Date().toLocaleDateString()]].map(([l,v])=>(
//               <div key={l} className="flex gap-2 text-sm"><span className="text-gray-400 w-24">{l}:</span><span className="font-semibold text-gray-800 dark:text-gray-200">{v||"–"}</span></div>
//             ))}
//           </div>
//         </div>
//         {/* Marks */}
//         <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2 text-sm uppercase tracking-wide">Academic Performance</h3>
//         <table className="w-full text-sm mb-5 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
//           <thead className="bg-green-700 text-white"><tr>{["Subject","Total","Obtained","Percentage","Grade"].map(h=><th key={h} className="py-2 px-3 text-left text-xs">{h}</th>)}</tr></thead>
//           <tbody>
//             {marks.map((m,i) => { const p=Math.round(m.obtained/m.total*100); return (
//               <tr key={m.id} className={i%2===0?"bg-white dark:bg-gray-900":"bg-gray-50 dark:bg-gray-800"}>
//                 <td className="py-2 px-3">{m.subject}</td>
//                 <td className="py-2 px-3">{m.total}</td>
//                 <td className="py-2 px-3 font-bold">{m.obtained}</td>
//                 <td className="py-2 px-3" style={{color:gradeColor(p)}}>{p}%</td>
//                 <td className="py-2 px-3 font-bold">{gradeLetter(p)}</td>
//               </tr>
//             );})}
//             <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
//               <td className="py-2 px-3">TOTAL</td>
//               <td className="py-2 px-3">{maxTotal}</td>
//               <td className="py-2 px-3">{total}</td>
//               <td className="py-2 px-3" style={{color:gradeColor(avg)}}>{avg}%</td>
//               <td className="py-2 px-3">{gradeLetter(avg)}</td>
//             </tr>
//           </tbody>
//         </table>
//         {/* Summary */}
//         <div className="grid grid-cols-3 gap-4">
//           {[["Overall Grade",gradeLetter(avg),gradeColor(avg)],["Percentage",`${avg}%`,gradeColor(avg)],["Attendance",`${pct}%`,pct>=75?"#16a34a":"#f59e0b"]].map(([l,v,c])=>(
//             <div key={l} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
//               <p className="text-xs text-gray-400 mb-1">{l}</p>
//               <p className="text-2xl font-black" style={{color:c}}>{v}</p>
//             </div>
//           ))}
//         </div>
//         <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-xs text-gray-400">
//           <span>Generated: {new Date().toLocaleString()}</span>
//           <span>Foresty Academics Management System</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  LAYOUTS                                                                   */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function Layout({ navItems, pageComponents }) {
//   const { user, logout } = useAuth();
//   const { dark, toggleDark } = useApp();
//   const [page, setPage] = useState(navItems[0].key);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const PageComponent = pageComponents[page] || (() => <div className="text-gray-400 text-center py-16">Page not found</div>);
//   return (
//     <div className={`flex h-screen overflow-hidden ${dark?"dark bg-gray-950":"bg-gray-50"}`}>
//       <Sidebar items={navItems} currentPage={page} onNav={setPage} user={user} onLogout={logout} dark={dark} toggleDark={toggleDark} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
//       <main className="flex-1 overflow-y-auto">
//         <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
//           <PageComponent onMenu={()=>setMobileOpen(true)} onNav={setPage}/>
//         </div>
//       </main>
//     </div>
//   );
// }

// const ADMIN_NAV = [
//   { key:"dashboard", label:"Dashboard", icon:Home },
//   { key:"classes",   label:"Classes",   icon:BookOpen },
//   { key:"teachers",  label:"Teachers",  icon:GraduationCap },
//   { key:"students",  label:"All Students", icon:Users },
// ];

// const TEACHER_NAV = [
//   { key:"dashboard",  label:"Dashboard",  icon:Home },
//   { key:"students",   label:"Students",   icon:Users },
//   { key:"attendance", label:"Attendance", icon:Calendar },
//   { key:"marks",      label:"Marks",      icon:Award },
//   { key:"fees",       label:"Fees",       icon:Wallet },
// ];

// const STUDENT_NAV = [
//   { key:"dashboard",  label:"Dashboard",  icon:Home },
//   { key:"marks",      label:"My Marks",   icon:Award },
//   { key:"attendance", label:"Attendance", icon:Calendar },
//   { key:"fees",       label:"Fee Status", icon:Wallet },
//   { key:"report",     label:"Report Card",icon:FileText },
// ];

// function AdminLayout()   { return <Layout navItems={ADMIN_NAV}   pageComponents={{ dashboard:AdminDashboard, classes:AdminClasses, teachers:AdminTeachers, students:AdminAllStudents }}/> }
// function TeacherLayout() { return <Layout navItems={TEACHER_NAV} pageComponents={{ dashboard:TeacherDashboard, students:TeacherStudents, attendance:TeacherAttendance, marks:TeacherMarks, fees:TeacherFees }}/> }
// function StudentLayout() { return <Layout navItems={STUDENT_NAV} pageComponents={{ dashboard:StudentDashboard, marks:StudentMarks, attendance:StudentAttendancePage, fees:StudentFees, report:StudentReportCard }}/> }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  ROOT APP                                                                  */
// /* ═══════════════════════════════════════════════════════════════════════════ */

// function AppProvider({ children }) {
//   const [db, setDb] = useState(SEED_DB);
//   const [user, setUser] = useState(null);
//   const [dark, setDark] = useState(false);
//   const [toasts, setToasts] = useState([]);

//   function login(identifier, password) {
//     const found = db.users.find(u =>
//       (u.email === identifier || u.username === identifier) && u.password === password
//     );
//     if (found) { setUser(found); return true; }
//     return false;
//   }

//   function logout() { setUser(null); }
//   function toggleDark() { setDark(d => !d); }

//   function showToast(message, type = "success") {
//     const id = uid();
//     setToasts(t => [...t, { id, message, type }]);
//     setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
//   }

//   return (
//     <AuthCtx.Provider value={{ user, login, logout }}>
//       <AppCtx.Provider value={{ db, setDb, dark, toggleDark, showToast }}>
//         {children}
//         <ToastContainer toasts={toasts}/>
//       </AppCtx.Provider>
//     </AuthCtx.Provider>
//   );
// }

// export default function App() {
//   return (
//     <AppProvider>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
//         * { font-family: 'Plus Jakarta Sans', sans-serif; }
//         code, .font-mono { font-family: 'JetBrains Mono', monospace; }
//         @media print {
//           nav, aside, button, .no-print { display: none !important; }
//           body { background: white; }
//           #report-card { border: 2px solid #166534 !important; }
//         }
//         ::-webkit-scrollbar { width: 4px; height: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
//         .dark ::-webkit-scrollbar-thumb { background: #374151; }
//       `}</style>
//       <Router/>
//     </AppProvider>
//   );
// }

// function Router() {
//   const { user } = useAuth();
//   if (!user) return <LoginPage/>;
//   if (user.role === "admin")   return <AdminLayout/>;
//   if (user.role === "teacher") return <TeacherLayout/>;
//   if (user.role === "student") return <StudentLayout/>;
//   return <LoginPage/>;
// }

