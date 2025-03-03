
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tag, Suggestion } from "./FormulaInput";
import { getSuggestions } from "../services/api";

interface TagItemProps {
  tag: Tag;
  onRemove: () => void;
  onUpdate: (updatedTag: Tag) => void;
  onClick?: () => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState(tag.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["tagSuggestions", searchText],
    queryFn: () => getSuggestions(searchText),
    enabled: isEditing && tag.type === "variable" && searchText.length > 0,
    staleTime: 60000,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTagColor = () => {
    switch (tag.type) {
      case "variable":
        return "bg-blue-100 border-blue-300";
      case "operator":
        return "bg-gray-100 border-gray-300";
      case "number":
        return "bg-green-100 border-green-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onUpdate({ ...tag, name: suggestion.name, value: suggestion.value });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (tag.type === "variable" && suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else {
        onUpdate({ ...tag, name: searchText, value: isNaN(Number(searchText)) ? 0 : Number(searchText) });
      }
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <div className="relative mr-1 my-1" ref={dropdownRef}>
      <div
        className={`flex items-center px-2 py-1 rounded-md border ${getTagColor()} cursor-pointer`}
        onClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-16 border-none outline-none bg-transparent"
          />
        ) : (
          <span>{tag.name}</span>
        )}
        {tag.type !== "operator" && (
          <button
            className="ml-1 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            &times;
          </button>
        )}
      </div>

      {isEditing && tag.type === "variable" && (
        <div className="absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-300">
          <div className="p-2">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-1 border rounded"
              placeholder="Search..."
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-2 text-gray-500">Loading...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div>{suggestion.name}</div>
                  <div className="text-xs text-gray-500">{suggestion.category || "Variable"}</div>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No suggestions found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagItem;
