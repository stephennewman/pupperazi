import Database from 'better-sqlite3';
import path from 'path';

// Create database connection
const dbPath = path.join(process.cwd(), 'pupperazi.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Customers table
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    emergency_contact TEXT,
    marketing_consent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Pets table
  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    size TEXT CHECK(size IN ('small', 'medium', 'large')) NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  );

  -- Services table
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    price TEXT NOT NULL,
    category TEXT CHECK(category IN ('grooming', 'bath', 'addon', 'boarding')) NOT NULL,
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Appointments table
  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    notes TEXT,
    total_duration INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );

  -- Appointment services junction table
  CREATE TABLE IF NOT EXISTS appointment_services (
    appointment_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (appointment_id, service_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id)
  );

  -- Admin users table
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Business settings table
  CREATE TABLE IF NOT EXISTS business_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepared statements for CRUD operations
export const statements = {
  // Customer operations
  createCustomer: db.prepare(`
    INSERT INTO customers (first_name, last_name, email, phone, address, emergency_contact, marketing_consent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getCustomerById: db.prepare(`
    SELECT * FROM customers WHERE id = ?
  `),

  getCustomerByEmail: db.prepare(`
    SELECT * FROM customers WHERE email = ?
  `),

  getAllCustomers: db.prepare(`
    SELECT
      c.*,
      COUNT(DISTINCT p.id) as pet_count,
      COUNT(DISTINCT a.id) as appointment_count,
      COALESCE(SUM(CAST(REPLACE(s.price, '$', '') AS DECIMAL)), 0) as total_spent
    FROM customers c
    LEFT JOIN pets p ON c.id = p.customer_id
    LEFT JOIN appointments a ON c.id = a.customer_id
    LEFT JOIN appointment_services aserv ON a.id = aserv.appointment_id
    LEFT JOIN services s ON aserv.service_id = s.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `),

  updateCustomer: db.prepare(`
    UPDATE customers
    SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, emergency_contact = ?, marketing_consent = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  deleteCustomer: db.prepare(`
    DELETE FROM customers WHERE id = ?
  `),

  // Pet operations
  createPet: db.prepare(`
    INSERT INTO pets (customer_id, name, breed, size, notes)
    VALUES (?, ?, ?, ?, ?)
  `),

  getPetsByCustomerId: db.prepare(`
    SELECT * FROM pets WHERE customer_id = ? ORDER BY name
  `),

  updatePet: db.prepare(`
    UPDATE pets SET name = ?, breed = ?, size = ?, notes = ? WHERE id = ?
  `),

  deletePet: db.prepare(`
    DELETE FROM pets WHERE id = ?
  `),

  // Service operations
  createService: db.prepare(`
    INSERT INTO services (id, name, description, duration, price, category, active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getAllServices: db.prepare(`
    SELECT * FROM services WHERE active = 1 ORDER BY category, name
  `),

  getServiceById: db.prepare(`
    SELECT * FROM services WHERE id = ?
  `),

  updateService: db.prepare(`
    UPDATE services SET name = ?, description = ?, duration = ?, price = ?, category = ?, active = ? WHERE id = ?
  `),

  // Appointment operations
  createAppointment: db.prepare(`
    INSERT INTO appointments (id, customer_id, pet_id, date, time, status, notes, total_duration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getAllAppointments: db.prepare(`
    SELECT
      a.*,
      c.first_name, c.last_name, c.email, c.phone,
      p.name as pet_name, p.breed as pet_breed, p.size as pet_size,
      GROUP_CONCAT(s.name || ' (' || s.price || ')') as services_list
    FROM appointments a
    JOIN customers c ON a.customer_id = c.id
    JOIN pets p ON a.pet_id = p.id
    LEFT JOIN appointment_services aserv ON a.id = aserv.appointment_id
    LEFT JOIN services s ON aserv.service_id = s.id
    GROUP BY a.id
    ORDER BY a.date DESC, a.time DESC
  `),

  getAppointmentById: db.prepare(`
    SELECT
      a.*,
      c.first_name, c.last_name, c.email, c.phone, c.address, c.emergency_contact,
      p.name as pet_name, p.breed as pet_breed, p.size as pet_size, p.notes as pet_notes,
      GROUP_CONCAT(
        s.id || '|' || s.name || '|' || s.price || '|' || s.duration || '|' || s.category
      ) as services_data
    FROM appointments a
    JOIN customers c ON a.customer_id = c.id
    JOIN pets p ON a.pet_id = p.id
    LEFT JOIN appointment_services aserv ON a.id = aserv.appointment_id
    LEFT JOIN services s ON aserv.service_id = s.id
    WHERE a.id = ?
    GROUP BY a.id
  `),

  updateAppointmentStatus: db.prepare(`
    UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),

  deleteAppointment: db.prepare(`
    DELETE FROM appointments WHERE id = ?
  `),

  // Appointment services operations
  addServiceToAppointment: db.prepare(`
    INSERT OR REPLACE INTO appointment_services (appointment_id, service_id, quantity)
    VALUES (?, ?, ?)
  `),

  removeServiceFromAppointment: db.prepare(`
    DELETE FROM appointment_services WHERE appointment_id = ? AND service_id = ?
  `),

  // Business settings operations
  getSetting: db.prepare(`
    SELECT value FROM business_settings WHERE key = ?
  `),

  setSetting: db.prepare(`
    INSERT OR REPLACE INTO business_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `),

  getAllSettings: db.prepare(`
    SELECT * FROM business_settings ORDER BY key
  `),

  // Analytics queries
  getDashboardStats: db.prepare(`
    SELECT
      COUNT(DISTINCT a.id) as total_appointments,
      COUNT(DISTINCT CASE WHEN DATE(a.date) = DATE('now') THEN a.id END) as today_appointments,
      COUNT(DISTINCT CASE WHEN DATE(a.date) >= DATE('now', '-7 days') THEN a.id END) as week_appointments,
      COUNT(DISTINCT CASE WHEN a.status = 'pending' THEN a.id END) as pending_appointments,
      COALESCE(SUM(CAST(REPLACE(s.price, '$', '') AS DECIMAL)), 0) as total_revenue
    FROM appointments a
    LEFT JOIN appointment_services aserv ON a.id = aserv.appointment_id
    LEFT JOIN services s ON aserv.service_id = s.id
  `),

  getRecentAppointments: db.prepare(`
    SELECT
      a.id, a.date, a.time, a.status,
      c.first_name, c.last_name, c.email,
      p.name as pet_name,
      GROUP_CONCAT(s.name) as services
    FROM appointments a
    JOIN customers c ON a.customer_id = c.id
    JOIN pets p ON a.pet_id = p.id
    LEFT JOIN appointment_services aserv ON a.id = aserv.appointment_id
    LEFT JOIN services s ON aserv.service_id = s.id
    GROUP BY a.id
    ORDER BY a.created_at DESC
    LIMIT 10
  `)
};

// Seed data function
export function seedDatabase() {
  try {
    // Seed services
    const services = [
      { id: 'bath-bliss', name: 'Bath Time Bliss', description: 'Full service bath with premium shampoo and conditioning', duration: 60, price: '$45-65', category: 'bath' },
      { id: 'mini-makeover', name: 'Mini Makeover', description: 'Quick grooming touch-up for your pet', duration: 30, price: '$25-35', category: 'grooming' },
      { id: 'full-glam', name: 'Full Glam Groom', description: 'Complete grooming package with styling and nail trim', duration: 120, price: '$65-95', category: 'grooming' },
      { id: 'wash-small', name: 'Wash N Go - Small Dog', description: 'Quick wash for small dogs (under 25 lbs)', duration: 30, price: '$15', category: 'bath' },
      { id: 'wash-medium', name: 'Wash N Go - Medium Dog', description: 'Quick wash for medium dogs (25-50 lbs)', duration: 45, price: '$17', category: 'bath' },
      { id: 'wash-large', name: 'Wash N Go - Large Dog', description: 'Quick wash for large dogs (over 50 lbs)', duration: 60, price: '$20', category: 'bath' },
      { id: 'nail-trim', name: 'Nail Trim', description: 'Professional nail trimming', duration: 15, price: '$15', category: 'addon' },
      { id: 'ear-cleaning', name: 'Ear Cleaning', description: 'Gentle ear cleaning and inspection', duration: 15, price: '$10', category: 'addon' },
      { id: 'teeth-brushing', name: 'Teeth Brushing', description: 'Dental hygiene with pet-safe toothpaste', duration: 20, price: '$12', category: 'addon' },
      { id: 'flea-treatment', name: 'Flea Treatment', description: 'Flea shampoo and treatment', duration: 30, price: '$20', category: 'addon' }
    ];

    for (const service of services) {
      try {
        statements.createService.run(service);
      } catch (error) {
        // Service might already exist, skip
      }
    }

    // Seed sample customers and appointments
    const customers = [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '(727) 555-0123' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '(727) 555-0456' },
      { firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com', phone: '(727) 555-0789' },
      { firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@example.com', phone: '(727) 555-0321' },
      { firstName: 'David', lastName: 'Brown', email: 'david.brown@example.com', phone: '(727) 555-0654' }
    ];

    const pets = [
      { customerIndex: 0, name: 'Max', breed: 'Golden Retriever', size: 'large' },
      { customerIndex: 0, name: 'Bella', breed: 'French Bulldog', size: 'medium' },
      { customerIndex: 1, name: 'Charlie', breed: 'Labrador', size: 'large' },
      { customerIndex: 2, name: 'Buddy', breed: 'German Shepherd', size: 'large' },
      { customerIndex: 3, name: 'Lucy', breed: 'Poodle', size: 'medium' },
      { customerIndex: 4, name: 'Rocky', breed: 'Boxer', size: 'large' }
    ];

    // Create customers and pets
    for (let i = 0; i < customers.length; i++) {
      try {
        const customerResult = statements.createCustomer.run(customers[i]);
        const customerId = customerResult.lastInsertRowid;

        // Create pets for this customer
        const customerPets = pets.filter(pet => pet.customerIndex === i);
        for (const pet of customerPets) {
          statements.createPet.run(customerId, pet.name, pet.breed, pet.size, '');
        }
      } catch (error) {
        // Customer might already exist, skip
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Initialize and seed database
seedDatabase();

export { db };
export default db;
