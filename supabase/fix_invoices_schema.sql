-- Adaptus DMS - Fix Invoices Schema
-- Run this in Supabase SQL Editor

-- 1. Ensure Customers table exists (referenced by invoices)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(50),
    postal_code VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_contact CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

-- 2. Ensure Invoices table exists
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    package_name VARCHAR(255),
    payment_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_due_date CHECK (due_date >= invoice_date),
    CONSTRAINT valid_invoice_amounts CHECK (payment_amount >= 0 AND tax_amount >= 0 AND total >= 0)
);

-- 3. Explicitly add Foreign Key if it's missing (Primary Fix for Schema Cache Error)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'invoices_customer_id_fkey'
    ) THEN
        ALTER TABLE invoices 
        ADD CONSTRAINT invoices_customer_id_fkey 
        FOREIGN KEY (customer_id) 
        REFERENCES customers(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
