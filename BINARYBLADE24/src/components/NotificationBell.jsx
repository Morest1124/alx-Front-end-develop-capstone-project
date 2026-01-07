import React, { useState, useEffect, useContext } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from '../contexts/Routers';
import { AuthContext } from '../contexts/AuthContext';
import { getUnreadCount, getNotifications, markNotificationRead, markAllNotificationsRead } from '../api';

const NotificationBell = () => {
    const { navigate } = useRouter();
    const { user } = useContext(AuthContext);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // Poll for unread count every 30 seconds
    useEffect(() => {
        if (user?.isLoggedIn) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000); // 30 seconds
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const data = await getUnreadCount();
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Failed to display unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            const notificationsArray = Array.isArray(data) ? data : (data.results || []);
            setNotifications(notificationsArray.slice(0, 5)); // Show latest 5
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBellClick = async () => {
        if (!showDropdown) {
            await fetchNotifications();
        }
        setShowDropdown(!showDropdown);
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read
            if (!notification.is_read) {
                await markNotificationRead(notification.id);
                setUnreadCount(prev => Math.max(0, prev - 1));

                // Update local notification state
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

            setShowDropdown(false);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllRead = async (e) => {
        e.stopPropagation();
        try {
            await markAllNotificationsRead();
            setUnreadCount(0);
            setNotifications(prevNotifs =>
                prevNotifs.map(n => ({ ...n, is_read: true }))
            );
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleViewAll = () => {
        navigate('/notifications');
        setShowDropdown(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.notification-bell-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    if (!user?.isLoggedIn) {
        return null;
    }

    return (
        <div className="relative notification-bell-container">
            <button
                onClick={handleBellClick}
                className="relative p-2 hover:bg-[var(--color-accent-light)] rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell size={24} className="text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[var(--color-accent)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                        <h3 className="font-semibold text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 border-b cursor-pointer hover:bg-[var(--color-accent-light)] transition-colors ${!notif.is_read ? 'bg-[var(--color-accent-light)]' : ''
                                        }`}
                                >
                                    <div className="flex items-start">
                                        {!notif.is_read && (
                                            <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full mt-2 mr-3 flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notif.is_read ? 'font-semibold' : 'font-medium'} text-gray-900 mb-1`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {notif.time_ago}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t text-center bg-gray-50 rounded-b-lg">
                        <button
                            onClick={handleViewAll}
                            className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium hover:underline"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
