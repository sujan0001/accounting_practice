import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { activeProject } = useProject();
  const navigate = useNavigate();

  if (!activeProject) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Aid Ledger</h1>
        <p className="text-gray-600 mb-4">Please load a project to get started.</p>
        <button
          onClick={() => navigate('/projects/switch')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Load Project
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Project</h3>
          <p className="text-2xl font-bold text-blue-600">{activeProject.projectName}</p>
          <p className="text-sm text-gray-500 mt-1">{activeProject.alias}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/budget')}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded"
            >
              Create Budget
            </button>
            <button
              onClick={() => navigate('/journal-voucher')}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded"
            >
              Create Journal Voucher
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/reports')}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded"
            >
              View Reports
            </button>
            <button
              onClick={() => navigate('/books')}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded"
            >
              View Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

