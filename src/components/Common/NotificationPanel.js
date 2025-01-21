import React from 'react';
import { Bell, X } from 'lucide-react';

const NotificationPanel = ({ notifications, onClose, loading }) => {
  return (
    <div className="fixed inset-x-0 top-16 mx-4 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-96 z-[9999]">
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 max-w-lg mx-auto md:mx-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 text-lg">Notifications</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Notification Content */}
        <div className="max-h-[70vh] md:max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 break-words">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No new notifications</p>
              <p className="text-sm text-gray-400 mt-1">
                We'll notify you when something arrives
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium p-1 rounded hover:bg-gray-100 transition-colors"
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;