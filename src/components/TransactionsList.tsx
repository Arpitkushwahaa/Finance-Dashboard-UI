import React, { useState } from 'react';
import { useStore, TransactionType } from '../store/useStore';
import { ArrowUpRight, ArrowDownRight, Search, Filter, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

export function TransactionsList() {
  const { transactions, role, deleteTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredData = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === 'filterType';
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    return b.amount - a.amount;
  });

  return (
    <div className="bg-card border rounded-xl shadow-sm mt-8">
      <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search category..."
              className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="px-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-3 rounded-l-lg">Transaction</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No transactions found.
                  </td>
                </tr>
              ) : filteredData.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className={clsx("p-2 rounded-full", t.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30')}>
                      {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    {t.category}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(t.date), 'MMM dd, yyyy')}
                  </td>
                  <td className={clsx("px-6 py-4 font-semibold", t.type === 'income' ? 'text-green-600' : 'text-red-500')}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {role === 'admin' ? (
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                        title="Delete (Admin Only)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Viewer</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
