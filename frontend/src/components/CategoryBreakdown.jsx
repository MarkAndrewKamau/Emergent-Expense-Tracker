import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EXPENSE_CATEGORIES, formatCurrency, CURRENCY_SYMBOL } from '@/lib/expenseData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const CategoryBreakdown = ({ totals, percentages }) => {
  // Prepare chart data
  const chartData = EXPENSE_CATEGORIES
    .filter(cat => totals[cat.key] > 0)
    .map(cat => ({
      name: cat.label,
      value: totals[cat.key],
      color: cat.color,
      percentage: percentages[cat.key],
    }));
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-muted-foreground text-xs">
            {CURRENCY_SYMBOL} {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pie Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Expense Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
              No expense data yet
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Category List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Category Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {EXPENSE_CATEGORIES.map((cat) => {
            const amount = totals[cat.key] || 0;
            const percentage = parseFloat(percentages[cat.key]) || 0;
            
            return (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {percentage}%
                    </span>
                    <span className="text-sm font-semibold min-w-[80px] text-right">
                      {CURRENCY_SYMBOL} {formatCurrency(amount) || '0.00'}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-1.5"
                  style={{ 
                    '--progress-background': cat.color 
                  }}
                />
              </div>
            );
          })}
          
          {/* Total */}
          <div className="pt-3 border-t border-border mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total Expenses</span>
              <span className="text-base font-bold text-[hsl(var(--destructive))]">
                {CURRENCY_SYMBOL} {formatCurrency(totals.totalExpenses) || '0.00'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
