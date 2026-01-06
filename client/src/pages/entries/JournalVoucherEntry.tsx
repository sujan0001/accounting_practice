import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { JournalVoucher, GeneralLedger, SubLedger } from '../../types';

export default function JournalVoucherEntry() {
  const { activeProject } = useProject();
  const [vouchers, setVouchers] = useState<JournalVoucher[]>([]);
  const [generalLedgers, setGeneralLedgers] = useState<GeneralLedger[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    narration: '',
    entries: [] as Array<{
      serialNo: number;
      generalLedger: string;
      subLedger?: string;
      debitAmount: number;
      creditAmount: number;
      narration?: string;
    }>,
    totalDebit: 0,
    totalCredit: 0,
  });

  useEffect(() => {
    if (activeProject) {
      fetchVouchers();
      fetchGeneralLedgers();
    }
  }, [activeProject]);

  const fetchVouchers = async () => {
    try {
      const response = await api.get(`/projects/${activeProject?._id}/journal-vouchers`);
      setVouchers(response.data.vouchers);
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
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

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [
        ...formData.entries,
        {
          serialNo: formData.entries.length + 1,
          generalLedger: '',
          debitAmount: 0,
          creditAmount: 0,
        },
      ],
    });
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...formData.entries];
    updated[index] = { ...updated[index], [field]: value };
    
    // If debit is set, clear credit and vice versa
    if (field === 'debitAmount' && value > 0) {
      updated[index].creditAmount = 0;
    }
    if (field === 'creditAmount' && value > 0) {
      updated[index].debitAmount = 0;
    }

    const totalDebit = updated.reduce((sum, e) => sum + (e.debitAmount || 0), 0);
    const totalCredit = updated.reduce((sum, e) => sum + (e.creditAmount || 0), 0);

    setFormData({
      ...formData,
      entries: updated,
      totalDebit,
      totalCredit,
    });
  };

  const removeEntry = (index: number) => {
    const updated = formData.entries.filter((_, i) => i !== index);
    updated.forEach((item, i) => {
      item.serialNo = i + 1;
    });
    const totalDebit = updated.reduce((sum, e) => sum + (e.debitAmount || 0), 0);
    const totalCredit = updated.reduce((sum, e) => sum + (e.creditAmount || 0), 0);
    setFormData({
      ...formData,
      entries: updated,
      totalDebit,
      totalCredit,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate balance
    if (Math.abs(formData.totalDebit - formData.totalCredit) > 0.01) {
      alert('Journal voucher must be balanced. Debit must equal Credit.');
      return;
    }

    if (formData.entries.length < 2) {
      alert('Journal voucher must have at least 2 entries');
      return;
    }

    try {
      await api.post(`/projects/${activeProject?._id}/journal-vouchers`, formData);
      setShowForm(false);
      setFormData({
        date: '',
        narration: '',
        entries: [],
        totalDebit: 0,
        totalCredit: 0,
      });
      fetchVouchers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create journal voucher');
    }
  };

  if (!activeProject) {
    return <div>Please load a project first</div>;
  }

  const isBalanced = Math.abs(formData.totalDebit - formData.totalCredit) < 0.01;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Journal Voucher Entry</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : 'Create New Voucher'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Journal Voucher</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Narration
                </label>
                <input
                  type="text"
                  value={formData.narration}
                  onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Entries</label>
                <button
                  type="button"
                  onClick={addEntry}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  Add Entry
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">S.No</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">General Ledger *</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Sub Ledger</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Debit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Credit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Narration</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.entries.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm">{entry.serialNo}</td>
                        <td className="px-3 py-2">
                          <select
                            required
                            value={entry.generalLedger}
                            onChange={(e) => updateEntry(index, 'generalLedger', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select</option>
                            {generalLedgers.map((gl) => (
                              <option key={gl._id} value={gl._id}>
                                {gl.ledgerName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={entry.subLedger || ''}
                            onChange={(e) => updateEntry(index, 'subLedger', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={entry.debitAmount || 0}
                            onChange={(e) => updateEntry(index, 'debitAmount', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={entry.creditAmount || 0}
                            onChange={(e) => updateEntry(index, 'creditAmount', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={entry.narration || ''}
                            onChange={(e) => updateEntry(index, 'narration', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => removeEntry(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Debit:</p>
                <p className="text-xl font-bold text-gray-900">{formData.totalDebit.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Credit:</p>
                <p className={`text-xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.totalCredit.toFixed(2)}
                </p>
              </div>
              {!isBalanced && (
                <div className="text-right">
                  <p className="text-sm text-red-600">Difference:</p>
                  <p className="text-xl font-bold text-red-600">
                    {Math.abs(formData.totalDebit - formData.totalCredit).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isBalanced || formData.entries.length < 2}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Create Voucher
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Narration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Debit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Credit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vouchers.map((voucher) => (
              <tr key={voucher._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {voucher.voucherNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(voucher.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {voucher.narration || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {voucher.totalDebit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {voucher.totalCredit.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

