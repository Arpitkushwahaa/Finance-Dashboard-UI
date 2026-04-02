import { useStore } from '../store/useStore';
import { Lightbulb, TrendingDown, AlertTriangle, Target } from 'lucide-react';

export function Insights() {
  const { transactions } = useStore();
  
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
  const totalIncome = incomes.reduce((a, b) => a + b.amount, 0);

  // Highest spending category
  const expensesByCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const highestCategory = Object.keys(expensesByCategory).reduce((a, b) => 
    (expensesByCategory[a] || 0) > (expensesByCategory[b] || 0) ? a : b
  , '') || 'None';

  const highestCategoryAmount = expensesByCategory[highestCategory] || 0;
  const highestCategoryPercent = totalExpense ? ((highestCategoryAmount / totalExpense) * 100).toFixed(0) : '0';

  // Largest single transaction
  const largestTransaction = expenses.length > 0 
    ? expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0])
    : null;

  const savingsRate = totalIncome ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        AI Financial Insights
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Spending Insight */}
        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Top Spending</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Your highest spending category is <span className="font-medium text-foreground">{highestCategory}</span>, making up <span className="font-bold text-orange-500 dark:text-orange-400">{highestCategoryPercent}%</span> of your total expenses (${highestCategoryAmount}).
          </p>
        </div>

        {/* Largest Transaction */}
        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-bl-[100px] -z-10" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Notable Expense</h3>
          </div>
          {largestTransaction ? (
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              You had a large single expense for <span className="font-medium text-foreground">{largestTransaction.category}</span> on {new Date(largestTransaction.date).toLocaleDateString()} amounting to <span className="font-bold text-red-500 dark:text-red-400">${largestTransaction.amount}</span>.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">No notable expenses recorded.</p>
          )}
        </div>

        {/* Savings Health */}
        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[100px] -z-10" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Savings Health</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Your current savings rate is <span className={`font-bold ${Number(savingsRate) > 20 ? 'text-green-500 dark:text-green-400' : 'text-yellow-500 dark:text-yellow-400'}`}>{savingsRate}%</span> of your total income. 
            {Number(savingsRate) >= 20 ? ' Great job maintaining a healthy budget!' : ' Consider reviewing your budget to target a 20% savings rate.'}
          </p>
        </div>
      </div>
    </div>
  );
}
