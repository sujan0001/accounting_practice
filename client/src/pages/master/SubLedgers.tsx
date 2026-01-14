import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { SubLedger, GeneralLedger } from '../../types';

export default function SubLedgers() {
  const { activeProject } = useProject();
  const [subLedgers, setSubLedgers] = useState<SubLedger[]>([]);
  const [generalLedgers, setGeneralLedgers] = useState<GeneralLedger[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubLedger, setEditingSubLedger] = useState<SubLedger | null>(null);
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
      if (editingSubLedger) {
        await api.put(`/projects/${activeProject?._id}/sub-ledgers/${editingSubLedger._id}`, formData);
        setEditingSubLedger(null);
      } else {
        await api.post(`/projects/${activeProject?._id}/sub-ledgers`, formData);
      }
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
      alert(error.response?.data?.message || `Failed to ${editingSubLedger ? 'update' : 'create'} sub ledger`);
    }
  };

  const handleEdit = (subLedger: SubLedger) => {
    setEditingSubLedger(subLedger);
    setFormData({
      subLedgerName: subLedger.subLedgerName,
      alias: subLedger.alias,
      generalLedger: typeof subLedger.generalLedger === 'object' ? subLedger.generalLedger._id : subLedger.generalLedger,
      openingBalance: subLedger.openingBalance,
      openingBalanceType: subLedger.openingBalanceType,
      description: subLedger.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (subLedgerId: string) => {
    if (!confirm('Are you sure you want to delete this sub ledger? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/projects/${activeProject?._id}/sub-ledgers/${subLedgerId}`);
      fetchSubLedgers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete sub ledger');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubLedger(null);
    setFormData({
      subLedgerName: '',
      alias: '',
      generalLedger: '',
      openingBalance: 0,
      openingBalanceType: 'debit',
      description: '',
    });
  };

  if (!activeProject) {
    return <div>Please load a project first</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sub Ledgers</h2>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
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
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {editingSubLedger ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Ledger Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alias</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">General Ledger</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(subLedger)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subLedger._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

