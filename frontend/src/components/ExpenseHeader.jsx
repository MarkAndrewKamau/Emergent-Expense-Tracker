import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Moon, Sun, Plus } from 'lucide-react';

export const ExpenseHeader = ({ 
  onExportAll, 
  onExportMonth, 
  currentMonth,
  isDarkMode,
  onToggleDarkMode,
  onAddRow
}) => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] text-primary-foreground shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                Expense Tracker
              </h1>
              <p className="text-xs text-muted-foreground">
                Track, analyze, export
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Button
                variant="soft"
                size="sm"
                onClick={onAddRow}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onExportMonth}
                className="gap-1.5"
              >
                <Download className="w-4 h-4" />
                Export {currentMonth.substring(0, 3)}
              </Button>
              
              <Button
                variant="premium"
                size="sm"
                onClick={onExportAll}
                className="gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export All
              </Button>
            </div>
            
            {/* Mobile menu */}
            <div className="sm:hidden">
              <Button
                variant="premium"
                size="sm"
                onClick={onExportAll}
                className="gap-1.5"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
