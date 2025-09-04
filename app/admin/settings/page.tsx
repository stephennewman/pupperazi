'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';

interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

interface GoogleVoiceSettings {
  enabled: boolean;
  phoneNumber: string;
  apiKey: string;
  webhookUrl: string;
}

interface NotificationSettings {
  emailConfirmations: boolean;
  smsReminders: boolean;
  reminderHours: number;
  autoConfirmations: boolean;
}

export default function SettingsPage() {
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { open: '08:00', close: '17:30', closed: false },
    tuesday: { open: '08:00', close: '17:30', closed: false },
    wednesday: { open: '08:00', close: '17:30', closed: false },
    thursday: { open: '08:00', close: '17:30', closed: false },
    friday: { open: '08:00', close: '17:30', closed: false },
    saturday: { open: '08:00', close: '17:00', closed: false },
    sunday: { open: '08:00', close: '17:00', closed: true }
  });

  const [googleVoice, setGoogleVoice] = useState<GoogleVoiceSettings>({
    enabled: false,
    phoneNumber: '',
    apiKey: '',
    webhookUrl: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailConfirmations: true,
    smsReminders: false,
    reminderHours: 24,
    autoConfirmations: false
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hours' | 'voice' | 'notifications'>('hours');
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
    loadSettings();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const loadSettings = async () => {
    try {
      // In a real app, this would load from your database
      // For now, we'll use the default values set above
      console.log('Loading settings...');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to your database
      console.log('Saving settings...', { businessHours, googleVoice, notifications });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessHours = (day: keyof BusinessHours, field: string, value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Configure business operations</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {saving ? 'Saving...' : '💾 Save Settings'}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  router.push('/admin/login');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNavigation activeTab="settings" />

        {/* Settings Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('hours')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'hours'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🕒 Business Hours
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'voice'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📞 Google Voice
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🔔 Notifications
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Business Hours Tab */}
            {activeTab === 'hours' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Business Hours</h2>
                <p className="text-gray-600 mb-6">
                  Set your operating hours for each day of the week. Customers can only book appointments during these times.
                </p>

                <div className="space-y-4">
                  {daysOfWeek.map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-24">
                        <label className="font-medium text-gray-900">{label}</label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!businessHours[key as keyof BusinessHours].closed}
                          onChange={(e) => updateBusinessHours(key as keyof BusinessHours, 'closed', !e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label className="text-sm text-gray-700">Open</label>
                      </div>

                      {!businessHours[key as keyof BusinessHours].closed && (
                        <>
                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Open:</label>
                            <input
                              type="time"
                              value={businessHours[key as keyof BusinessHours].open}
                              onChange={(e) => updateBusinessHours(key as keyof BusinessHours, 'open', e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Close:</label>
                            <input
                              type="time"
                              value={businessHours[key as keyof BusinessHours].close}
                              onChange={(e) => updateBusinessHours(key as keyof BusinessHours, 'close', e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </>
                      )}

                      {businessHours[key as keyof BusinessHours].closed && (
                        <span className="text-red-600 font-medium">Closed</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Customers can only book during your open hours</li>
                    <li>• Changes take effect immediately for new bookings</li>
                    <li>• Existing appointments are not affected by hour changes</li>
                    <li>• Consider buffer time between appointments for cleaning</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Google Voice Tab */}
            {activeTab === 'voice' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Google Voice Integration</h2>
                <p className="text-gray-600 mb-6">
                  Connect your Google Voice account to automatically handle appointment calls and SMS reminders.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="voice-enabled"
                      checked={googleVoice.enabled}
                      onChange={(e) => setGoogleVoice({...googleVoice, enabled: e.target.checked})}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="voice-enabled" className="font-medium text-gray-900">
                      Enable Google Voice Integration
                    </label>
                  </div>

                  {googleVoice.enabled && (
                    <div className="space-y-4 pl-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Voice Phone Number
                        </label>
                        <input
                          type="tel"
                          value={googleVoice.phoneNumber}
                          onChange={(e) => setGoogleVoice({...googleVoice, phoneNumber: e.target.value})}
                          placeholder="(555) 123-4567"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key
                        </label>
                        <input
                          type="password"
                          value={googleVoice.apiKey}
                          onChange={(e) => setGoogleVoice({...googleVoice, apiKey: e.target.value})}
                          placeholder="Your Google Voice API Key"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={googleVoice.webhookUrl}
                          onChange={(e) => setGoogleVoice({...googleVoice, webhookUrl: e.target.value})}
                          placeholder="https://your-app.com/webhook/google-voice"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Receive real-time notifications when customers call or text
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚙️ Setup Instructions:</h4>
                  <ol className="text-sm text-yellow-700 space-y-1">
                    <li>1. Go to <a href="https://voice.google.com" className="underline">Google Voice</a> and sign in</li>
                    <li>2. Get your API key from Google Cloud Console</li>
                    <li>3. Enable Voice API and set up authentication</li>
                    <li>4. Configure webhook URL for real-time updates</li>
                    <li>5. Test the integration with a sample call</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                <p className="text-gray-600 mb-6">
                  Configure how customers are notified about their appointments and reminders.
                </p>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Confirmations</h4>
                        <p className="text-sm text-gray-600">Send confirmation emails after booking</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailConfirmations}
                        onChange={(e) => setNotifications({...notifications, emailConfirmations: e.target.checked})}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Reminders</h4>
                        <p className="text-sm text-gray-600">Send text reminders before appointments</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsReminders}
                        onChange={(e) => setNotifications({...notifications, smsReminders: e.target.checked})}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Auto Confirmations</h4>
                        <p className="text-sm text-gray-600">Automatically confirm appointments</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.autoConfirmations}
                        onChange={(e) => setNotifications({...notifications, autoConfirmations: e.target.checked})}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Timing
                    </label>
                    <select
                      value={notifications.reminderHours}
                      onChange={(e) => setNotifications({...notifications, reminderHours: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value={1}>1 hour before</option>
                      <option value={2}>2 hours before</option>
                      <option value={4}>4 hours before</option>
                      <option value={12}>12 hours before</option>
                      <option value={24}>24 hours before</option>
                      <option value={48}>48 hours before</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Benefits:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Reduce no-show rates by 30% with reminders</li>
                    <li>• Professional communication builds trust</li>
                    <li>• Automated system saves time</li>
                    <li>• Customizable timing and methods</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving Settings...
              </div>
            ) : (
              '💾 Save All Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
