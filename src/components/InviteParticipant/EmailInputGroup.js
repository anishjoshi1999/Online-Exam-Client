import React from 'react';
import { Mail, Trash2 } from 'lucide-react';

function EmailInputGroup({ email, index, updateEmail, removeEmailField, showRemove }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => updateEmail(index, e.target.value)}
          placeholder="Enter email address"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>
      
      {showRemove && (
        <button
          type="button"
          onClick={() => removeEmailField(index)}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Remove email field"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export default EmailInputGroup;