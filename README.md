# Aid Ledger - NGO Accounting System

A full-stack MERN application for managing NGO accounting with budget tracking and fund accountability reporting.

## Tech Stack

- **Frontend**: React 18+ with TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Authentication**: JWT (access token + refresh token)

## Project Structure

```
aid-ledger/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── context/        # React Context providers
│   │   ├── lib/            # API service layer
│   │   └── types/          # TypeScript types
│   └── package.json
├── server/         # Node/Express backend
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, validation, error handling
│   │   └── server.js      # Entry point
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB 6+
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/aid-ledger
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

4. Seed Account Types:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

### Core Features

1. **Authentication**
   - Organization signup with first admin user
   - User login with JWT tokens
   - Token refresh mechanism

2. **Project Management**
   - Create and manage multiple projects
   - Set active project for operations
   - Project-based data segregation

3. **Chart of Accounts**
   - Account Types (system-defined)
   - Ledger Groups
   - General Ledgers
   - Sub Ledgers

4. **Budget Entry**
   - Multi-line budget entry
   - Budget validation
   - Auto-numbering (BUD-001, BUD-002, ...)

5. **Journal Voucher Entry**
   - Multi-line double-entry bookkeeping
   - Balance validation (Debit = Credit)
   - Auto-numbering (JV-001, JV-002, ...)

6. **Reports**
   - Trial Balance
   - Income Statement
   - Balance Sheet
   - Fund Accountability Statement
   - Budget vs Expenditure

7. **Books**
   - General Ledger Book
   - Sub Ledger Book
   - Cash/Bank Book

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register organization + first user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/load` - Set as active project
- `GET /api/projects/active` - Get active project

### Master Setup
- `GET /api/account-types` - Get all account types
- `POST /api/projects/:projectId/ledger-groups` - Create ledger group
- `GET /api/projects/:projectId/ledger-groups` - Get ledger groups
- Similar endpoints for General Ledgers and Sub Ledgers

### Entries
- `POST /api/projects/:projectId/budgets` - Create budget
- `GET /api/projects/:projectId/budgets` - Get budgets
- `POST /api/projects/:projectId/journal-vouchers` - Create journal voucher
- `GET /api/projects/:projectId/journal-vouchers` - Get journal vouchers

### Reports
- `GET /api/projects/:projectId/reports/trial-balance?from=...&to=...`
- `GET /api/projects/:projectId/reports/income-statement?from=...&to=...`
- `GET /api/projects/:projectId/reports/balance-sheet?asOfDate=...`
- `GET /api/projects/:projectId/reports/fund-accountability?from=...&to=...`
- `GET /api/projects/:projectId/reports/budget-vs-expenditure?from=...&to=...`

### Books
- `GET /api/projects/:projectId/books/general-ledger?ledgerId=...&from=...&to=...`
- `GET /api/projects/:projectId/books/sub-ledger?subLedgerId=...&from=...&to=...`
- `GET /api/projects/:projectId/books/cash-bank?from=...&to=...`

## Accounting Principles

- **Double-Entry Bookkeeping**: Every transaction has equal debits and credits
- **Chart of Accounts**: Hierarchical structure (AccountType → LedgerGroup → GeneralLedger → SubLedger)
- **Fund Accountability**: Budget is compared against actual expense transactions
- **Financial Statements**: Derived from journal vouchers, computed on-the-fly

## Development

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed account types

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

ISC

