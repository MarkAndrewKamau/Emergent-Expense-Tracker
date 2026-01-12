import React, { useState, useCallback, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { ExpenseHeader } from '@/components/ExpenseHeader';
import { MonthTabs } from '@/components/MonthTabs';
import { SummaryCards } from '@/components/SummaryCards';
import { ExpenseSpreadsheet } from '@/components/ExpenseSpreadsheet';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { CumulativeSummary } from '@/components/CumulativeSummary';
import { 
  createSampleData,
  createEmptyRow,
  calculateMonthTotals,
  calculatePercentages,
  getMonthEndingBalance,
  getMonthStartingBalance,
  MONTHS,
  CURRENCY_SYMBOL,
} from '@/lib/expenseData';
import { exportToExcel, exportMonthToExcel } from '@/lib/excelExport';

// Load data from localStorage or use sample data
const loadInitialData = () => {
  try {
    const saved = localStorage.getItem('expenseTrackerData');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading saved data:', e);
  }
  return createSampleData();
};

function App() {
  const [yearData, setYearData] = useState(loadInitialData);
  const [currentMonth, setCurrentMonth] = useState('January');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);
  
  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('expenseTrackerData', JSON.stringify(yearData));
    } catch (e) {
      console.error('Error saving data:', e);
    }
  }, [yearData]);
  
  // Get current month data
  const monthData = yearData[currentMonth];
  const monthIndex = MONTHS.indexOf(currentMonth);
  
  // Calculate statistics
  const totals = calculateMonthTotals(monthData);
  const percentages = calculatePercentages(totals);
  const startingBalance = getMonthStartingBalance(yearData, currentMonth);
  const currentBalance = getMonthEndingBalance(yearData, currentMonth);
  
  // Update a row
  const handleUpdateRow = useCallback((rowIndex, field, value) => {
    setYearData(prev => {
      const newData = { ...prev };
      newData[currentMonth] = [...prev[currentMonth]];
      newData[currentMonth][rowIndex] = {
        ...newData[currentMonth][rowIndex],
        [field]: value,
      };
      return newData;
    });
  }, [currentMonth]);
  
  // Delete a row (clear its data)
  const handleDeleteRow = useCallback((rowIndex) => {
    setYearData(prev => {
      const newData = { ...prev };
      newData[currentMonth] = [...prev[currentMonth]];
      newData[currentMonth][rowIndex] = createEmptyRow(rowIndex + 1);
      return newData;
    });
    toast.success('Row cleared');
  }, [currentMonth]);
  
  // Add a new row
  const handleAddRow = useCallback(() => {
    setYearData(prev => {
      const newData = { ...prev };
      const currentRows = prev[currentMonth];
      newData[currentMonth] = [
        ...currentRows,
        createEmptyRow(currentRows.length + 1),
      ];
      return newData;
    });
    toast.success('Row added');
  }, [currentMonth]);
  
  // Export all months
  const handleExportAll = useCallback(() => {
    try {
      exportToExcel(yearData, 'expense_tracker_2024.xlsx');
      toast.success('Excel file downloaded successfully!');
    } catch (e) {
      console.error('Export error:', e);
      toast.error('Failed to export. Please try again.');
    }
  }, [yearData]);
  
  // Export current month
  const handleExportMonth = useCallback(() => {
    try {
      exportMonthToExcel(monthData, currentMonth, yearData, monthIndex);
      toast.success(`${currentMonth} exported successfully!`);
    } catch (e) {
      console.error('Export error:', e);
      toast.error('Failed to export. Please try again.');
    }
  }, [monthData, currentMonth, yearData, monthIndex]);
  
  // Toggle dark mode
  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-card border border-border text-foreground',
        }}
      />
      
      {/* Header */}
      <ExpenseHeader
        onExportAll={handleExportAll}
        onExportMonth={handleExportMonth}
        currentMonth={currentMonth}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onAddRow={handleAddRow}
      />
      
      {/* Month Tabs */}
      <MonthTabs
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
      />
      
      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary Cards */}
        <SummaryCards
          totals={totals}
          previousBalance={startingBalance}
          currentBalance={currentBalance}
        />
        
        {/* Spreadsheet */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            {currentMonth} Expenses
            <span className="text-xs font-normal text-muted-foreground">
              (Starting balance: {CURRENCY_SYMBOL} {startingBalance.toFixed(2)})
            </span>
          </h2>
          <ExpenseSpreadsheet
            monthData={monthData}
            monthName={currentMonth}
            yearData={yearData}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
          />
        </div>
        
        {/* Category Breakdown */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {currentMonth} Breakdown
          </h2>
          <CategoryBreakdown
            totals={totals}
            percentages={percentages}
          />
        </div>
        
        {/* Cumulative Summary (shows for all months except January) */}
        {monthIndex > 0 && (
          <CumulativeSummary
            yearData={yearData}
            currentMonth={currentMonth}
          />
        )}
        
        {/* Mobile Actions */}
        <div className="sm:hidden flex flex-col gap-2 pb-6">
          <button
            onClick={handleAddRow}
            className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-medium"
          >
            + Add Row
          </button>
          <button
            onClick={handleExportMonth}
            className="w-full py-3 rounded-lg bg-muted text-foreground font-medium"
          >
            Export {currentMonth}
          </button>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Expense Tracker Template • Data saved locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
