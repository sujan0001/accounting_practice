import { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { format } from 'date-fns';

export default function Reports() {
  const { activeProject } = useProject();
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [asOfDate, setAsOfDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (reportType: string) => {
    if (!activeProject) return;

    setLoading(true);
    try {
      let response;
      if (reportType === 'balance-sheet') {
        response = await api.get(`/projects/${activeProject._id}/reports/${reportType}`, {
          params: { asOfDate },
        });
      } else {
        response = await api.get(`/projects/${activeProject._id}/reports/${reportType}`, {
          params: { from: dateFrom, to: dateTo },
        });
      }
      setReportData(response.data);
      setActiveReport(reportType);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      alert('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  if (!activeProject) {
    return <div>Please load a project first</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            As Of Date (for Balance Sheet)
          </label>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => fetchReport('trial-balance')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Trial Balance
          </button>
          <button
            onClick={() => fetchReport('income-statement')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Income Statement
          </button>
          <button
            onClick={() => fetchReport('balance-sheet')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Balance Sheet
          </button>
          <button
            onClick={() => fetchReport('fund-accountability')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Fund Accountability
          </button>
          <button
            onClick={() => fetchReport('budget-vs-expenditure')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Budget vs Expenditure
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">Loading report...</div>
      )}

      {reportData && activeReport && !loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {activeReport.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h2>
          <pre className="bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

