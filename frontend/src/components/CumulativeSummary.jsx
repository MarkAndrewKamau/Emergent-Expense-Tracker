import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MONTHS, 
  EXPENSE_CATEGORIES,
  calculateCumulativeTotals, 
  calculatePercentages,
  formatCurrency,
  CURRENCY_SYMBOL
} from '@/lib/expenseData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

export const CumulativeSummary = ({ yearData, currentMonth }) => {
  const monthIndex = MONTHS.indexOf(currentMonth);
  
  // Skip if January (no cumulative)
  if (monthIndex === 0) {
    return null;
  }
  
  const cumulative = calculateCumulativeTotals(yearData, currentMonth);
  const cumulativePercentages = calculatePercentages(cumulative);
  
  // Prepare bar chart data
  const barChartData = EXPENSE_CATEGORIES.map(cat => ({
    name: cat.label.substring(0, 5),
    fullName: cat.label,
    amount: cumulative[cat.key],
    color: cat.color,
    percentage: cumulativePercentages[cat.key],
  }));
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm">{data.fullName}</p>
          <p className="text-muted-foreground text-xs">
            {CURRENCY_SYMBOL} {formatCurrency(data.amount)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="border-0 shadow-sm animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Cumulative Summary
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                January - {currentMonth}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Net Balance</p>
            <p className={`text-lg font-bold ${
              (cumulative.deposit - cumulative.totalExpenses) >= 0 
                ? 'text-[hsl(var(--success))]' 
                : 'text-[hsl(var(--destructive))]'
            }`}>
              {CURRENCY_SYMBOL} {formatCurrency(cumulative.deposit - cumulative.totalExpenses)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `${CURRENCY_SYMBOL} ${v}`} />
                <YAxis type="category" dataKey="name" width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  radius={[0, 4, 4, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Total Deposits
              </p>
              <p className="text-lg font-bold text-[hsl(var(--success))]">
                +{CURRENCY_SYMBOL} {formatCurrency(cumulative.deposit)}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Total Expenses
              </p>
              <p className="text-lg font-bold text-[hsl(var(--destructive))]">
                -{CURRENCY_SYMBOL} {formatCurrency(cumulative.totalExpenses)}
              </p>
            </div>
            
            {/* Top 3 expense categories */}
            <div className="col-span-2 bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Top Expense Categories
              </p>
              <div className="space-y-1.5">
                {[...barChartData]
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 3)
                  .map((cat, idx) => (
                    <div key={cat.fullName} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.fullName}</span>
                      </div>
                      <span className="font-medium">{CURRENCY_SYMBOL} {formatCurrency(cat.amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
