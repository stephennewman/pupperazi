import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a mock client for build time if environment variables are not available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) })
      })
    } as any;

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address: string | null;
          emergency_contact: string | null;
          marketing_consent: boolean;
          contact_method: string | null;
          reminder_preference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          emergency_contact?: string | null;
          marketing_consent?: boolean;
          contact_method?: string | null;
          reminder_preference?: string | null;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          emergency_contact?: string | null;
          marketing_consent?: boolean;
          contact_method?: string | null;
          reminder_preference?: string | null;
          updated_at?: string;
        };
      };
      pets: {
        Row: {
          id: number;
          customer_id: number;
          name: string;
          breed: string;
          size: 'small' | 'medium' | 'large';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          customer_id: number;
          name: string;
          breed: string;
          size: 'small' | 'medium' | 'large';
          notes?: string | null;
        };
        Update: {
          customer_id?: number;
          name?: string;
          breed?: string;
          size?: 'small' | 'medium' | 'large';
          notes?: string | null;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          duration: number;
          price: string;
          category: 'grooming' | 'bath' | 'addon' | 'boarding';
          active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          duration: number;
          price: string;
          category: 'grooming' | 'bath' | 'addon' | 'boarding';
          active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          duration?: number;
          price?: string;
          category?: 'grooming' | 'bath' | 'addon' | 'boarding';
          active?: boolean;
        };
      };
      appointments: {
        Row: {
          id: string;
          customer_id: number;
          pet_id: number;
          date: string;
          time: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes: string | null;
          total_duration: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          customer_id: number;
          pet_id: number;
          date: string;
          time: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          total_duration: number;
        };
        Update: {
          customer_id?: number;
          pet_id?: number;
          date?: string;
          time?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          total_duration?: number;
          updated_at?: string;
        };
      };
      appointment_services: {
        Row: {
          appointment_id: string;
          service_id: string;
          quantity: number;
        };
        Insert: {
          appointment_id: string;
          service_id: string;
          quantity?: number;
        };
        Update: {
          quantity?: number;
        };
      };
      admin_users: {
        Row: {
          id: number;
          username: string;
          password_hash: string;
          role: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          username: string;
          password_hash: string;
          role?: string;
          active?: boolean;
        };
        Update: {
          username?: string;
          password_hash?: string;
          role?: string;
          active?: boolean;
        };
      };
      leads: {
        Row: {
          id: number;
          name: string | null;
          email: string;
          phone: string | null;
          new_customer: string | null;
          pets_name_and_breed: string | null;
          date_requested: string | null;
          time_requested: string | null;
          message: string | null;
          status: 'new' | 'contacted' | 'converted' | 'closed';
          created_at: string;
        };
        Insert: {
          name?: string | null;
          email: string;
          phone?: string | null;
          new_customer?: string | null;
          pets_name_and_breed?: string | null;
          date_requested?: string | null;
          time_requested?: string | null;
          message?: string | null;
          status?: 'new' | 'contacted' | 'converted' | 'closed';
        };
        Update: {
          name?: string | null;
          email?: string;
          phone?: string | null;
          new_customer?: string | null;
          pets_name_and_breed?: string | null;
          date_requested?: string | null;
          time_requested?: string | null;
          message?: string | null;
          status?: 'new' | 'contacted' | 'converted' | 'closed';
        };
      };
    };
  };
}

export type Customer = Database['public']['Tables']['customers']['Row'];
export type Pet = Database['public']['Tables']['pets']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Lead = Database['public']['Tables']['leads']['Row'];
