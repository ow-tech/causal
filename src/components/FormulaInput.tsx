// src/components/FormulaInput.tsx
import React, { useState, useRef, useEffect } from "react";
import { useFormulaStore } from "../stores/formulaStore";
import TagItem from "./TagItem";
import Autocomplete from "./Autocomplete";
import { getSuggestions } from "../services/api";
import { useQuery } from "@tanstack/react-query";

// Types
export interface Tag {
  id: string;
  name: string;
  category: string;
  value: number;
  type: "variable" | "operator" | "number";
}

export interface Suggestion {
  id: string;
  name: string;
  category: string;
  value: number;
}

const OPERATORS = ["+", "-", "*", "/", "(", ")", "^"];

const FormulaInput: React.FC = () => {
  const { tags, addTag, removeTag, updateTag, insertTagAt, calculateFormula } =
    useFormulaStore();
  const [inputValue, setInputValue] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(tags.length);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [cursorIndex]);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["suggestions", inputValue],
    queryFn: () => getSuggestions(inputValue),
    enabled: inputValue.length > 0 && showAutocomplete,
    staleTime: 60000,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowAutocomplete(
      e.target.value.length > 0 && !OPERATORS.includes(e.target.value)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && cursorIndex > 0) {
      removeTag(tags[cursorIndex - 1].id);
      setCursorIndex(cursorIndex - 1);
      return;
    }

    if (OPERATORS.includes(e.key)) {
      e.preventDefault();
      if (inputValue.trim() !== "" && !isNaN(Number(inputValue))) {
        handleInsertTag(cursorIndex, {
          id: `number-${Date.now()}`,
          name: inputValue,
          category: "number",
          value: Number(inputValue),
          type: "number",
        });
      }
      handleInsertTag(cursorIndex, {
        id: `operator-${Date.now()}`,
        name: e.key,
        category: "operator",
        value: 0,
        type: "operator",
      });
    }

    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!isNaN(Number(inputValue))) {
        handleInsertTag(cursorIndex, {
          id: `number-${Date.now()}`,
          name: inputValue,
          category: "number",
          value: Number(inputValue),
          type: "number",
        });
      } else if (showAutocomplete && suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      }
    }

    if (e.key === "ArrowLeft" && cursorIndex > 0) {
      setCursorIndex(cursorIndex - 1);
    }
    if (e.key === "ArrowRight" && cursorIndex < tags.length) {
      setCursorIndex(cursorIndex + 1);
    }
  };

  const handleInsertTag = (index: number, newTag: Tag) => {
    insertTagAt(index, newTag);
    setCursorIndex(index + 1);
    setInputValue("");
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    handleInsertTag(cursorIndex, {
      id: suggestion.id,
      name: suggestion.name,
      category: suggestion.category,
      value: suggestion.value,
      type: "variable",
    });
  };

  const handleContainerClick = (index: number) => {
    setCursorIndex(index);
    inputRef.current?.focus();
  };

  useEffect(() => {
    calculateFormula();
  }, [tags, calculateFormula]);

  return (
    <div className="relative">
      <div
        className="flex flex-wrap items-center p-2 border rounded-md bg-white min-h-10 focus-within:ring-2 focus-within:ring-blue-500"
      >
        {tags.map((tag, index) => (
          <React.Fragment key={tag.id}>
            {cursorIndex === index && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="outline-none px-1 min-w-20"
              />
            )}
            <TagItem
              tag={tag}
              onRemove={() => removeTag(tag.id)}
              onUpdate={(updatedTag) => updateTag(tag.id, updatedTag)}
              onClick={() => handleContainerClick(index + 1)}
            />
          </React.Fragment>
        ))}

        {cursorIndex === tags.length && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="outline-none px-1 min-w-20"
            placeholder={tags.length === 0 ? "Enter formula..." : ""}
          />
        )}
      </div>

      {showAutocomplete && suggestions.length > 0 && (
        <Autocomplete
          suggestions={suggestions}
          isLoading={isLoading}
          onSelect={handleSelectSuggestion}
        />
      )}

      {tags.length > 0 && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md">
          <div className="font-bold">Formula Result:</div>
          <div>{useFormulaStore.getState().result || "Invalid formula"}</div>
        </div>
      )}
    </div>
  );
};

export default FormulaInput;
