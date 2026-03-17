import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (!userInfo.token) return;

      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${userInfo.token}` },
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100 animate-fade-in-up">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{unreadCount} new</span>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                You have no notifications.
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <li 
                    key={notification._id} 
                    onClick={() => markAsRead(notification._id, notification.isRead)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === 'order_update' ? '📦' : '✨'}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0 mt-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600 block"></span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <button onClick={() => setIsOpen(false)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
