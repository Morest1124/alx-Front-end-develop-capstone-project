import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
  getUserAccount,
  updateUserAccount,
  changePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
  getUserPreferences,
  updateUserPreferences,
  getCountries,
  getTimezones,
} from '../api';
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Eye,
  Settings as SettingsIcon,
  Save,
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  FileText,
  Briefcase,
  Star,
  Moon,
  Sun,
} from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states for different sections
  const [accountData, setAccountData] = useState({
    fullName: user.name || '',
    email: user.email || '',
    phone: '',
    address: '',
    country: '',
    timezone: 'UTC',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNewMessage: true,
    emailPaymentReceived: true,
    emailProposalSubmitted: true,
    emailSystemUpdates: true,
    pushNotifications: true,
    marketingEmails: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    darkMode: false,
    defaultView: user.role?.toLowerCase() === 'client' ? '/client/dashboard' : '/freelancer/dashboard',
  });

  const [countries, setCountries] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
    loadCountriesAndTimezones();
  }, []);

  const loadSettings = async () => {
    try {
      // Load notification preferences
      const notifPrefs = await getNotificationPreferences();
      setNotificationPrefs({
        emailNewMessage: notifPrefs.email_new_message,
        emailPaymentReceived: notifPrefs.email_payment_received,
        emailProposalSubmitted: notifPrefs.email_proposal_submitted,
        emailSystemUpdates: notifPrefs.email_system_updates,
        pushNotifications: notifPrefs.push_notifications,
        marketingEmails: notifPrefs.marketing_emails,
      });

      // Load user preferences
      const userPrefs = await getUserPreferences();
      setPreferences({
        language: userPrefs.language,
        darkMode: userPrefs.dark_mode,
        timezone: userPrefs.timezone || 'UTC',
        defaultView: userPrefs.default_view || (user.role?.toLowerCase() === 'client' ? '/client/dashboard' : '/freelancer/dashboard'),
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadCountriesAndTimezones = async () => {
    try {
      const [countriesData, timezonesData] = await Promise.all([
        getCountries(),
        getTimezones()
      ]);
      setCountries(countriesData);
      setTimezones(timezonesData);
    } catch (error) {
      console.error('Error loading countries and timezones:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'profile', label: 'Profile & Visibility', icon: Eye },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
  ];

  const handleSave = async (section) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (section === 'Account') {
        await updateUserAccount(accountData);
      } else if (section === 'Password') {
        if (securityData.newPassword !== securityData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await changePassword({
          current_password: securityData.currentPassword,
          new_password: securityData.newPassword,
        });
        // Clear password fields after successful change
        setSecurityData({
          ...securityData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else if (section === 'Notifications') {
        await updateNotificationPreferences({
          email_new_message: notificationPrefs.emailNewMessage,
          email_payment_received: notificationPrefs.emailPaymentReceived,
          email_proposal_submitted: notificationPrefs.emailProposalSubmitted,
          email_system_updates: notificationPrefs.emailSystemUpdates,
          push_notifications: notificationPrefs.pushNotifications,
          marketing_emails: notificationPrefs.marketingEmails,
        });
      } else if (section === 'Preferences') {
        await updateUserPreferences({
          language: preferences.language,
          dark_mode: preferences.darkMode,
          default_view: preferences.defaultView,
          timezone: preferences.timezone || 'UTC',
        });
      }

      setSuccessMessage(`${section} settings saved successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save settings. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const renderAccountManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Management</h2>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={accountData.fullName}
              onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={accountData.email}
              onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={accountData.phone}
              onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Country
            </label>
            <select
              value={accountData.country}
              onChange={(e) => setAccountData({ ...accountData, country: e.target.value })}
              disabled={loadingData}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">{loadingData ? 'Loading...' : 'Select Country'}</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Address
            </label>
            <input
              type="text"
              value={accountData.address}
              onChange={(e) => setAccountData({ ...accountData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe size={16} className="inline mr-2" />
              Timezone
            </label>
            <select
              value={accountData.timezone}
              onChange={(e) => setAccountData({ ...accountData, timezone: e.target.value })}
              disabled={loadingData}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">{loadingData ? 'Loading...' : 'Select Timezone'}</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Current Role:</strong> {user.role}
              {user.availableRoles?.length > 1 && (
                <span className="ml-2 text-blue-600">(You can switch roles from the navbar)</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSave('Account')}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
        >
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
          Deactivate Account
        </button>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security & Login</h2>
        <p className="text-gray-600">Manage your password and security settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={securityData.currentPassword}
              onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={securityData.newPassword}
              onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={() => handleSave('Password')}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
        >
          <Save size={16} className="mr-2" />
          Update Password
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700 mb-1">
              <Shield size={16} className="inline mr-2" />
              Add an extra layer of security to your account
            </p>
            <p className="text-xs text-gray-500">
              Status: {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <button
            onClick={() => setSecurityData({ ...securityData, twoFactorEnabled: !securityData.twoFactorEnabled })}
            className={`px-6 py-2 rounded-lg ${securityData.twoFactorEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            {securityData.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Login History</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Windows • Chrome</p>
              <p className="text-xs text-gray-500">New York, USA • 2 hours ago</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Current</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">iPhone • Safari</p>
              <p className="text-xs text-gray-500">New York, USA • 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications & Alerts</h2>
        <p className="text-gray-600">Manage how you receive notifications</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
          <div className="space-y-3">
            {Object.entries({
              emailNewMessage: 'New Message Received',
              emailPaymentReceived: 'Payment Received',
              emailProposalSubmitted: 'Proposal Submitted',
              emailSystemUpdates: 'System Updates',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs[key]}
                    onChange={(e) => setNotificationPrefs({ ...notificationPrefs, [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Enable Push Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationPrefs.pushNotifications}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, pushNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing & Promotions</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Receive promotional emails</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationPrefs.marketingEmails}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, marketingEmails: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <button
          onClick={() => handleSave('Notifications')}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
        >
          <Save size={16} className="mr-2" />
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderBilling = () => {
    const isClient = user.role?.toUpperCase() === 'CLIENT';

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payments</h2>
          <p className="text-gray-600">
            {isClient ? 'Manage your payment methods and billing history' : 'Manage your payout methods and earnings'}
          </p>
        </div>

        {isClient ? (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard size={24} className="text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/2025</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>
                </div>
              </div>
              <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                + Add Payment Method
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Project Payment</p>
                    <p className="text-xs text-gray-500">Dec 1, 2025</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">$250.00</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign size={24} className="text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">PayPal</p>
                      <p className="text-xs text-gray-500">user@example.com</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>
                </div>
              </div>
              <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                + Add Payout Method
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Information</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <FileText size={16} className="inline mr-2" />
                  Please complete your tax information to receive payments
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Update Tax Information
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-900">$5,240</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-blue-900">$1,200</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-purple-900">$450</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    const isFreelancer = user.role?.toUpperCase() === 'FREELANCER';

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile & Public Visibility</h2>
          <p className="text-gray-600">
            {isFreelancer ? 'Manage your public profile and marketplace visibility' : 'Manage your profile settings'}
          </p>
        </div>

        {isFreelancer ? (
          <>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell clients about your skills and experience..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase size={16} className="inline mr-2" />
                  Skills & Expertise
                </label>
                <input
                  type="text"
                  placeholder="e.g., Web Development, UI/UX Design, React"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign size={16} className="inline mr-2" />
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Available Now</option>
                    <option>Less Than 30 Hours/Week</option>
                    <option>Unavailable</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Public Profile</p>
                    <p className="text-xs text-gray-500">Show your profile in search results</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Show Earnings</p>
                    <p className="text-xs text-gray-500">Display total earnings on profile</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSave('Profile')}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              <Save size={16} className="mr-2" />
              Save Profile
            </button>
          </>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800">
              <Eye size={20} className="inline mr-2" />
              Profile visibility settings are primarily for freelancers. As a client, your profile is private by default.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderPreferences = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Preferences</h2>
        <p className="text-gray-600">Customize your experience</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe size={16} className="inline mr-2" />
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={preferences.timezone || 'UTC'}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                disabled={loadingData}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{loadingData ? 'Loading...' : 'Select Timezone'}</option>
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              {preferences.darkMode ? (
                <Moon size={20} className="text-gray-600 mr-3" />
              ) : (
                <Sun size={20} className="text-gray-600 mr-3" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                <p className="text-xs text-gray-500">Use dark theme across the application</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.darkMode}
                onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Default View</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dashboard on Login
            </label>
            <select
              value={preferences.defaultView}
              onChange={(e) => setPreferences({ ...preferences, defaultView: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {user.role?.toUpperCase() === 'CLIENT' ? (
                <>
                  <option value="/client/dashboard">My Dashboard</option>
                  <option value="/client/projects">My Projects</option>
                  <option value="/client/talent">Find Talent</option>
                </>
              ) : (
                <>
                  <option value="/freelancer/dashboard">My Dashboard</option>
                  <option value="/freelancer/jobs">Find Work</option>
                  <option value="/freelancer/projects">My Projects</option>
                </>
              )}
            </select>
          </div>
        </div>

        <button
          onClick={() => handleSave('Preferences')}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
        >
          <Save size={16} className="mr-2" />
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountManagement();
      case 'security':
        return renderSecurity();
      case 'notifications':
        return renderNotifications();
      case 'billing':
        return renderBilling();
      case 'profile':
        return renderProfile();
      case 'preferences':
        return renderPreferences();
      default:
        return renderAccountManagement();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
