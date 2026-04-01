import { useStore } from '../store/useStore';
import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DashboardOverview() {
  const transactions = useStore(state => state.transactions);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Group by date for line chart
  const timelineData = Object.entries(
    transactions.reduce((acc, t) => {
      if (!acc[t.date]) acc[t.date] = { date: t.date, income: 0, expense: 0, balance: 0 };
      if (t.type === 'income') acc[t.date].income += t.amount;
      else acc[t.date].expense += t.amount;
      
      // Calculate daily running balance (simplified for demo)
      acc[t.date].balance = acc[t.date].income - acc[t.date].expense;
      return acc;
    }, {} as Record<string, any>)
  ).map(([, value]) => value).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Accumulate balance across timeline
  let runningBalance = Object.values(timelineData).length > 0 ? timelineData[0].balance : 0;
  const trendData = timelineData.map((d, index) => {
      if (index > 0) runningBalance += (d.income - d.expense);
      return { ...d, balance: runningBalance };
  });

  // Group by category for pie chart
  const expensesByCategory = Object.entries(
    transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-card border rounded-xl shadow-sm text-card-foreground">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium opacity-80">Total Balance</h3>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-card border rounded-xl shadow-sm text-card-foreground">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium opacity-80">Total Income</h3>
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-500">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-card border rounded-xl shadow-sm text-card-foreground">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium opacity-80">Total Expenses</h3>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-500">${totalExpense.toLocaleString()}</p>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Balance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Spending Breakdown</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expensesByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {expensesByCategory.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
