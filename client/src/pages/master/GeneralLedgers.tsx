import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { GeneralLedger, LedgerGroup } from '../../types';

export default function GeneralLedgers() {
  const { activeProject } = useProject();
  const [generalLedgers, setGeneralLedgers] = useState<GeneralLedger[]>([]);
  const [ledgerGroups, setLedgerGroups] = useState<LedgerGroup[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLedger, setEditingLedger] = useState<GeneralLedger | null>(null);
  const [formData, setFormData] = useState({
    ledgerName: '',
    alias: '',
    ledgerGroup: '',
    openingBalance: 0,
    openingBalanceType: 'debit' as 'debit' | 'credit',
    description: '',
  });

  useEffect(() => {
    if (activeProject) {
      fetchGeneralLedgers();
      fetchLedgerGroups();
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

  const fetchLedgerGroups = async () => {
    try {
      const response = await api.get(`/projects/${activeProject?._id}/ledger-groups`);
      setLedgerGroups(response.data.ledgerGroups);
    } catch (error) {
      console.error('Failed to fetch ledger groups:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLedger) {
        await api.put(`/projects/${activeProject?._id}/general-ledgers/${editingLedger._id}`, formData);
        setEditingLedger(null);
      } else {
        await api.post(`/projects/${activeProject?._id}/general-ledgers`, formData);
      }
      setShowForm(false);
      setFormData({
        ledgerName: '',
        alias: '',
        ledgerGroup: '',
        openingBalance: 0,
        openingBalanceType: 'debit',
        description: '',
      });
      fetchGeneralLedgers();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${editingLedger ? 'update' : 'create'} general ledger`);
    }
  };

  const handleEdit = (ledger: GeneralLedger) => {
    setEditingLedger(ledger);
    setFormData({
      ledgerName: ledger.ledgerName,
      alias: ledger.alias,
      ledgerGroup: typeof ledger.ledgerGroup === 'object' ? ledger.ledgerGroup._id : ledger.ledgerGroup,
      openingBalance: ledger.openingBalance,
      openingBalanceType: ledger.openingBalanceType,
      description: ledger.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (ledgerId: string) => {
    if (!confirm('Are you sure you want to delete this general ledger? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/projects/${activeProject?._id}/general-ledgers/${ledgerId}`);
      fetchGeneralLedgers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete general ledger');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLedger(null);
    setFormData({
      ledgerName: '',
      alias: '',
      ledgerGroup: '',
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
        <h2 className="text-xl font-semibold">General Ledgers</h2>
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
                Ledger Name *
              </label>
              <input
                type="text"
                required
                value={formData.ledgerName}
                onChange={(e) => setFormData({ ...formData, ledgerName: e.target.value })}
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
              Ledger Group *
            </label>
            <select
              required
              value={formData.ledgerGroup}
              onChange={(e) => setFormData({ ...formData, ledgerGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Ledger Group</option>
              {ledgerGroups.map((lg) => (
                <option key={lg._id} value={lg._id}>
                  {lg.groupName}
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
              {editingLedger ? 'Update' : 'Create'}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ledger Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alias</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ledger Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {generalLedgers.map((ledger) => (
              <tr key={ledger._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ledger.ledgerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ledger.alias}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof ledger.ledgerGroup === 'object' ? ledger.ledgerGroup.groupName : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(ledger)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ledger._id)}
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

