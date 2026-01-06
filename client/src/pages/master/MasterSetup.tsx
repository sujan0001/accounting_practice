import { useState } from 'react';
import LedgerGroups from './LedgerGroups';
import GeneralLedgers from './GeneralLedgers';
import SubLedgers from './SubLedgers';

export default function MasterSetup() {
  const [activeTab, setActiveTab] = useState<'groups' | 'ledgers' | 'subledgers'>('groups');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Master Setup</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'groups'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ledger Groups
            </button>
            <button
              onClick={() => setActiveTab('ledgers')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'ledgers'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General Ledgers
            </button>
            <button
              onClick={() => setActiveTab('subledgers')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'subledgers'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sub Ledgers
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'groups' && <LedgerGroups />}
          {activeTab === 'ledgers' && <GeneralLedgers />}
          {activeTab === 'subledgers' && <SubLedgers />}
        </div>
      </div>
    </div>
  );
}

