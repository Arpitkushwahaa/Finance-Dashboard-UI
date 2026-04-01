import React, { useState } from 'react';
import { useStore, TransactionType } from '../store/useStore';
import { ArrowUpRight, ArrowDownRight, Search, Trash2, Plus, Download } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

export function TransactionsList() {
  const { transactions, role, deleteTransaction, addTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTxn, setNewTxn] = useState({ category: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), type: 'expense' as TransactionType });

  const filteredData = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    return b.amount - a.amount;
  });

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Category', 'Type', 'Amount'],
      ...filteredData.map(t => [t.date, t.category, t.type, t.amount])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxn.category || !newTxn.amount) return;
    addTransaction({
      category: newTxn.category,
      amount: Number(newTxn.amount),
      date: newTxn.date,
      type: newTxn.type
    });
    setIsModalOpen(false);
    setNewTxn({ category: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), type: 'expense' });
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm mt-8">
      <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <h3 className="text-lg font-semibold flex-shrink-0">Recent Transactions</h3>
          {role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search category..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="all">All Types</option>
            <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="income">Income</option>
            <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="expense">Expense</option>
          </select>
          <select
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
          >
            <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="date">Sort by Date</option>
            <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="amount">Sort by Amount</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted transition-colors text-sm"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
          </button>
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

      {/* Add Transaction Modal */}
      {isModalOpen && role === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl p-6 relative">
            <h2 className="text-xl font-bold mb-6">Add Transaction</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category / Name</label>
                <input 
                  type="text" required 
                  value={newTxn.category} 
                  onChange={e => setNewTxn({...newTxn, category: e.target.value})} 
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400" 
                  placeholder="e.g. Groceries"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input 
                      type="number" required min="0" step="0.01"
                      value={newTxn.amount} 
                      onChange={e => setNewTxn({...newTxn, amount: e.target.value})} 
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400" 
                      placeholder="0.00"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input 
                      type="date" required 
                      value={newTxn.date} 
                      onChange={e => setNewTxn({...newTxn, date: e.target.value})} 
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100" 
                    />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" name="type" value="expense"
                      checked={newTxn.type === 'expense'}
                      onChange={e => setNewTxn({...newTxn, type: e.target.value as TransactionType})}
                      className="accent-primary"
                    />
                    Expense
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" name="type" value="income"
                      checked={newTxn.type === 'income'}
                      onChange={e => setNewTxn({...newTxn, type: e.target.value as TransactionType})}
                      className="accent-primary"
                    />
                    Income
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors border"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
