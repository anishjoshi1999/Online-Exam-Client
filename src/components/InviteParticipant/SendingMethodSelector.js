import React from 'react';
import { Mail, Link, Hash } from 'lucide-react';

const methods = [
  { id: 'email', label: 'Provide Access & Invite via Email', icon: Mail },
  // { id: 'link', label: 'Share Invite Link', icon: Link },
  // { id: 'code', label: 'Share Exam Code', icon: Hash }
];

function SendingMethodSelector({ sendingMethod, setSendingMethod }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        How would you like to invite participants?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {methods.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSendingMethod(id)}
            className={`flex items-center p-3 rounded-lg border ${
              sendingMethod === id
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } transition-all duration-200`}
          >
            <Icon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SendingMethodSelector;