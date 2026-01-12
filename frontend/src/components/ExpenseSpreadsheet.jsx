import React, { useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  EXPENSE_CATEGORIES,
  calculateMonthBalances,
  calculateMonthTotals,
  calculatePercentages,
  formatCurrency,
  getMonthStartingBalance,
} from '@/lib/expenseData';
import { cn } from '@/lib/utils';

export const ExpenseSpreadsheet = ({ 
  monthData, 
  monthName,
  yearData,
  onUpdateRow, 
  onDeleteRow 
}) => {
  // Calculate starting balance from previous months
  const startingBalance = useMemo(() => 
    getMonthStartingBalance(yearData, monthName), 
    [yearData, monthName]
  );
  
  // Calculate balances for all rows
  const dataWithBalances = useMemo(() => 
    calculateMonthBalances(monthData, startingBalance),
    [monthData, startingBalance]
  );
  
  // Calculate totals and percentages
  const totals = useMemo(() => calculateMonthTotals(monthData), [monthData]);
  const percentages = useMemo(() => calculatePercentages(totals), [totals]);
  
  const handleCellChange = useCallback((rowIndex, field, value) => {
    onUpdateRow(rowIndex, field, value);
  }, [onUpdateRow]);
  
  // Check if row has any data
  const rowHasData = (row) => {
    return row.date || row.receiver || row.purpose || row.deposit ||
      EXPENSE_CATEGORIES.some(cat => row[cat.key]);
  };
  
  return (
    <div className="spreadsheet-container animate-fade-in">
      <ScrollArea className="w-full">
        <div className="min-w-[1200px]">
          {/* Header Row */}
          <div className="spreadsheet-header flex">
            <div className="spreadsheet-cell spreadsheet-cell-header w-10 flex-shrink-0 text-center">
              #
            </div>
            <div className="spreadsheet-cell spreadsheet-cell-header w-28 flex-shrink-0">
              Date
            </div>
            <div className="spreadsheet-cell spreadsheet-cell-header w-40 flex-shrink-0">
              Receiver
            </div>
            <div className="spreadsheet-cell spreadsheet-cell-header w-48 flex-shrink-0">
              Purpose
            </div>
            <div className="spreadsheet-cell spreadsheet-cell-header w-28 flex-shrink-0 text-[hsl(var(--success))]">
              Deposit (+)
            </div>
            {EXPENSE_CATEGORIES.map((cat) => (
              <div 
                key={cat.key}
                className="spreadsheet-cell spreadsheet-cell-header w-24 flex-shrink-0"
                style={{ color: cat.color }}
              >
                {cat.label} (-)
              </div>
            ))}
            <div className="spreadsheet-cell spreadsheet-cell-header w-28 flex-shrink-0 text-primary">
              Balance
            </div>
            <div className="spreadsheet-cell spreadsheet-cell-header w-12 flex-shrink-0">
              
            </div>
          </div>
          
          {/* Data Rows */}
          {dataWithBalances.map((row, index) => (
            <div 
              key={row.id} 
              className={cn(
                "spreadsheet-row flex items-center",
                row.deposit && "spreadsheet-row-highlight"
              )}
            >
              {/* Row Number */}
              <div className="spreadsheet-cell w-10 flex-shrink-0 text-center text-muted-foreground text-xs">
                {index + 1}
              </div>
              
              {/* Date */}
              <div className="spreadsheet-cell w-28 flex-shrink-0">
                <Input
                  type="date"
                  value={row.date}
                  onChange={(e) => handleCellChange(index, 'date', e.target.value)}
                  className="spreadsheet-cell-input h-8 text-xs border-transparent focus:border-input"
                />
              </div>
              
              {/* Receiver */}
              <div className="spreadsheet-cell w-40 flex-shrink-0">
                <Input
                  type="text"
                  value={row.receiver}
                  onChange={(e) => handleCellChange(index, 'receiver', e.target.value)}
                  placeholder=""
                  className="spreadsheet-cell-input h-8 text-xs border-transparent focus:border-input"
                />
              </div>
              
              {/* Purpose */}
              <div className="spreadsheet-cell w-48 flex-shrink-0">
                <Input
                  type="text"
                  value={row.purpose}
                  onChange={(e) => handleCellChange(index, 'purpose', e.target.value)}
                  placeholder=""
                  className="spreadsheet-cell-input h-8 text-xs border-transparent focus:border-input"
                />
              </div>
              
              {/* Deposit */}
              <div className="spreadsheet-cell w-28 flex-shrink-0">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={row.deposit}
                  onChange={(e) => handleCellChange(index, 'deposit', e.target.value)}
                  placeholder=""
                  className="spreadsheet-cell-input h-8 text-xs text-[hsl(var(--success))] border-transparent focus:border-input"
                />
              </div>
              
              {/* Expense Categories */}
              {EXPENSE_CATEGORIES.map((cat) => (
                <div key={cat.key} className="spreadsheet-cell w-24 flex-shrink-0">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={row[cat.key]}
                    onChange={(e) => handleCellChange(index, cat.key, e.target.value)}
                    placeholder=""
                    className="spreadsheet-cell-input h-8 text-xs border-transparent focus:border-input"
                  />
                </div>
              ))}
              
              {/* Balance */}
              <div className="spreadsheet-cell w-28 flex-shrink-0">
                <span className={cn(
                  "text-sm font-medium",
                  row.balance !== null && row.balance >= 0 && "text-foreground",
                  row.balance !== null && row.balance < 0 && "text-[hsl(var(--destructive))]"
                )}>
                  {row.balance !== null ? formatCurrency(row.balance) : ''}
                </span>
              </div>
              
              {/* Delete Button */}
              <div className="spreadsheet-cell w-12 flex-shrink-0">
                {rowHasData(row) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteRow(index)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {/* Subtotal Row */}
          <div className="total-row flex items-center border-t-2 border-border">
            <div className="spreadsheet-cell w-10 flex-shrink-0"></div>
            <div className="spreadsheet-cell w-28 flex-shrink-0 text-xs uppercase tracking-wide">
              Subtotal
            </div>
            <div className="spreadsheet-cell w-40 flex-shrink-0"></div>
            <div className="spreadsheet-cell w-48 flex-shrink-0"></div>
            <div className="spreadsheet-cell w-28 flex-shrink-0 text-[hsl(var(--success))] font-semibold">
              {formatCurrency(totals.deposit) || '-'}
            </div>
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat.key} className="spreadsheet-cell w-24 flex-shrink-0 font-semibold">
                {formatCurrency(totals[cat.key]) || '-'}
              </div>
            ))}
            <div className="spreadsheet-cell w-28 flex-shrink-0 font-bold text-primary">
              {formatCurrency(startingBalance + totals.deposit - totals.totalExpenses)}
            </div>
            <div className="spreadsheet-cell w-12 flex-shrink-0"></div>
          </div>
          
          {/* Percentage Row */}
          <div className="percentage-row flex items-center">
            <div className="spreadsheet-cell w-10 flex-shrink-0"></div>
            <div className="spreadsheet-cell w-28 flex-shrink-0 text-xs uppercase tracking-wide">
              % of Total
            </div>
            <div className="spreadsheet-cell w-40 flex-shrink-0"></div>
            <div className="spreadsheet-cell w-48 flex-shrink-0"></div>
            <div className="spreadsheet-cell w-28 flex-shrink-0">-</div>
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat.key} className="spreadsheet-cell w-24 flex-shrink-0">
                {percentages[cat.key]}%
              </div>
            ))}
            <div className="spreadsheet-cell w-28 flex-shrink-0">-</div>
            <div className="spreadsheet-cell w-12 flex-shrink-0"></div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
