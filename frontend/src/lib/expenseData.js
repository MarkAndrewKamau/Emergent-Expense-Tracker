// Expense categories configuration
export const EXPENSE_CATEGORIES = [
  { key: 'transport', label: 'Transport', color: 'hsl(210, 70%, 50%)' },
  { key: 'food', label: 'Food', color: 'hsl(25, 95%, 55%)' },
  { key: 'medication', label: 'Medication', color: 'hsl(350, 70%, 55%)' },
  { key: 'house', label: 'House', color: 'hsl(45, 85%, 50%)' },
  { key: 'car', label: 'Car', color: 'hsl(280, 60%, 55%)' },
  { key: 'school', label: 'School', color: 'hsl(170, 65%, 45%)' },
  { key: 'diverse', label: 'Diverse', color: 'hsl(200, 20%, 50%)' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Create empty row template
export const createEmptyRow = (id) => ({
  id,
  date: '',
  receiver: '',
  purpose: '',
  deposit: '',
  transport: '',
  food: '',
  medication: '',
  house: '',
  car: '',
  school: '',
  diverse: '',
});

// Create initial month data with empty rows
export const createInitialMonthData = (rowCount = 20) => {
  return Array.from({ length: rowCount }, (_, i) => createEmptyRow(i + 1));
};

// Create initial data for all months
export const createInitialYearData = () => {
  const yearData = {};
  MONTHS.forEach((month) => {
    yearData[month] = createInitialMonthData(25);
  });
  return yearData;
};

// Calculate running balance for a row
export const calculateRowBalance = (row, previousBalance = 0) => {
  const deposit = parseFloat(row.deposit) || 0;
  const expenses = EXPENSE_CATEGORIES.reduce((sum, cat) => {
    return sum + (parseFloat(row[cat.key]) || 0);
  }, 0);
  
  return previousBalance + deposit - expenses;
};

// Calculate all balances for month data
export const calculateMonthBalances = (monthData, startingBalance = 0) => {
  let runningBalance = startingBalance;
  
  return monthData.map((row) => {
    const hasAnyData = row.deposit || EXPENSE_CATEGORIES.some(cat => row[cat.key]);
    if (hasAnyData) {
      runningBalance = calculateRowBalance(row, runningBalance);
      return { ...row, balance: runningBalance };
    }
    return { ...row, balance: null };
  });
};

// Calculate column totals for a month
export const calculateMonthTotals = (monthData) => {
  const totals = {
    deposit: 0,
    transport: 0,
    food: 0,
    medication: 0,
    house: 0,
    car: 0,
    school: 0,
    diverse: 0,
    totalExpenses: 0,
  };
  
  monthData.forEach((row) => {
    totals.deposit += parseFloat(row.deposit) || 0;
    EXPENSE_CATEGORIES.forEach((cat) => {
      const value = parseFloat(row[cat.key]) || 0;
      totals[cat.key] += value;
      totals.totalExpenses += value;
    });
  });
  
  return totals;
};

// Calculate percentage contribution of each category
export const calculatePercentages = (totals) => {
  const percentages = {};
  
  if (totals.totalExpenses === 0) {
    EXPENSE_CATEGORIES.forEach((cat) => {
      percentages[cat.key] = 0;
    });
    return percentages;
  }
  
  EXPENSE_CATEGORIES.forEach((cat) => {
    percentages[cat.key] = ((totals[cat.key] / totals.totalExpenses) * 100).toFixed(1);
  });
  
  return percentages;
};

// Calculate cumulative totals from January up to given month
export const calculateCumulativeTotals = (yearData, upToMonth) => {
  const monthIndex = MONTHS.indexOf(upToMonth);
  const cumulative = {
    deposit: 0,
    transport: 0,
    food: 0,
    medication: 0,
    house: 0,
    car: 0,
    school: 0,
    diverse: 0,
    totalExpenses: 0,
  };
  
  for (let i = 0; i <= monthIndex; i++) {
    const monthTotals = calculateMonthTotals(yearData[MONTHS[i]]);
    cumulative.deposit += monthTotals.deposit;
    EXPENSE_CATEGORIES.forEach((cat) => {
      cumulative[cat.key] += monthTotals[cat.key];
      cumulative.totalExpenses += monthTotals[cat.key];
    });
  }
  
  return cumulative;
};

// Get ending balance for a month (to use as starting balance for next month)
export const getMonthEndingBalance = (yearData, monthName) => {
  const monthIndex = MONTHS.indexOf(monthName);
  let balance = 0;
  
  for (let i = 0; i <= monthIndex; i++) {
    const monthTotals = calculateMonthTotals(yearData[MONTHS[i]]);
    balance += monthTotals.deposit - monthTotals.totalExpenses + monthTotals.deposit;
  }
  
  // Recalculate properly
  balance = 0;
  for (let i = 0; i <= monthIndex; i++) {
    const monthData = yearData[MONTHS[i]];
    monthData.forEach((row) => {
      const deposit = parseFloat(row.deposit) || 0;
      const expenses = EXPENSE_CATEGORIES.reduce((sum, cat) => {
        return sum + (parseFloat(row[cat.key]) || 0);
      }, 0);
      balance += deposit - expenses;
    });
  }
  
  return balance;
};

// Get starting balance for a month
export const getMonthStartingBalance = (yearData, monthName) => {
  const monthIndex = MONTHS.indexOf(monthName);
  if (monthIndex === 0) return 0;
  
  return getMonthEndingBalance(yearData, MONTHS[monthIndex - 1]);
};

// Format currency
export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Sample data for demonstration
export const createSampleData = () => {
  const yearData = createInitialYearData();
  
  // Add sample data for January
  yearData['January'][0] = {
    id: 1,
    date: '2024-01-02',
    receiver: 'City Transit',
    purpose: 'Monthly bus pass',
    deposit: '',
    transport: '85.00',
    food: '',
    medication: '',
    house: '',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['January'][1] = {
    id: 2,
    date: '',
    receiver: 'Fresh Mart',
    purpose: 'Weekly groceries',
    deposit: '',
    transport: '',
    food: '156.50',
    medication: '',
    house: '',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['January'][2] = {
    id: 3,
    date: '2024-01-05',
    receiver: 'Employer Inc.',
    purpose: 'January salary',
    deposit: '3500.00',
    transport: '',
    food: '',
    medication: '',
    house: '',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['January'][3] = {
    id: 4,
    date: '',
    receiver: 'Landlord',
    purpose: 'Monthly rent',
    deposit: '',
    transport: '',
    food: '',
    medication: '',
    house: '1200.00',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['January'][4] = {
    id: 5,
    date: '2024-01-10',
    receiver: 'Pharmacy Plus',
    purpose: 'Prescription refill',
    deposit: '',
    transport: '',
    food: '',
    medication: '45.00',
    house: '',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['January'][5] = {
    id: 6,
    date: '',
    receiver: 'Gas Station',
    purpose: 'Fuel',
    deposit: '',
    transport: '',
    food: '',
    medication: '',
    house: '',
    car: '65.00',
    school: '',
    diverse: '',
  };
  yearData['January'][6] = {
    id: 7,
    date: '2024-01-15',
    receiver: 'University',
    purpose: 'Tuition payment',
    deposit: '',
    transport: '',
    food: '',
    medication: '',
    house: '',
    car: '',
    school: '500.00',
    diverse: '',
  };
  yearData['January'][7] = {
    id: 8,
    date: '',
    receiver: 'Coffee Shop',
    purpose: 'Work meetings',
    deposit: '',
    transport: '',
    food: '32.00',
    medication: '',
    house: '',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['January'][8] = {
    id: 9,
    date: '2024-01-20',
    receiver: 'Netflix',
    purpose: 'Monthly subscription',
    deposit: '',
    transport: '',
    food: '',
    medication: '',
    house: '',
    car: '',
    school: '',
    diverse: '15.99',
  };
  yearData['January'][9] = {
    id: 10,
    date: '',
    receiver: 'Electric Co.',
    purpose: 'Electric bill',
    deposit: '',
    transport: '',
    food: '',
    medication: '',
    house: '95.00',
    car: '',
    school: '',
    diverse: '',
  };
  
  // Add some data for February
  yearData['February'][0] = {
    id: 1,
    date: '2024-02-01',
    receiver: 'City Transit',
    purpose: 'Monthly bus pass',
    deposit: '',
    transport: '85.00',
    food: '',
    medication: '',
    house: '',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['February'][1] = {
    id: 2,
    date: '2024-02-05',
    receiver: 'Employer Inc.',
    purpose: 'February salary',
    deposit: '3500.00',
    transport: '',
    food: '',
    medication: '',
    house: '',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['February'][2] = {
    id: 3,
    date: '',
    receiver: 'Landlord',
    purpose: 'Monthly rent',
    deposit: '',
    transport: '',
    food: '',
    medication: '',
    house: '1200.00',
    car: '',
    school: '',
    diverse: '',
  };
  yearData['February'][3] = {
    id: 4,
    date: '2024-02-14',
    receiver: 'Restaurant',
    purpose: 'Valentine dinner',
    deposit: '',
    transport: '',
    food: '120.00',
    medication: '',
    house: '',
    car: '',
    school: '',
    diverse: '',
  };
  
  return yearData;
};
