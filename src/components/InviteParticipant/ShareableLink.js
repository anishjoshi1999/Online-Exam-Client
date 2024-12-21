import React from 'react';
import { Copy, Link as LinkIcon, Hash } from 'lucide-react';

function ShareableLink({ type, examId }) {
  const content = type === 'link' 
    ? `${window.location.origin}/exam/${examId}`
    : examId;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert(`${type === 'link' ? 'Link' : 'Code'} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {type === 'link' ? (
          <LinkIcon className="h-5 w-5 text-blue-600" />
        ) : (
          <Hash className="h-5 w-5 text-blue-600" />
        )}
        <span>
          {type === 'link' ? 'Invite Link' : 'Exam Code'}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 truncate text-sm text-gray-600 font-mono bg-white 
                      px-3 py-2 rounded border border-gray-200">
          {content}
        </div>
        
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex items-center px-3 py-2 border border-transparent 
                   text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-blue-500 transition-all duration-200 group whitespace-nowrap"
        >
          <Copy className="mr-2 h-4 w-4 group-hover:rotate-6 transition-transform" />
          Copy {type === 'link' ? 'Link' : 'Code'}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        {type === 'link'
          ? 'Share this link with participants to join the exam'
          : 'Share this code with participants to join the exam'}
      </p>
    </div>
  );
}

export default ShareableLink;