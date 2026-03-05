function StatCard({ icon: Icon, label, value, sub, color = "green" }) {
  const colors = {
    green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    blue:  "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    red:   "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    purple:"bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={22}/>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default StatCard