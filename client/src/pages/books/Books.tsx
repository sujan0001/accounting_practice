import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { format } from 'date-fns';
import { GeneralLedger } from '../../types';

export default function Books() {
  const { activeProject } = useProject();
  const [activeBook, setActiveBook] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [generalLedgers, setGeneralLedgers] = useState<GeneralLedger[]>([]);
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  const [selectedSubLedgerId, setSelectedSubLedgerId] = useState('');
  const [bookData, setBookData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeProject) {
      fetchGeneralLedgers();
    }
  }, [activeProject]);

  const fetchGeneralLedgers = async () => {
    try {
      const response = await api.get(`/projects/${activeProject?._id}/general-ledgers`);
      setGeneralLedgers(response.data.generalLedgers);
    } catch (error) {
      console.error('Failed to fetch general ledgers:', error);
    }
  };

  const fetchBook = async (bookType: string) => {
    if (!activeProject) return;

    setLoading(true);
    try {
      let response;
      const params: any = { from: dateFrom, to: dateTo };

      if (bookType === 'general-ledger') {
        if (!selectedLedgerId) {
          alert('Please select a general ledger');
          setLoading(false);
          return;
        }
        params.ledgerId = selectedLedgerId;
      } else if (bookType === 'sub-ledger') {
        if (!selectedSubLedgerId) {
          alert('Please select a sub ledger');
          setLoading(false);
          return;
        }
        params.subLedgerId = selectedSubLedgerId;
      }

      response = await api.get(`/projects/${activeProject._id}/books/${bookType}`, { params });
      setBookData(response.data);
      setActiveBook(bookType);
    } catch (error) {
      console.error('Failed to fetch book:', error);
      alert('Failed to fetch book');
    } finally {
      setLoading(false);
    }
  };

  if (!activeProject) {
    return <div>Please load a project first</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Books</h1>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              General Ledger (for GL Book)
            </label>
            <select
              value={selectedLedgerId}
              onChange={(e) => setSelectedLedgerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select General Ledger</option>
              {generalLedgers.map((gl) => (
                <option key={gl._id} value={gl._id}>
                  {gl.ledgerName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => fetchBook('general-ledger')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            General Ledger Book
          </button>
          <button
            onClick={() => fetchBook('sub-ledger')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Sub Ledger Book
          </button>
          <button
            onClick={() => fetchBook('cash-bank')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Cash/Bank Book
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">Loading book...</div>
      )}

      {bookData && activeBook && !loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {activeBook.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h2>
          <pre className="bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(bookData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

