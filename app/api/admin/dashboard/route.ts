import { NextRequest, NextResponse } from 'next/server';
import { statements } from '@/lib/database';

interface DashboardStats {
  total_appointments: number;
  today_appointments: number;
  week_appointments: number;
  pending_appointments: number;
  total_revenue: number;
}

interface RecentBooking {
  id: string;
  first_name: string;
  last_name: string;
  pet_name: string;
  date: string;
  time: string;
  status: string;
  services: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get dashboard stats
    const stats = statements.getDashboardStats.get() as DashboardStats;

    // Get recent appointments
    const recentAppointments = statements.getRecentAppointments.all() as RecentBooking[];

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalBookings: stats.total_appointments || 0,
          todayBookings: stats.today_appointments || 0,
          thisWeekBookings: stats.week_appointments || 0,
          pendingConfirmations: stats.pending_appointments || 0,
          totalRevenue: stats.total_revenue || 0
        },
        recentBookings: recentAppointments.map(apt => ({
          id: apt.id,
          customerName: `${apt.first_name} ${apt.last_name}`,
          petName: apt.pet_name,
          service: apt.services,
          date: apt.date,
          time: apt.time,
          status: apt.status
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
