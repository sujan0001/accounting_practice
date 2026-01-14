import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';

interface MenuItem {
  path?: string;
  label: string;
  icon: string;
  children?: MenuItem[];
}

export default function Sidebar() {
  const location = useLocation();
  const { activeProject } = useProject();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    project: false,
    entry: false,
    reports: false,
    books: false,
    master: false,
  });

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    {
      label: 'Project',
      icon: '📁',
      children: [
        { path: '/projects', label: 'Project Master' },
        { path: '/projects/switch', label: 'Switch Project' },
      ],
    },
    {
      label: 'Entry',
      icon: '📝',
      children: [
        { path: '/journal-voucher', label: 'Journal Voucher' },
        { path: '/budget', label: 'Budget Entry' },
      ],
    },
    {
      label: 'Reports',
      icon: '📈',
      children: [
        { path: '/reports?type=trial-balance', label: 'Trial Balance' },
        { path: '/reports?type=income-statement', label: 'Income Statement' },
        { path: '/reports?type=balance-sheet', label: 'Balance Sheet' },
        { path: '/reports?type=fund-accountability', label: 'Fund Accountability Statement' },
        { path: '/reports?type=budget-vs-expenditure', label: 'Budget vs Expenditure' },
      ],
    },
    {
      label: 'Books',
      icon: '📚',
      children: [
        { path: '/books', label: 'Cash & Bank Book' },
        { path: '/books', label: 'General Ledger' },
        { path: '/books', label: 'Sub Ledger' },
      ],
    },
    {
      label: 'Master Setup',
      icon: '⚙️',
      children: [
        { path: '/master-setup/ledger-groups', label: 'Ledger Group' },
        { path: '/master-setup/general-ledgers', label: 'General Ledger' },
        { path: '/master-setup/sub-ledgers', label: 'Sub Ledger' },
      ],
    },
  ];

  const isPathActive = (path?: string): boolean => {
    if (!path) return false;
    if (path === location.pathname) return true;
    // For parent paths, check if any child is active
    return location.pathname.startsWith(path + '/');
  };

  const isMenuExpanded = (menuKey: string): boolean => {
    return expandedMenus[menuKey] || false;
  };

  const getMenuKey = (label: string): string => {
    return label.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.children) {
              const menuKey = getMenuKey(item.label);
              const isExpanded = isMenuExpanded(menuKey);
              const hasActiveChild = item.children.some((child) => isPathActive(child.path));

              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleMenu(menuKey)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors ${
                      hasActiveChild
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                  </button>
                  {isExpanded && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const isActive = isPathActive(child.path);
                        return (
                          <li key={child.path}>
                            <Link
                              to={child.path || '#'}
                              className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
                                isActive
                                  ? 'bg-blue-100 text-blue-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const isActive = isPathActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path || '#'}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

