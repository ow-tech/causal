import React from 'react';
import { Suggestion } from './FormulaInput';

interface AutocompleteProps {
  suggestions: Suggestion[];
  isLoading: boolean;
  onSelect: (suggestion: Suggestion) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ suggestions, isLoading, onSelect }) => {
  if (isLoading) {
    return (
      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
        <div className="p-2 text-gray-500">Loading suggestions...</div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
      <div className="max-h-48 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion.id}
            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
            onClick={() => onSelect(suggestion)}
          >
            <div>
              <div className="font-medium">{suggestion.name}</div>
              <div className="text-xs text-gray-500">{suggestion.category}</div>
            </div>
            <div className="text-sm text-gray-500">{suggestion.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Autocomplete;