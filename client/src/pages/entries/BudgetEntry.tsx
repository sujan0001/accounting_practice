import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { Budget, GeneralLedger, SubLedger } from '../../types';

export default function BudgetEntry() {
  const { activeProject } = useProject();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [generalLedgers, setGeneralLedgers] = useState<GeneralLedger[]>([]);
  const [subLedgers, setSubLedgers] = useState<SubLedger[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    budgetNo: '',
    approvedDate: '',
    approvedBy: '',
    lineItems: [] as Array<{
      serialNo: number;
      generalLedger: string;
      subLedger?: string;
      district?: string;
      period?: string;
      amount: number;
      narration?: string;
    }>,
    totalAmount: 0,
  });

  useEffect(() => {
    if (activeProject) {
      fetchBudgets();
      fetchGeneralLedgers();
      fetchSubLedgers();
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

  const fetchBudgets = async () => {
    try {
      const response = await api.get(`/projects/${activeProject?._id}/budgets`);
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
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

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [
        ...formData.lineItems,
        {
          serialNo: formData.lineItems.length + 1,
          generalLedger: '',
          amount: 0,
        },
      ],
    });
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...formData.lineItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // If general ledger changes, clear sub ledger
    if (field === 'generalLedger') {
      updated[index].subLedger = '';
    }
    
    setFormData({
      ...formData,
      lineItems: updated,
      totalAmount: updated.reduce((sum, item) => sum + (item.amount || 0), 0),
    });
  };

  const getSubLedgersForGL = (generalLedgerId: string): SubLedger[] => {
    return subLedgers.filter((sl) => {
      if (typeof sl.generalLedger === 'object') {
        return sl.generalLedger._id === generalLedgerId;
      }
      return sl.generalLedger === generalLedgerId;
    });
  };

  const removeLineItem = (index: number) => {
    const updated = formData.lineItems.filter((_, i) => i !== index);
    updated.forEach((item, i) => {
      item.serialNo = i + 1;
    });
    setFormData({
      ...formData,
      lineItems: updated,
      totalAmount: updated.reduce((sum, item) => sum + (item.amount || 0), 0),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${activeProject?._id}/budgets`, formData);
      setShowForm(false);
      setFormData({
        budgetNo: '',
        approvedDate: '',
        approvedBy: '',
        lineItems: [],
        totalAmount: 0,
      });
      fetchBudgets();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create budget');
    }
  };

  if (!activeProject) {
    return <div>Please load a project first</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budget Entry</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : 'Create New Budget'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Budget</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Voucher Number
                </label>
                <input
                  type="text"
                  value={formData.budgetNo}
                  placeholder="Auto-generated if left empty"
                  onChange={(e) => setFormData({ ...formData, budgetNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.approvedDate}
                  onChange={(e) => setFormData({ ...formData, approvedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approved By
              </label>
              <input
                type="text"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Line Items</label>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  Add Line
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">S.No</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Account Head (General Ledger) *</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Sub Head (Sub Ledger)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">District</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Period</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Amount *</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.lineItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm">{item.serialNo}</td>
                        <td className="px-3 py-2">
                          <select
                            required
                            value={item.generalLedger}
                            onChange={(e) => updateLineItem(index, 'generalLedger', e.target.value)}
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
                          <select
                            value={item.subLedger || ''}
                            onChange={(e) => updateLineItem(index, 'subLedger', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            disabled={!item.generalLedger}
                          >
                            <option value="">Select Sub Ledger</option>
                            {item.generalLedger &&
                              getSubLedgersForGL(item.generalLedger).map((sl) => (
                                <option key={sl._id} value={sl._id}>
                                  {sl.subLedgerName}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.district || ''}
                            onChange={(e) => updateLineItem(index, 'district', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.period || ''}
                            onChange={(e) => updateLineItem(index, 'period', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={item.amount || 0}
                            onChange={(e) => {
                              updateLineItem(index, 'amount', parseFloat(e.target.value) || 0);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => removeLineItem(index)}
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

            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount:</p>
                <p className="text-xl font-bold text-gray-900">{formData.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={formData.lineItems.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Create Budget
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {budgets.map((budget) => (
              <tr key={budget._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {budget.budgetNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(budget.approvedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {budget.approvedBy || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {budget.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

