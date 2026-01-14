// import { useState, useEffect } from 'react';
// import { useProject } from '../../context/ProjectContext';
// import { useSearchParams, useParams } from 'react-router-dom';
// import api from '../../lib/api/axios';
// import { format } from 'date-fns';

// export default function Reports() {
//   const { activeProject } = useProject();
//   const { type: reportTypeFromParam } = useParams();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const reportTypeFromUrl = reportTypeFromParam || searchParams.get('type') || null;
//   const [activeReport, setActiveReport] = useState<string | null>(reportTypeFromUrl);
//   const [dateFrom, setDateFrom] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
//   const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [asOfDate, setAsOfDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [reportData, setReportData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (reportTypeFromUrl && activeProject) {
//       fetchReport(reportTypeFromUrl);
//     }
//   }, [reportTypeFromUrl, activeProject]);

//   const fetchReport = async (reportType: string) => {
//     if (!activeProject) return;

//     setLoading(true);
//     try {
//       let response;
//       if (reportType === 'balance-sheet') {
//         response = await api.get(`/projects/${activeProject._id}/reports/${reportType}`, {
//           params: { asOfDate },
//         });
//       } else {
//         response = await api.get(`/projects/${activeProject._id}/reports/${reportType}`, {
//           params: { from: dateFrom, to: dateTo },
//         });
//       }
//       setReportData(response.data);
//       setActiveReport(reportType);
//       setSearchParams({ type: reportType });
//     } catch (error) {
//       console.error('Failed to fetch report:', error);
//       alert('Failed to fetch report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderReportTable = () => {
//     if (!reportData || !activeReport) return null;

//     // Trial Balance
//     if (activeReport === 'trial-balance' && reportData.ledgers) {
//       return (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ledger Name</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {reportData.ledgers.map((ledger: any, idx: number) => (
//                 <tr key={idx}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {ledger.ledgerName || ledger.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {ledger.debit?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {ledger.credit?.toFixed(2) || '0.00'}
//                   </td>
//                 </tr>
//               ))}
//               {reportData.total && (
//                 <tr className="bg-gray-50 font-semibold">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                     {reportData.total.debit?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                     {reportData.total.credit?.toFixed(2) || '0.00'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       );
//     }

//     // Income Statement
//     if (activeReport === 'income-statement' && reportData.sections) {
//       return (
//         <div className="space-y-6">
//           {reportData.sections.map((section: any, idx: number) => (
//             <div key={idx} className="overflow-x-auto">
//               <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {section.items?.map((item: any, itemIdx: number) => (
//                     <tr key={itemIdx}>
//                       <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                         {item.amount?.toFixed(2) || '0.00'}
//                       </td>
//                     </tr>
//                   ))}
//                   {section.total && (
//                     <tr className="bg-gray-50 font-semibold">
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">{section.total.label || 'Total'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                         {section.total.amount?.toFixed(2) || '0.00'}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     // Balance Sheet
//     if (activeReport === 'balance-sheet' && reportData.assets && reportData.liabilities) {
//       return (
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Assets</h3>
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {reportData.assets.map((item: any, idx: number) => (
//                   <tr key={idx}>
//                     <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                       {item.amount?.toFixed(2) || '0.00'}
//                     </td>
//                   </tr>
//                 ))}
//                 {reportData.totalAssets && (
//                   <tr className="bg-gray-50 font-semibold">
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Assets</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                       {reportData.totalAssets?.toFixed(2) || '0.00'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Liabilities & Equity</h3>
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {reportData.liabilities.map((item: any, idx: number) => (
//                   <tr key={idx}>
//                     <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                       {item.amount?.toFixed(2) || '0.00'}
//                     </td>
//                   </tr>
//                 ))}
//                 {reportData.totalLiabilities && (
//                   <tr className="bg-gray-50 font-semibold">
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Liabilities & Equity</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                       {reportData.totalLiabilities?.toFixed(2) || '0.00'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       );
//     }

//     // Budget vs Expenditure
//     if (activeReport === 'budget-vs-expenditure' && reportData.items) {
//       return (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budget</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expenditure</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Utilized</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {reportData.items.map((item: any, idx: number) => (
//                 <tr key={idx}>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.accountName}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {item.budget?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {item.expenditure?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
//                     (item.variance || 0) < 0 ? 'text-red-600' : 'text-gray-500'
//                   }`}>
//                     {item.variance?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {item.utilizationPercentage?.toFixed(2) || '0.00'}%
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     }

//     // Fund Accountability or other reports - fallback to JSON
//     return (
//       <pre className="bg-gray-50 p-4 rounded overflow-auto">
//         {JSON.stringify(reportData, null, 2)}
//       </pre>
//     );
//   };

//   if (!activeProject) {
//     return <div>Please load a project first</div>;
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               From Date
//             </label>
//             <input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               To Date
//             </label>
//             <input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//             />
//           </div>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             As Of Date (for Balance Sheet)
//           </label>
//           <input
//             type="date"
//             value={asOfDate}
//             onChange={(e) => setAsOfDate(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           <button
//             onClick={() => fetchReport('trial-balance')}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
//               activeReport === 'trial-balance'
//                 ? 'bg-blue-700 text-white'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             Trial Balance
//           </button>
//           <button
//             onClick={() => fetchReport('income-statement')}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
//               activeReport === 'income-statement'
//                 ? 'bg-blue-700 text-white'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             Income Statement
//           </button>
//           <button
//             onClick={() => fetchReport('balance-sheet')}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
//               activeReport === 'balance-sheet'
//                 ? 'bg-blue-700 text-white'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             Balance Sheet
//           </button>
//           <button
//             onClick={() => fetchReport('fund-accountability')}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
//               activeReport === 'fund-accountability'
//                 ? 'bg-blue-700 text-white'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             Fund Accountability
//           </button>
//           <button
//             onClick={() => fetchReport('budget-vs-expenditure')}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
//               activeReport === 'budget-vs-expenditure'
//                 ? 'bg-blue-700 text-white'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             Budget vs Expenditure
//           </button>
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center py-8">Loading report...</div>
//       )}

//       {reportData && activeReport && !loading && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold">
//               {activeReport.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               {activeReport === 'balance-sheet' 
//                 ? `As of ${new Date(asOfDate).toLocaleDateString()}`
//                 : `From ${new Date(dateFrom).toLocaleDateString()} to ${new Date(dateTo).toLocaleDateString()}`
//               }
//             </p>
//           </div>
//           {renderReportTable()}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useSearchParams, useParams } from 'react-router-dom';
import api from '../../lib/api/axios';
import { format } from 'date-fns';

export default function Reports() {
  const { activeProject } = useProject();
  const { type: reportTypeFromParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const reportTypeFromUrl = reportTypeFromParam || searchParams.get('type') || null;
  const [activeReport, setActiveReport] = useState<string | null>(reportTypeFromUrl);
  const [dateFrom, setDateFrom] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [asOfDate, setAsOfDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportTypeFromUrl && activeProject) {
      fetchReport(reportTypeFromUrl);
    }
  }, [reportTypeFromUrl, activeProject]);

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
      
      // 🔍 DEBUG: Log the response to see what we're getting
      console.log('Report Type:', reportType);
      console.log('Response Data:', response.data);
      
      setReportData(response.data);
      setActiveReport(reportType);
      setSearchParams({ type: reportType });
    } catch (error) {
      console.error('Failed to fetch report:', error);
      alert('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const renderReportTable = () => {
    if (!reportData || !activeReport) return null;

    // 🔍 DEBUG: Log what we're trying to render
    console.log('Rendering report:', activeReport);
    console.log('Report data:', reportData);

    // Trial Balance
    if (activeReport === 'trial-balance') {
      // Check if data has the correct structure
      if (!reportData.ledgers || !Array.isArray(reportData.ledgers)) {
        return (
          <div className="text-red-600 p-4">
            <p>Invalid trial balance data structure. Expected 'ledgers' array.</p>
            <pre className="bg-gray-50 p-4 rounded overflow-auto mt-2">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ledger Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.ledgers.map((ledger: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ledger.ledgerName || ledger.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {ledger.debit?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {ledger.credit?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              ))}
              {(reportData.totalDebit !== undefined || reportData.totalCredit !== undefined) && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.totalDebit?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.totalCredit?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    // Income Statement
    if (activeReport === 'income-statement') {
      // Check structure
      if (!reportData.revenue && !reportData.expense) {
        return (
          <div className="text-red-600 p-4">
            <p>Invalid income statement data structure. Expected 'revenue' and 'expense' objects.</p>
            <pre className="bg-gray-50 p-4 rounded overflow-auto mt-2">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          {/* Revenue Section */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.revenue?.accounts?.map((item: any, itemIdx: number) => (
                  <tr key={itemIdx}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.amount?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
                {(!reportData.revenue?.accounts || reportData.revenue.accounts.length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                      No revenue accounts found
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Revenue</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.revenue?.total?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Expense Section */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">Expenses</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.expense?.accounts?.map((item: any, itemIdx: number) => (
                  <tr key={itemIdx}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.amount?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
                {(!reportData.expense?.accounts || reportData.expense.accounts.length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                      No expense accounts found
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Expenses</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.expense?.total?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Income */}
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                Net {reportData.netIncomeType === 'profit' ? 'Income' : 'Loss'}
              </span>
              <span className={`text-lg font-bold ${
                reportData.netIncomeType === 'profit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(reportData.netIncome || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Balance Sheet - ✅ FIXED TO MATCH BACKEND STRUCTURE
    if (activeReport === 'balance-sheet') {
      // Check structure - backend returns nested 'accounts' arrays
      if (!reportData.assets?.accounts || !Array.isArray(reportData.assets.accounts)) {
        return (
          <div className="text-red-600 p-4">
            <p>Invalid balance sheet data structure. Expected 'assets.accounts' to be an array.</p>
            <pre className="bg-gray-50 p-4 rounded overflow-auto mt-2">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assets */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Assets</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.assets.accounts.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.amount?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
                {reportData.assets.accounts.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                      No assets found
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Assets</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.assets.total?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Liabilities & Equity */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liabilities & Equity</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Liabilities */}
                {reportData.liabilities?.accounts?.map((item: any, idx: number) => (
                  <tr key={`liab-${idx}`}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.amount?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
                
                {/* Subtotal for Liabilities */}
                {reportData.liabilities?.accounts?.length > 0 && (
                  <tr className="bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Total Liabilities</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
                      {reportData.liabilities.total?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                )}

                {/* Equity */}
                {reportData.equity?.accounts?.map((item: any, idx: number) => (
                  <tr key={`equity-${idx}`}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.amount?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}

                {/* Subtotal for Equity */}
                {reportData.equity?.accounts?.length > 0 && (
                  <tr className="bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Total Equity</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
                      {reportData.equity.total?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                )}

                {(!reportData.liabilities?.accounts?.length && !reportData.equity?.accounts?.length) && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                      No liabilities or equity found
                    </td>
                  </tr>
                )}

                {/* Grand Total */}
                <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Liabilities & Equity</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {((reportData.liabilities?.total || 0) + (reportData.equity?.total || 0)).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Budget vs Expenditure - ✅ FIXED TO MATCH BACKEND STRUCTURE
    if (activeReport === 'budget-vs-expenditure') {
      if (!reportData.lineItems || !Array.isArray(reportData.lineItems)) {
        return (
          <div className="text-red-600 p-4">
            <p>Invalid budget vs expenditure data structure. Expected 'lineItems' array.</p>
            <pre className="bg-gray-50 p-4 rounded overflow-auto mt-2">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Variance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.lineItems.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.ledgerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.budgeted?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.actual?.toFixed(2) || '0.00'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                    (item.variance || 0) < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {item.variance?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.variancePercent?.toFixed(2) || '0.00'}%
                  </td>
                </tr>
              ))}
              {reportData.lineItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                    No budget items found
                  </td>
                </tr>
              )}
              {reportData.summary && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.summary.totalBudgeted?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.summary.totalActual?.toFixed(2) || '0.00'}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    // Fund Accountability - ✅ FIXED TO MATCH BACKEND STRUCTURE
    if (activeReport === 'fund-accountability') {
      if (!reportData.lineItems || !Array.isArray(reportData.lineItems)) {
        return (
          <div className="text-yellow-600 p-4">
            <p>Fund Accountability Report</p>
            <pre className="bg-gray-50 p-4 rounded overflow-auto mt-2">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budgeted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.lineItems.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.description || item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.budgeted?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.actual?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.variance?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              ))}
              {reportData.lineItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                    No fund accountability items found
                  </td>
                </tr>
              )}
              {reportData.summary && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.summary.totalBudgeted?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.summary.totalActual?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {reportData.summary.totalVariance?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    // Fallback for unknown reports
    return (
      <div>
        <p className="text-yellow-600 mb-4">No specific renderer for this report type yet. Showing raw data:</p>
        <pre className="bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(reportData, null, 2)}
        </pre>
      </div>
    );
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
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              activeReport === 'trial-balance'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Trial Balance
          </button>
          <button
            onClick={() => fetchReport('income-statement')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              activeReport === 'income-statement'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Income Statement
          </button>
          <button
            onClick={() => fetchReport('balance-sheet')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              activeReport === 'balance-sheet'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => fetchReport('fund-accountability')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              activeReport === 'fund-accountability'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Fund Accountability
          </button>
          <button
            onClick={() => fetchReport('budget-vs-expenditure')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              activeReport === 'budget-vs-expenditure'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
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
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {activeReport.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeReport === 'balance-sheet' 
                ? `As of ${new Date(asOfDate).toLocaleDateString()}`
                : `From ${new Date(dateFrom).toLocaleDateString()} to ${new Date(dateTo).toLocaleDateString()}`
              }
            </p>
          </div>
          {renderReportTable()}
        </div>
      )}
    </div>
  );
}