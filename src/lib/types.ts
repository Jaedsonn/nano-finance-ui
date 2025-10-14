export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AccountType =
  | "Checking Account"
  | "Savings Account"
  | "Business Account"
  | "Join Account"
  | "Student Account"
  | "Investment Account";

export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  agency: string;
  balance: number;
  isActive: boolean;
  accountType: AccountType;
  bank?: Bank;
  user?: User;
}

export type TransactionType =
  | "Deposit"
  | "Withdrawal"
  | "Transfer"
  | "Payment"
  | "Refund"
  | "Fee"
  | "Interest"
  | "Adjustment";

export type TransactionCategory =
  | "Groceries"
  | "Utilities"
  | "Rent"
  | "Entertainment"
  | "Transportation"
  | "Healthcare"
  | "Education"
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  from: string;
  to: string;
  category: TransactionCategory;
  createdAt: string;
  account?: Account;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}
