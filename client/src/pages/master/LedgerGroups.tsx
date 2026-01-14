import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { LedgerGroup, AccountType } from '../../types';

export default function LedgerGroups() {
  const { activeProject } = useProject();
  const [ledgerGroups, setLedgerGroups] = useState<LedgerGroup[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LedgerGroup | null>(null);
  const [formData, setFormData] = useState({
    groupName: '',
    alias: '',
    accountType: '',
    remarks: '',
  });

  useEffect(() => {
    if (activeProject) {
      fetchLedgerGroups();
      fetchAccountTypes();
    }
  }, [activeProject]);

  const fetchLedgerGroups = async () => {
    try {
      const response = await api.get(`/projects/${activeProject?._id}/ledger-groups`);
      setLedgerGroups(response.data.ledgerGroups);
    } catch (error) {
      console.error('Failed to fetch ledger groups:', error);
    }
  };

  const fetchAccountTypes = async () => {
    try {
      const response = await api.get('/account-types');
      setAccountTypes(response.data.accountTypes);
    } catch (error) {
      console.error('Failed to fetch account types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await api.put(`/projects/${activeProject?._id}/ledger-groups/${editingGroup._id}`, formData);
        setEditingGroup(null);
      } else {
        await api.post(`/projects/${activeProject?._id}/ledger-groups`, formData);
      }
      setShowForm(false);
      setFormData({ groupName: '', alias: '', accountType: '', remarks: '' });
      fetchLedgerGroups();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${editingGroup ? 'update' : 'create'} ledger group`);
    }
  };

  const handleEdit = (group: LedgerGroup) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      alias: group.alias,
      accountType: typeof group.accountType === 'object' ? group.accountType._id : group.accountType,
      remarks: group.remarks || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this ledger group? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/projects/${activeProject?._id}/ledger-groups/${groupId}`);
      fetchLedgerGroups();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete ledger group');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
    setFormData({ groupName: '', alias: '', accountType: '', remarks: '' });
  };

  if (!activeProject) {
    return <div>Please load a project first</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ledger Groups</h2>
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
                Group Name *
              </label>
              <input
                type="text"
                required
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
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
              Account Type *
            </label>
            <select
              required
              value={formData.accountType}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Account Type</option>
              {accountTypes.map((at) => (
                <option key={at._id} value={at._id}>
                  {at.name} ({at.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {editingGroup ? 'Update' : 'Create'}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alias</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerGroups.map((group) => (
              <tr key={group._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {group.groupName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {group.alias}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof group.accountType === 'object' ? group.accountType.name : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(group)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(group._id)}
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

