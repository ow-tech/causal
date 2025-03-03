import axios from 'axios';
import { Suggestion } from '../components/FormulaInput';

// Create axios instance
const api = axios.create({
  baseURL: 'https://652f91320b8d8ddac0b2b62b.mockapi.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get suggestions from the provided API endpoint
export const getSuggestions = async (query: string): Promise<Suggestion[]> => {
  try {
    const response = await api.get<Suggestion[]>('/autocomplete');
    
    // Filter results based on query
    const filteredResults = response.data.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredResults;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};