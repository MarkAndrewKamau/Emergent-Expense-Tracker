import * as XLSX from 'xlsx';
import {
  MONTHS,
  EXPENSE_CATEGORIES,
  calculateMonthTotals,
  calculatePercentages,
  calculateCumulativeTotals,
  calculateMonthBalances,
  getMonthStartingBalance,
} from './expenseData';

// Column headers for the spreadsheet
const COLUMN_HEADERS = [
  'Date',
  'Receiver',
  'Purpose',
  'Deposit (+)',
  ...EXPENSE_CATEGORIES.map(cat => `${cat.label} (-)`),
  'Balance'
];

// Create a single month worksheet
const createMonthSheet = (monthData, monthName, yearData, monthIndex) => {
  const rows = [];
  
  // Add title row
  rows.push([`${monthName} Expense Tracker`]);
  rows.push([]); // Empty row
  
  // Add header row
  rows.push(COLUMN_HEADERS);
  
  // Calculate balances
  const startingBalance = getMonthStartingBalance(yearData, monthName);
  const dataWithBalances = calculateMonthBalances(monthData, startingBalance);
  
  // Add data rows
  dataWithBalances.forEach((row) => {
    const hasData = row.date || row.receiver || row.purpose || row.deposit || 
      EXPENSE_CATEGORIES.some(cat => row[cat.key]);
    
    if (hasData) {
      rows.push([
        row.date || '',
        row.receiver || '',
        row.purpose || '',
        row.deposit ? parseFloat(row.deposit) : '',
        ...EXPENSE_CATEGORIES.map(cat => row[cat.key] ? parseFloat(row[cat.key]) : ''),
        row.balance !== null ? row.balance : '',
      ]);
    }
  });
  
  // Add empty rows for spacing
  rows.push([]);
  
  // Calculate totals
  const totals = calculateMonthTotals(monthData);
  const percentages = calculatePercentages(totals);
  
  // Add subtotal row
  rows.push([
    'SUBTOTAL',
    '',
    '',
    totals.deposit || '',
    ...EXPENSE_CATEGORIES.map(cat => totals[cat.key] || ''),
    '',
  ]);
  
  // Add percentage row
  rows.push([
    'PERCENTAGE',
    '',
    '',
    '',
    ...EXPENSE_CATEGORIES.map(cat => percentages[cat.key] ? `${percentages[cat.key]}%` : ''),
    '',
  ]);
  
  // Add empty row
  rows.push([]);
  
  // Add cumulative totals (from January to current month)
  if (monthIndex > 0) {
    const cumulative = calculateCumulativeTotals(yearData, monthName);
    const cumulativePercentages = calculatePercentages(cumulative);
    
    rows.push([`CUMULATIVE (Jan - ${monthName})`]);
    rows.push([
      'TOTAL',
      '',
      '',
      cumulative.deposit || '',
      ...EXPENSE_CATEGORIES.map(cat => cumulative[cat.key] || ''),
      '',
    ]);
    rows.push([
      'PERCENTAGE',
      '',
      '',
      '',
      ...EXPENSE_CATEGORIES.map(cat => cumulativePercentages[cat.key] ? `${cumulativePercentages[cat.key]}%` : ''),
      '',
    ]);
  }
  
  return rows;
};

// Apply styles to worksheet
const applyWorksheetStyles = (ws, rows) => {
  // Set column widths
  ws['!cols'] = [
    { wch: 12 },  // Date
    { wch: 20 },  // Receiver
    { wch: 25 },  // Purpose
    { wch: 12 },  // Deposit
    { wch: 12 },  // Transport
    { wch: 12 },  // Food
    { wch: 12 },  // Medication
    { wch: 12 },  // House
    { wch: 12 },  // Car
    { wch: 12 },  // School
    { wch: 12 },  // Diverse
    { wch: 14 },  // Balance
  ];
  
  // Merge title cell
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } });
  
  return ws;
};

// Export to Excel file
export const exportToExcel = (yearData, filename = 'expense_tracker.xlsx') => {
  const workbook = XLSX.utils.book_new();
  
  // Create a worksheet for each month
  MONTHS.forEach((month, index) => {
    const monthData = yearData[month];
    const rows = createMonthSheet(monthData, month, yearData, index);
    
    // Create worksheet from array
    const ws = XLSX.utils.aoa_to_sheet(rows);
    
    // Apply styles
    applyWorksheetStyles(ws, rows);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, month.substring(0, 3)); // Use abbreviated month names for tab
  });
  
  // Create annual summary sheet
  const summaryRows = createAnnualSummary(yearData);
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
  summaryWs['!cols'] = [
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(workbook, summaryWs, 'Annual Summary');
  
  // Generate and download file
  XLSX.writeFile(workbook, filename);
};

// Create annual summary sheet
const createAnnualSummary = (yearData) => {
  const rows = [];
  
  rows.push(['Annual Expense Summary']);
  rows.push([]);
  
  // Header row
  rows.push([
    'Month',
    'Deposits',
    'Transport',
    'Food',
    'Medication',
    'House',
    'Car',
    'School',
    'Diverse',
    'Total Expenses',
    'Net Balance',
  ]);
  
  let runningBalance = 0;
  
  MONTHS.forEach((month) => {
    const totals = calculateMonthTotals(yearData[month]);
    const netBalance = totals.deposit - totals.totalExpenses;
    runningBalance += netBalance;
    
    rows.push([
      month,
      totals.deposit || '',
      totals.transport || '',
      totals.food || '',
      totals.medication || '',
      totals.house || '',
      totals.car || '',
      totals.school || '',
      totals.diverse || '',
      totals.totalExpenses || '',
      runningBalance,
    ]);
  });
  
  // Add annual totals
  rows.push([]);
  const annualTotals = calculateCumulativeTotals(yearData, 'December');
  const annualPercentages = calculatePercentages(annualTotals);
  
  rows.push([
    'ANNUAL TOTAL',
    annualTotals.deposit || '',
    annualTotals.transport || '',
    annualTotals.food || '',
    annualTotals.medication || '',
    annualTotals.house || '',
    annualTotals.car || '',
    annualTotals.school || '',
    annualTotals.diverse || '',
    annualTotals.totalExpenses || '',
    annualTotals.deposit - annualTotals.totalExpenses,
  ]);
  
  rows.push([
    'PERCENTAGE',
    '',
    `${annualPercentages.transport}%`,
    `${annualPercentages.food}%`,
    `${annualPercentages.medication}%`,
    `${annualPercentages.house}%`,
    `${annualPercentages.car}%`,
    `${annualPercentages.school}%`,
    `${annualPercentages.diverse}%`,
    '100%',
    '',
  ]);
  
  return rows;
};

// Export current month only
export const exportMonthToExcel = (monthData, monthName, yearData, monthIndex, filename) => {
  const workbook = XLSX.utils.book_new();
  
  const rows = createMonthSheet(monthData, monthName, yearData, monthIndex);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  applyWorksheetStyles(ws, rows);
  
  XLSX.utils.book_append_sheet(workbook, ws, monthName);
  
  const finalFilename = filename || `expense_tracker_${monthName.toLowerCase()}.xlsx`;
  XLSX.writeFile(workbook, finalFilename);
};
