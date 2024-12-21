import React from 'react';
import { List, Trash2 } from 'lucide-react';

function SavedEmailLists({ savedLists, onSelectList, onDeleteList }) {
  if (Object.keys(savedLists).length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Saved Email Lists
      </label>
      <div className="space-y-2">
        {Object.entries(savedLists).map(([name, emails]) => (
          <div
            key={name}
            className="flex items-center justify-between p-3 bg-gray-50 
                     rounded-lg border border-gray-200 hover:border-gray-300 
                     transition-colors group"
          >
            <button
              type="button"
              onClick={() => onSelectList(emails)}
              className="flex items-center flex-1 text-left"
            >
              <List className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <span className="text-sm font-medium text-gray-700">{name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({emails.length} {emails.length === 1 ? 'email' : 'emails'})
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onDeleteList(name)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              aria-label={`Delete ${name} list`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default SavedEmailLists;