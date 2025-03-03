import { create } from 'zustand';
import { Tag } from '../components/FormulaInput';
import { evaluate } from 'mathjs';

interface FormulaState {
  tags: Tag[];
  result: number | null;
  addTag: (tag: Tag) => void;
  removeTag: (id: string) => void;
  updateTag: (id: string, updatedTag: Tag) => void;
  insertTagAt: (index: number, tag: Tag) => void;
  calculateFormula: () => void;
}

// Helper function to evaluate the formula
const evaluateFormula = (tags: Tag[]): number | null => {
    if (tags.length === 0) return null;
  
    try {
      const formula = tags.map(tag => (tag.type === 'operator' ? tag.name : tag.value.toString())).join(' ');
      return evaluate(formula); // Math.js safely evaluates formulas
    } catch (error) {
      console.error('Error evaluating formula:', error);
      return null;
    }
  };

export const useFormulaStore = create<FormulaState>((set, get) => ({
  tags: [],
  result: null,
  
  addTag: (tag: Tag) => set((state) => ({ 
    tags: [...state.tags, tag]
  })),
  
  removeTag: (id: string) => set((state) => ({ 
    tags: state.tags.filter(tag => tag.id !== id)
  })),
  
  updateTag: (id: string, updatedTag: Tag) => set((state) => ({
    tags: state.tags.map(tag => tag.id === id ? updatedTag : tag)
  })),


  insertTagAt: (index: number, tag: Tag) => set((state) => {
    const newTags = [...state.tags];
    newTags.splice(index, 0, tag); // Insert the tag at the given index
    return { tags: newTags };
  }),

  
  calculateFormula: () => set((state) => ({
    result: evaluateFormula(state.tags)
  }))
}));

  