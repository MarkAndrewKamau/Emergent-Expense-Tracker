import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/expenseData';

export const SummaryCards = ({ totals, previousBalance, currentBalance }) => {
  const netChange = totals.deposit - totals.totalExpenses;
  const isPositive = netChange >= 0;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Deposits */}
      <Card className="summary-card bg-card border-0">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Deposits
            </span>
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--success))]" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[hsl(var(--success))]">
            +{formatCurrency(totals.deposit) || '0.00'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This month
          </p>
        </div>
      </Card>
      
      {/* Total Expenses */}
      <Card className="summary-card bg-card border-0">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--destructive))]/10 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[hsl(var(--destructive))]" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[hsl(var(--destructive))]">
            -{formatCurrency(totals.totalExpenses) || '0.00'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This month
          </p>
        </div>
      </Card>
      
      {/* Net Change */}
      <Card className="summary-card bg-card border-0">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Net Change
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isPositive 
                ? 'bg-[hsl(var(--success))]/10' 
                : 'bg-[hsl(var(--destructive))]/10'
            }`}>
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-[hsl(var(--success))]" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-[hsl(var(--destructive))]" />
              )}
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${
            isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'
          }`}>
            {isPositive ? '+' : ''}{formatCurrency(netChange) || '0.00'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This month
          </p>
        </div>
      </Card>
      
      {/* Current Balance */}
      <Card className="summary-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${
            currentBalance >= 0 ? 'text-foreground' : 'text-[hsl(var(--destructive))]'
          }`}>
            {formatCurrency(currentBalance) || '0.00'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Running total
          </p>
        </div>
      </Card>
    </div>
  );
};
