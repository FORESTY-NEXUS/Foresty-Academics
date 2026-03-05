import { Menu } from "lucide-react";

function PageHeader({ title, subtitle, actions, onMenuClick, showMenuAlways = false }) {
  
  return (
    <div className="flex items-center justify-between min-w-0">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className={`${showMenuAlways ? "" : "lg:hidden"} p-2 rounded-lg bg-green-600/10 hover:bg-green-600/20 dark:hover:bg-green-600/20 text-green-600 dark:text-green-400 transition-colors`}
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export default PageHeader
