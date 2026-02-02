import React, { useState } from 'react';
import { expenseAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

export const APITest = () => {
  const [status, setStatus] = useState('Not tested');

  const testAPI = async () => {
    try {
      setStatus('Testing...');
      
      // Test saving data
      const testData = [
        {
          id: 1,
          date: '2024-01-01',
          receiver: 'Test',
          purpose: 'API Test',
          deposit: '100',
          transport: '',
          food: '50',
          medication: '',
          house: '',
          car: '',
          school: '',
          diverse: ''
        }
      ];

      await expenseAPI.saveMonthExpenses('January', 2024, testData);
      setStatus(' Save successful!');

      // Test retrieving data
      const retrieved = await expenseAPI.getMonthExpenses(2024, 'January');
      console.log('Retrieved:', retrieved);
      
      if (retrieved) {
        setStatus(' All tests passed! API is working.');
      }
    } catch (error) {
      setStatus(` Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">API Connection Test</h3>
      <p className="mb-2">Status: {status}</p>
      <Button onClick={testAPI}>Test API Connection</Button>
    </div>
  );
};