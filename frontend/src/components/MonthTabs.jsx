import React from 'react';
import { MONTHS } from '@/lib/expenseData';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const MonthTabs = ({ currentMonth, onMonthChange }) => {
  return (
    <div className="border-b border-border bg-card/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-1 py-3">
            {MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => onMonthChange(month)}
                className={cn(
                  "month-tab shrink-0",
                  currentMonth === month && "month-tab-active"
                )}
              >
                <span className="hidden sm:inline">{month}</span>
                <span className="sm:hidden">{month.substring(0, 3)}</span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>
    </div>
  );
};
