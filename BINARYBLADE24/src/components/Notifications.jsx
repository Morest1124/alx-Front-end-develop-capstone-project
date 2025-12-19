import React, { useState, useEffect, useContext } from 'react';
import { Bell, Filter } from 'lucide-react';
import { useRouter } from '../contexts/Routers';
import { AuthContext } from '../contexts/AuthContext';
import { getNotifications, markNotificationRead } from '../api';
import Loader from './Loader';

const Notifications = () => {
  const { navigate } = useRouter();
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, notifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      const notificationsArray = Array.isArray(data) ? data : (data.results || []);
      setNotifications(notificationsArray);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = notifications;
    if (filter === 'unread') {
      filtered = notifications.filter(n => !n.is_read);
    } else if (filter === 'read') {
      filtered = notifications.filter(n => n.is_read);
    }
    setFilteredNotifications(filtered);
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if unread
      if (!notification.is_read) {
        await markNotificationRead(notification.id);

        // Update local state
        setNotifications(prevNotifs =>
          prevNotifs.map(n =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
      }

      // Navigate if URL provided
      if (notification.link_url) {
        navigate(notification.link_url);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    // Return different icons based on notification type
    return <Bell size={20} className="text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your latest activity</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 px-6 font-medium transition-colors ${filter === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          All
          <span className="ml-2 text-sm text-gray-500">
            ({notifications.length})
          </span>
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-3 px-6 font-medium transition-colors ${filter === 'unread'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Unread
          <span className="ml-2 text-sm text-gray-500">
            ({notifications.filter(n => !n.is_read).length})
          </span>
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`pb-3 px-6 font-medium transition-colors ${filter === 'read'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Read
          <span className="ml-2 text-sm text-gray-500">
            ({notifications.filter(n => n.is_read).length})
          </span>
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <Bell size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
          </h3>
          <p className="text-gray-500">
            {filter === 'all'
              ? "You'll see notifications here when you receive them"
              : `No ${filter} notifications to show`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${!notif.is_read
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  {/* Icon */}
                  <div className={`p-2 rounded-full mr-4 ${!notif.is_read ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                    {getNotificationIcon(notif.notification_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`text-base ${!notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'
                        }`}>
                        {notif.title}
                      </h3>
                      {!notif.is_read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0 mt-2" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center text-xs text-gray-400">
                      <span>{notif.time_ago}</span>
                      {notif.notification_type && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{notif.notification_type.replace('_', ' ').toLowerCase()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
