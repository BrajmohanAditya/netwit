-- Run this in Supabase SQL Editor to create the missing invoices table

-- ============================================================================
-- 8. INVOICES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    package_name VARCHAR(255), -- e.g., "Libra"
    payment_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0, -- percentage (e.g., 13.00 for 13%)
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Auto-calculated: payment_amount * tax_rate / 100
    total DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Auto-calculated: payment_amount + tax_amount
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_due_date CHECK (due_date >= invoice_date),
    CONSTRAINT valid_invoice_amounts CHECK (payment_amount >= 0 AND tax_amount >= 0 AND total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
