export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'accountant' | 'viewer';
  isFirstLogin: boolean;
  organization: {
    id: string;
    name: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  registrationNumber?: string;
}

export interface Project {
  _id: string;
  projectName: string;
  alias: string;
  panNo?: string;
  financialYearFrom: string;
  financialYearTo?: string;
  status: 'ongoing' | 'completed';
  description?: string;
  organization: Organization;
}

export interface AccountType {
  _id: string;
  name: string;
  code: string;
  nature: 'debit' | 'credit';
  reportCategory: 'balance_sheet' | 'income_statement';
  order: number;
}

export interface LedgerGroup {
  _id: string;
  project: string;
  groupName: string;
  alias: string;
  accountType: AccountType;
  remarks?: string;
}

export interface GeneralLedger {
  _id: string;
  project: string;
  ledgerName: string;
  alias: string;
  ledgerGroup: LedgerGroup;
  openingBalance: number;
  openingBalanceType: 'debit' | 'credit';
  description?: string;
}

export interface SubLedger {
  _id: string;
  project: string;
  subLedgerName: string;
  alias: string;
  generalLedger: GeneralLedger;
  openingBalance: number;
  openingBalanceType: 'debit' | 'credit';
  description?: string;
}

export interface BudgetLineItem {
  serialNo: number;
  generalLedger: string | GeneralLedger;
  subLedger?: string | SubLedger;
  district?: string;
  period?: string;
  amount: number;
  narration?: string;
}

export interface Budget {
  _id: string;
  project: string;
  budgetNo: string;
  approvedDate: string;
  approvedBy?: string;
  lineItems: BudgetLineItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  serialNo: number;
  generalLedger: string | GeneralLedger;
  subLedger?: string | SubLedger;
  debitAmount: number;
  creditAmount: number;
  narration?: string;
}

export interface JournalVoucher {
  _id: string;
  project: string;
  voucherNo: string;
  date: string;
  narration?: string;
  entries: JournalEntry[];
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
  updatedAt: string;
}

