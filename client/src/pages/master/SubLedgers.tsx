import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { SubLedger, GeneralLedger } from '../../types';

export default function SubLedgers() {
  const { activeProject } = useProject();
  const [subLedgers, setSubLedgers] = useState<SubLedger[]>([]);
  const [generalLedgers, setGeneralLedgers] = useState<GeneralLedger[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subLedgerName: '',
    alias: '',
    generalLedger: '',
    openingBalance: 0,
    openingBalanceType: 'debit' as 'debit' | 'credit',
    description: '',
  });

  useEffect(() => {
    if (activeProject) {
      fetchSubLedgers();
      fetchGeneralLedgers();
    }
  }, [activeProject]);

  const fetchSubLedgers = async () => {
    try {
      const response = await api.get(`/projects/${activeProject?._id}/sub-ledgers`);
      setSubLedgers(response.data.subLedgers);
    } catch (error) {
      console.error('Failed to fetch sub ledgers:', error);
    }
  };

  const fetchGeneralLedgers = async () => {
    try {
      const response = await api.get(`/projects/${activeProject?._id}/general-ledgers`);
      setGeneralLedgers(response.data.generalLedgers);
    } catch (error) {
      console.error('Failed to fetch general ledgers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${activeProject?._id}/sub-ledgers`, formData);
      setShowForm(false);
      setFormData({
        subLedgerName: '',
        alias: '',
        generalLedger: '',
        openingBalance: 0,
        openingBalanceType: 'debit',
        description: '',
      });
      fetchSubLedgers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create sub ledger');
    }
  };

  if (!activeProject) {
    return <div>Please load a project first</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sub Ledgers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : 'Create New'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Ledger Name *
              </label>
              <input
                type="text"
                required
                value={formData.subLedgerName}
                onChange={(e) => setFormData({ ...formData, subLedgerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alias *
              </label>
              <input
                type="text"
                required
                value={formData.alias}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              General Ledger *
            </label>
            <select
              required
              value={formData.generalLedger}
              onChange={(e) => setFormData({ ...formData, generalLedger: e.target.value })}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Balance
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Balance Type
              </label>
              <select
                value={formData.openingBalanceType}
                onChange={(e) => setFormData({ ...formData, openingBalanceType: e.target.value as 'debit' | 'credit' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Create
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Ledger Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alias</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">General Ledger</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subLedgers.map((subLedger) => (
              <tr key={subLedger._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subLedger.subLedgerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subLedger.alias}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof subLedger.generalLedger === 'object' ? subLedger.generalLedger.ledgerName : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

