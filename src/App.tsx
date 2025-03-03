import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FormulaInput from './components/FormulaInput';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Input function      
          </h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formula Input
              </label>
              <FormulaInput />
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Instructions</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Type to search for variables</li>
                <li>Click on a tag to edit it</li>
                <li>Use operators (+, -, *, /, ^, (, )) between variables</li>
                <li>Press backspace to delete tags</li>
                <li>Press Enter to select autocomplete suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;