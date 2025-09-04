import { supabase, type Customer, type Pet, type Service, type Appointment, type Lead } from './supabase';

// Customer operations
export const customerOperations = {
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
    marketingConsent?: boolean;
  }) {
    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        emergency_contact: data.emergencyContact || null,
        marketing_consent: data.marketingConsent || false,
      })
      .select()
      .single();

    if (error) throw error;
    return customer;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        pets(count),
        appointments(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async update(id: number, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
    marketingConsent?: boolean;
  }) {
    const updateData: any = {};
    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.emergencyContact !== undefined) updateData.emergency_contact = data.emergencyContact;
    if (data.marketingConsent !== undefined) updateData.marketing_consent = data.marketingConsent;

    const { data: customer, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return customer;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Pet operations
export const petOperations = {
  async create(data: {
    customerId: number;
    name: string;
    breed: string;
    size: 'small' | 'medium' | 'large';
    notes?: string;
  }) {
    const { data: pet, error } = await supabase
      .from('pets')
      .insert({
        customer_id: data.customerId,
        name: data.name,
        breed: data.breed,
        size: data.size,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return pet;
  },

  async getByCustomerId(customerId: number) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('customer_id', customerId)
      .order('name');

    if (error) throw error;
    return data;
  },

  async update(id: number, data: {
    name?: string;
    breed?: string;
    size?: 'small' | 'medium' | 'large';
    notes?: string;
  }) {
    const { data: pet, error } = await supabase
      .from('pets')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return pet;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Service operations
export const serviceOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('category')
      .order('name');

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};

// Appointment operations
export const appointmentOperations = {
  async create(data: {
    id: string;
    customerId: number;
    petId: number;
    date: string;
    time: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    totalDuration: number;
  }) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        id: data.id,
        customer_id: data.customerId,
        pet_id: data.petId,
        date: data.date,
        time: data.time,
        status: data.status || 'confirmed',
        notes: data.notes || null,
        total_duration: data.totalDuration,
      })
      .select()
      .single();

    if (error) throw error;
    return appointment;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers(first_name, last_name, email, phone),
        pets(name, breed, size),
        appointment_services(
          quantity,
          services(name, price)
        )
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    if (error) throw error;
    
    // Transform data to match existing API format
    return data.map((apt: any) => ({
      id: apt.id,
      customer_id: apt.customer_id,
      pet_id: apt.pet_id,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      notes: apt.notes,
      total_duration: apt.total_duration,
      created_at: apt.created_at,
      updated_at: apt.updated_at,
      first_name: (apt.customers as any)?.first_name,
      last_name: (apt.customers as any)?.last_name,
      email: (apt.customers as any)?.email,
      phone: apt.customers?.phone,
      pet_name: (apt.pets as any)?.name,
      pet_breed: apt.pets?.breed,
      pet_size: apt.pets?.size,
      services_list: apt.appointment_services
        ?.map((as: any) => `${as.services?.name} (${as.services?.price})`)
        .join(', ') || ''
    }));
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers(first_name, last_name, email, phone, address, emergency_contact),
        pets(name, breed, size, notes),
        appointment_services(
          quantity,
          services(id, name, price, duration, category)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Transform services data to match existing format
    const servicesData = data.appointment_services
      ?.map((as: any) => `${as.services?.id}|${as.services?.name}|${as.services?.price}|${as.services?.duration}|${as.services?.category}`)
      .join('|') || '';

    return {
      ...data,
      first_name: data.customers?.first_name,
      last_name: data.customers?.last_name,
      email: data.customers?.email,
      phone: data.customers?.phone,
      address: data.customers?.address,
      emergency_contact: data.customers?.emergency_contact,
      pet_name: data.pets?.name,
      pet_breed: data.pets?.breed,
      pet_size: data.pets?.size,
      pet_notes: data.pets?.notes,
      services_data: servicesData
    };
  },

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Appointment services operations
export const appointmentServiceOperations = {
  async addService(appointmentId: string, serviceId: string, quantity: number = 1) {
    const { error } = await supabase
      .from('appointment_services')
      .upsert({
        appointment_id: appointmentId,
        service_id: serviceId,
        quantity
      });

    if (error) throw error;
  },

  async removeService(appointmentId: string, serviceId: string) {
    const { error } = await supabase
      .from('appointment_services')
      .delete()
      .eq('appointment_id', appointmentId)
      .eq('service_id', serviceId);

    if (error) throw error;
  }
};

// Lead operations
export const leadOperations = {
  async create(data: {
    name?: string;
    email: string;
    phone?: string;
    newCustomer?: string;
    petsNameAndBreed?: string;
    dateRequested?: string;
    timeRequested?: string;
    message?: string;
  }) {
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: data.name || null,
        email: data.email,
        phone: data.phone || null,
        new_customer: data.newCustomer || null,
        pets_name_and_breed: data.petsNameAndBreed || null,
        date_requested: data.dateRequested || null,
        time_requested: data.timeRequested || null,
        message: data.message || null,
      })
      .select()
      .single();

    if (error) throw error;
    return lead;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Dashboard analytics
export const analyticsOperations = {
  async getDashboardStats() {
    // Get total appointments
    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    // Get today's appointments
    const today = new Date().toISOString().split('T')[0];
    const { count: todayAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('date', today);

    // Get this week's appointments
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: weekAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('date', weekAgo.toISOString().split('T')[0]);

    // Get pending appointments
    const { count: pendingAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    return {
      total_appointments: totalAppointments || 0,
      today_appointments: todayAppointments || 0,
      week_appointments: weekAppointments || 0,
      pending_appointments: pendingAppointments || 0,
      total_revenue: 0 // Would need complex calculation
    };
  },

  async getRecentAppointments(limit: number = 10) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        date,
        time,
        status,
        customers(first_name, last_name, email),
        pets(name),
        appointment_services(
          services(name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map((apt: any) => ({
      id: apt.id,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      first_name: (apt.customers as any)?.first_name,
      last_name: (apt.customers as any)?.last_name,
      email: (apt.customers as any)?.email,
      pet_name: (apt.pets as any)?.name,
      services: apt.appointment_services?.map((as: any) => as.services?.name).join(', ') || ''
    }));
  }
};

// Legacy compatibility - create statements object that mimics SQLite prepared statements
export const statements = {
  // Customer operations
  createCustomer: {
    run: (firstName: string, lastName: string, email: string, phone?: string, address?: string, emergencyContact?: string, marketingConsent: boolean = false) =>
      customerOperations.create({ firstName, lastName, email, phone, address, emergencyContact, marketingConsent })
  },
  getCustomerById: {
    get: (id: number) => customerOperations.getById(id)
  },
  getCustomerByEmail: {
    get: (email: string) => customerOperations.getByEmail(email)
  },
  getAllCustomers: {
    all: () => customerOperations.getAll()
  },

  // Pet operations
  createPet: {
    run: (customerId: number, name: string, breed: string, size: 'small' | 'medium' | 'large', notes?: string) =>
      petOperations.create({ customerId, name, breed, size, notes })
  },
  getPetsByCustomerId: {
    all: (customerId: number) => petOperations.getByCustomerId(customerId)
  },

  // Service operations
  getAllServices: {
    all: () => serviceOperations.getAll()
  },
  getServiceById: {
    get: (id: string) => serviceOperations.getById(id)
  },

  // Appointment operations
  createAppointment: {
    run: (id: string, customerId: number, petId: number, date: string, time: string, status: string, notes: string | null, totalDuration: number) =>
      appointmentOperations.create({ id, customerId, petId, date, time, status: status as any, notes: notes || undefined, totalDuration })
  },
  getAllAppointments: {
    all: () => appointmentOperations.getAll()
  },
  getAppointmentById: {
    get: (id: string) => appointmentOperations.getById(id)
  },
  updateAppointmentStatus: {
    run: (status: string, id: string) => appointmentOperations.updateStatus(id, status as any)
  },

  // Appointment services operations
  addServiceToAppointment: {
    run: (appointmentId: string, serviceId: string, quantity: number = 1) =>
      appointmentServiceOperations.addService(appointmentId, serviceId, quantity)
  },

  // Analytics operations
  getDashboardStats: {
    get: () => analyticsOperations.getDashboardStats()
  },
  getRecentAppointments: {
    all: () => analyticsOperations.getRecentAppointments()
  }
};

