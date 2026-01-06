import { Link, useLocation } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';

export default function Sidebar() {
  const location = useLocation();
  const { activeProject } = useProject();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁', className: 'sidebar-project' },
    { path: '/master-setup', label: 'Master Setup', icon: '⚙️' },
    { path: '/budget', label: 'Budget Entry', icon: '💰' },
    { path: '/journal-voucher', label: 'Journal Voucher', icon: '📝' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/books', label: 'Books', icon: '📚' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${item.className || ''}`}
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

