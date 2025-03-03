// src/types/index.ts
export interface Suggestion {
    id: string;
    name: string;
    category?: string;
    value: number;
  }
  
  export interface Tag {
    id: string;
    name: string;
    category: string;
    value: number;
    type: 'variable' | 'operator' | 'number';
  }
  
  export interface FormulaState {
    tags: Tag[];
    result: number | null;
    addTag: (tag: Tag) => void;
    removeTag: (id: string) => void;
    updateTag: (id: string, updatedTag: Tag) => void;
    calculateFormula: () => void;
  }