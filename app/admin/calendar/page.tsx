'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: {
    id: string;
    customerName: string;
    petName: string;
    service: string;
  };
}

interface DaySchedule {
  date: string;
  isClosed: boolean;
  timeSlots: TimeSlot[];
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [schedule, setSchedule] = useState<DaySchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadSchedule(selectedDate);
    }
  }, [selectedDate]);

  const checkAuthentication = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const loadSchedule = async (date: string) => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your database
      // For now, we'll use mock data
      const mockSchedule: DaySchedule = {
        date,
        isClosed: false,
        timeSlots: generateTimeSlots(date)
      };

      setSchedule(mockSchedule);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    const interval = 30; // 30-minute intervals

    // Check if it's a weekend (closed)
    const dateObj = new Date(date);
    if (dateObj.getDay() === 0) { // Sunday
      return []; // Closed
    }

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        // Mock appointments for demo
        let appointment;
        if (Math.random() > 0.7) { // 30% chance of having an appointment
          appointment = {
            id: `APPT-${Math.random().toString(36).substr(2, 9)}`,
            customerName: ['John Doe', 'Jane Smith', 'Mike Johnson'][Math.floor(Math.random() * 3)],
            petName: ['Max', 'Bella', 'Charlie'][Math.floor(Math.random() * 3)],
            service: ['Bath Time Bliss', 'Mini Makeover', 'Full Glam Groom'][Math.floor(Math.random() * 3)]
          };
        }

        slots.push({
          time: displayTime,
          available: !appointment,
          appointment
        });
      }
    }

    return slots;
  };

  const toggleTimeSlot = async (timeSlot: TimeSlot) => {
    if (!schedule) return;

    try {
      // In a real app, this would update the database
      setSchedule(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          timeSlots: prev.timeSlots.map(slot =>
            slot.time === timeSlot.time
              ? { ...slot, available: !slot.available, appointment: slot.available ? undefined : slot.appointment }
              : slot
          )
        };
      });
    } catch (error) {
      console.error('Error updating time slot:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate === formatDate(date);
  };

  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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
                <h1 className="text-xl font-bold text-gray-900">Calendar Management</h1>
                <p className="text-sm text-gray-500">Manage availability and appointments</p>
              </div>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNavigation activeTab="calendar" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => (
                  <div key={index} className="min-h-[80px] p-1">
                    {date ? (
                      <button
                        onClick={() => setSelectedDate(formatDate(date))}
                        className={`w-full h-full p-2 text-left rounded-lg transition-colors ${
                          isToday(date)
                            ? 'bg-blue-100 text-blue-900 font-semibold'
                            : isSelected(date)
                            ? 'bg-purple-100 text-purple-900 font-semibold'
                            : isWeekend(date)
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'hover:bg-gray-100 text-gray-900'
                        }`}
                        disabled={isWeekend(date)}
                      >
                        <span className="text-sm">{date.getDate()}</span>
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                }) : 'Select a Date'}
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : schedule ? (
                <div className="space-y-2">
                  {schedule.isClosed ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>🏠 Closed</p>
                    </div>
                  ) : schedule.timeSlots.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>🏠 Closed (Weekend)</p>
                    </div>
                  ) : (
                    schedule.timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border transition-colors ${
                          slot.available
                            ? slot.appointment
                              ? 'bg-red-50 border-red-200 cursor-pointer hover:bg-red-100'
                              : 'bg-green-50 border-green-200 cursor-pointer hover:bg-green-100'
                            : 'bg-gray-100 border-gray-300 cursor-pointer hover:bg-gray-200'
                        }`}
                        onClick={() => toggleTimeSlot(slot)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{slot.time}</span>
                          <div className="flex items-center space-x-2">
                            {slot.appointment ? (
                              <div className="text-xs text-red-600">
                                <div className="font-medium">{slot.appointment.petName}</div>
                                <div>{slot.appointment.service}</div>
                              </div>
                            ) : slot.available ? (
                              <span className="text-green-600 text-xs">Available</span>
                            ) : (
                              <span className="text-gray-500 text-xs">Blocked</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No schedule available for this date.</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a date to view availability.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-4">
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                onClick={() => router.push('/admin/appointments')}
              >
                📅 View All Appointments
              </button>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                onClick={() => router.push('/admin/settings')}
              >
                ⚙️ Update Business Hours
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm text-gray-700">Booked</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">Blocked</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
              <span className="text-sm text-gray-700">Today</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Click on any time slot to toggle availability</li>
              <li>• Booked slots show customer and pet information</li>
              <li>• Block time slots for breaks, cleaning, or personal time</li>
              <li>• Changes are automatically saved</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
