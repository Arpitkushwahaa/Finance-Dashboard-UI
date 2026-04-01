import React from 'react';
import { useStore } from '../store/useStore';
import { Lightbulb } from 'lucide-react';

export function Insights() {
  const { transactions } = useStore();
  
  const expenses = transactions.filter(t => t.type === 'expense');

  // Highest spending category
  const expensesByCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const highestCategory = Object.keys(expensesByCategory).reduce((a, b) => 
    expensesByCategory[a] > expensesByCategory[b] ? a : b
  , '');

  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8 shadow-sm flex items-start gap-4">
      <div className="p-3 bg-primary rounded-full text-primary-foreground mt-1">
        <Lightbulb className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-primary">Smart AI Insights</h3>
        <p className="mt-2 text-foreground/80 leading-relaxed">
          Your highest spending category is <strong>{highestCategory}</strong>, making up{' '}
          <strong>{((expensesByCategory[highestCategory] || 0) / (totalExpense || 1) * 100).toFixed(0)}%</strong> of your total expenses. Consider reducing unnecessary costs here to improve your monthly savings rate!
        </p>
      </div>
    </div>
  );
}
