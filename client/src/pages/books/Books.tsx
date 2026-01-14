// import { useState, useEffect } from 'react';
// import { useProject } from '../../context/ProjectContext';
// import api from '../../lib/api/axios';
// import { format } from 'date-fns';
// import { GeneralLedger, SubLedger } from '../../types';

// export default function Books() {
//   const { activeProject } = useProject();
//   const [activeBook, setActiveBook] = useState<string | null>(null);
//   const [dateFrom, setDateFrom] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
//   const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [generalLedgers, setGeneralLedgers] = useState<GeneralLedger[]>([]);
//   const [subLedgers, setSubLedgers] = useState<SubLedger[]>([]);
//   const [selectedLedgerId, setSelectedLedgerId] = useState('');
//   const [selectedSubLedgerId, setSelectedSubLedgerId] = useState('');
//   const [bookData, setBookData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (activeProject) {
//       fetchGeneralLedgers();
//       fetchSubLedgers();
//     }
//   }, [activeProject]);

//   const fetchGeneralLedgers = async () => {
//     try {
//       const response = await api.get(`/projects/${activeProject?._id}/general-ledgers`);
//       setGeneralLedgers(response.data.generalLedgers);
//     } catch (error) {
//       console.error('Failed to fetch general ledgers:', error);
//     }
//   };

//   const fetchSubLedgers = async () => {
//     try {
//       const response = await api.get(`/projects/${activeProject?._id}/sub-ledgers`);
//       setSubLedgers(response.data.subLedgers);
//     } catch (error) {
//       console.error('Failed to fetch sub ledgers:', error);
//     }
//   };

//   const fetchBook = async (bookType: string) => {
//     if (!activeProject) return;

//     setLoading(true);
//     try {
//       let response;
//       const params: any = { from: dateFrom, to: dateTo };

//       if (bookType === 'general-ledger') {
//         if (!selectedLedgerId) {
//           alert('Please select a general ledger');
//           setLoading(false);
//           return;
//         }
//         params.ledgerId = selectedLedgerId;
//       } else if (bookType === 'sub-ledger') {
//         if (!selectedSubLedgerId) {
//           alert('Please select a sub ledger');
//           setLoading(false);
//           return;
//         }
//         params.subLedgerId = selectedSubLedgerId;
//       }

//       response = await api.get(`/projects/${activeProject._id}/books/${bookType}`, { params });
//       setBookData(response.data);
//       setActiveBook(bookType);
//     } catch (error) {
//       console.error('Failed to fetch book:', error);
//       alert('Failed to fetch book');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderBookTable = () => {
//     if (!bookData || !activeBook) return null;

//     // General Ledger Book
//     if (activeBook === 'general-ledger' && bookData.entries) {
//       return (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Particulars</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {bookData.entries.map((entry: any, idx: number) => (
//                 <tr key={idx}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(entry.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {entry.voucherNo || '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{entry.particulars || entry.narration || '-'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {entry.debit?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {entry.credit?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
//                     {entry.balance?.toFixed(2) || '0.00'}
//                   </td>
//                 </tr>
//               ))}
//               {bookData.closingBalance !== undefined && (
//                 <tr className="bg-gray-50 font-semibold">
//                   <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
//                     Closing Balance
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
//                     {bookData.closingBalance.toFixed(2)}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       );
//     }

//     // Sub Ledger Book
//     if (activeBook === 'sub-ledger' && bookData.entries) {
//       return (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Particulars</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {bookData.entries.map((entry: any, idx: number) => (
//                 <tr key={idx}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(entry.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {entry.voucherNo || '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{entry.particulars || entry.narration || '-'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {entry.debit?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                     {entry.credit?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
//                     {entry.balance?.toFixed(2) || '0.00'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     }

//     // Cash/Bank Book
//     if (activeBook === 'cash-bank' && bookData.entries) {
//       return (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Particulars</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Receipt</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Payment</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {bookData.entries.map((entry: any, idx: number) => (
//                 <tr key={idx}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(entry.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {entry.voucherNo || '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{entry.particulars || entry.narration || '-'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
//                     {entry.receipt?.toFixed(2) || entry.debit?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
//                     {entry.payment?.toFixed(2) || entry.credit?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
//                     {entry.balance?.toFixed(2) || '0.00'}
//                   </td>
//                 </tr>
//               ))}
//               {bookData.closingBalance !== undefined && (
//                 <tr className="bg-gray-50 font-semibold">
//                   <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
//                     Closing Balance
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
//                     {bookData.closingBalance.toFixed(2)}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       );
//     }

//     // Fallback to JSON
//     return (
//       <pre className="bg-gray-50 p-4 rounded overflow-auto">
//         {JSON.stringify(bookData, null, 2)}
//       </pre>
//     );
//   };

//   if (!activeProject) {
//     return <div>Please load a project first</div>;
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Books</h1>

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

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               General Ledger (for GL Book)
//             </label>
//             <select
//               value={selectedLedgerId}
//               onChange={(e) => setSelectedLedgerId(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//             >
//               <option value="">Select General Ledger</option>
//               {generalLedgers.map((gl) => (
//                 <option key={gl._id} value={gl._id}>
//                   {gl.ledgerName}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Sub Ledger (for Sub Ledger Book)
//             </label>
//             <select
//               value={selectedSubLedgerId}
//               onChange={(e) => setSelectedSubLedgerId(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//             >
//               <option value="">Select Sub Ledger</option>
//               {subLedgers.map((sl) => (
//                 <option key={sl._id} value={sl._id}>
//                   {sl.subLedgerName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button
//             onClick={() => fetchBook('general-ledger')}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
//               activeBook === 'general-ledger'
//                 ? 'bg-blue-700 text-white'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             General Ledger Book
//           </button>
//           <button
//             onClick={() => fetchBook('sub-ledger')}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
//               activeBook === 'sub-ledger'
//                 ? 'bg-blue-700 text-white'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             Sub Ledger Book
//           </button>
//           <button
//             onClick={() => fetchBook('cash-bank')}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
//               activeBook === 'cash-bank'
//                 ? 'bg-blue-700 text-white'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             Cash/Bank Book
//           </button>
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center py-8">Loading book...</div>
//       )}

//       {bookData && activeBook && !loading && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold">
//               {activeBook.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               From {new Date(dateFrom).toLocaleDateString()} to {new Date(dateTo).toLocaleDateString()}
//             </p>
//           </div>
//           {renderBookTable()}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../lib/api/axios';
import { format } from 'date-fns';
import { GeneralLedger, SubLedger } from '../../types';

export default function Books() {
  const { activeProject } = useProject();
  const [activeBook, setActiveBook] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [generalLedgers, setGeneralLedgers] = useState<GeneralLedger[]>([]);
  const [subLedgers, setSubLedgers] = useState<SubLedger[]>([]);
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  const [selectedSubLedgerId, setSelectedSubLedgerId] = useState('');
  const [bookData, setBookData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeProject) {
      fetchGeneralLedgers();
      fetchSubLedgers();
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

  const fetchSubLedgers = async () => {
    try {
      const response = await api.get(`/projects/${activeProject?._id}/sub-ledgers`);
      setSubLedgers(response.data.subLedgers);
    } catch (error) {
      console.error('Failed to fetch sub ledgers:', error);
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
      
      console.log('Book Type:', bookType);
      console.log('Book Data:', response.data);
      
      setBookData(response.data);
      setActiveBook(bookType);
    } catch (error) {
      console.error('Failed to fetch book:', error);
      alert('Failed to fetch book');
    } finally {
      setLoading(false);
    }
  };

  const renderBookTable = () => {
    if (!bookData || !activeBook) return null;

    console.log('Rendering book:', activeBook);
    console.log('Book data structure:', bookData);

    // General Ledger Book - ✅ FIXED TO MATCH BACKEND
    if (activeBook === 'general-ledger') {
      if (!bookData.ledger || !bookData.transactions) {
        return (
          <div className="text-red-600 p-4">
            <p>Invalid general ledger book data structure</p>
            <pre className="bg-gray-50 p-4 rounded overflow-auto mt-2">
              {JSON.stringify(bookData, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {/* Ledger Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{bookData.ledger.name}</h3>
            <p className="text-sm text-gray-600">
              Group: {bookData.ledger.group} | Opening Balance: {bookData.ledger.openingBalance?.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Narration</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookData.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  bookData.transactions.map((entry: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.voucherNo || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.narration || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {entry.debit?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {entry.credit?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {entry.balance?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))
                )}
                {bookData.summary && (
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {bookData.summary.totalDebit?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {bookData.summary.totalCredit?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {bookData.summary.closingBalance?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Sub Ledger Book
    if (activeBook === 'sub-ledger') {
      if (!bookData.subLedger || !bookData.transactions) {
        return (
          <div className="text-red-600 p-4">
            <p>Invalid sub ledger book data structure</p>
            <pre className="bg-gray-50 p-4 rounded overflow-auto mt-2">
              {JSON.stringify(bookData, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {/* Sub Ledger Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{bookData.subLedger.name}</h3>
            <p className="text-sm text-gray-600">
              Opening Balance: {bookData.subLedger.openingBalance?.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Narration</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookData.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  bookData.transactions.map((entry: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.voucherNo || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.narration || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {entry.debit?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {entry.credit?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {entry.balance?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))
                )}
                {bookData.summary && (
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {bookData.summary.totalDebit?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {bookData.summary.totalCredit?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {bookData.summary.closingBalance?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Cash/Bank Book - ✅ FIXED TO MATCH BACKEND
    if (activeBook === 'cash-bank') {
      if (!bookData.ledgers || !bookData.transactions) {
        return (
          <div className="text-red-600 p-4">
            <p>Invalid cash/bank book data structure</p>
            <pre className="bg-gray-50 p-4 rounded overflow-auto mt-2">
              {JSON.stringify(bookData, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {/* Ledger Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bookData.ledgers.map((ledger: any, idx: number) => (
              <div key={idx} className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold">{ledger.ledgerName}</h3>
                <p className="text-sm text-gray-600">
                  Opening: {ledger.openingBalance?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  Current: {ledger.currentBalance?.toFixed(2) || '0.00'}
                </p>
              </div>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ledger</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Narration</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookData.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  bookData.transactions.map((entry: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.voucherNo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.ledgerName || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.narration || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                        {entry.debit?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                        {entry.credit?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {entry.balance?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))
                )}
                {bookData.summary && (
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {bookData.summary.totalDebit?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {bookData.summary.totalCredit?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {bookData.summary.totalBalance?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Fallback to JSON
    return (
      <div>
        <p className="text-yellow-600 mb-4">Showing raw data:</p>
        <pre className="bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(bookData, null, 2)}
        </pre>
      </div>
    );
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Ledger (for Sub Ledger Book)
            </label>
            <select
              value={selectedSubLedgerId}
              onChange={(e) => setSelectedSubLedgerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Sub Ledger</option>
              {subLedgers.map((sl) => (
                <option key={sl._id} value={sl._id}>
                  {sl.subLedgerName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => fetchBook('general-ledger')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              activeBook === 'general-ledger'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            General Ledger Book
          </button>
          <button
            onClick={() => fetchBook('sub-ledger')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              activeBook === 'sub-ledger'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Sub Ledger Book
          </button>
          <button
            onClick={() => fetchBook('cash-bank')}
            disabled={loading}
            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
              activeBook === 'cash-bank'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
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
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {activeBook.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              From {new Date(dateFrom).toLocaleDateString()} to {new Date(dateTo).toLocaleDateString()}
            </p>
          </div>
          {renderBookTable()}
        </div>
      )}
    </div>
  );
}