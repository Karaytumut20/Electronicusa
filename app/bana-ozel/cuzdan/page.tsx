import React from 'react';
import { getWalletServer, getTransactionsServer } from '@/lib/actions/wallet-actions';
import WalletOverview from '@/components/wallet/WalletOverview';
import TransactionHistory from '@/components/wallet/TransactionHistory';

export default async function WalletPage() {
  const wallet = await getWalletServer();
  const transactions = await getTransactionsServer();

  if (!wallet) return <div className="p-6">Wallet info not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Wallet</h1>

      <WalletOverview balance={Number(wallet.balance)} currency={wallet.currency} />

      <TransactionHistory transactions={transactions} />

      <div className="mt-4 text-xs text-gray-400 text-center">
        * You can purchase boosts with your balance. veya mağaza açılış ücretlerini ödeyebilirsiniz.
        <br/> All transactions are secured by SSL.
      </div>
    </div>
  );
}