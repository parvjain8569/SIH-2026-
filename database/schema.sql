-- =====================================================================
-- BhoomiIntelli - SIH Problem Statement 26018
-- Intelligent Land Record Digitization and Validation System
-- Complete PostgreSQL / Supabase Database Schema
-- =====================================================================

-- 1. CITIZEN USERS TABLE (Citizen Portal Authentication & Profile)
CREATE TABLE IF NOT EXISTS citizen_users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    salt VARCHAR(64) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    is_phone_verified BOOLEAN DEFAULT FALSE,
    gender VARCHAR(16),
    dob VARCHAR(32),
    address TEXT,
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Haryana',
    pincode VARCHAR(16),
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    aadhaar_number VARCHAR(32),
    status VARCHAR(32) DEFAULT 'Active',
    role VARCHAR(32) DEFAULT 'Citizen',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_citizen_email ON citizen_users(email);
CREATE INDEX IF NOT EXISTS idx_citizen_district ON citizen_users(district);

-- 2. ADMIN USERS TABLE (Government Revenue Officers & Auditors)
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    salt VARCHAR(64) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'Revenue Inspector',
    department VARCHAR(128) DEFAULT 'Land Records Division',
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Haryana',
    phone VARCHAR(32),
    status VARCHAR(32) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_role ON admin_users(role);

-- 3. LAND RECORDS TABLE (Digitized Land Deeds & Cadastral Parcels)
CREATE TABLE IF NOT EXISTS land_records (
    id VARCHAR(64) PRIMARY KEY,
    parcel_id VARCHAR(64) UNIQUE NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) REFERENCES citizen_users(email) ON DELETE SET NULL,
    khasra_no VARCHAR(64) NOT NULL,
    khatouni_no VARCHAR(64),
    village VARCHAR(128),
    tehsil VARCHAR(128),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Haryana',
    area VARCHAR(64) NOT NULL,
    land_type VARCHAR(64) DEFAULT 'Agricultural (कृषि भूमि)',
    date VARCHAR(32),
    status VARCHAR(32) DEFAULT 'Verified',
    ocr_confidence VARCHAR(16) DEFAULT '95%',
    dispute_status VARCHAR(64) DEFAULT 'Clear',
    verified_by VARCHAR(255),
    digital_hash VARCHAR(128),
    document_name VARCHAR(255),
    document_url TEXT,
    file_size VARCHAR(32),
    admin_notes TEXT,
    boundary_coordinates JSONB,
    fields JSONB,
    last_audited VARCHAR(32),
    notice_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_records_parcel ON land_records(parcel_id);
CREATE INDEX IF NOT EXISTS idx_records_user_email ON land_records(user_email);
CREATE INDEX IF NOT EXISTS idx_records_khasra ON land_records(khasra_no);
CREATE INDEX IF NOT EXISTS idx_records_status ON land_records(status);

-- 4. LAND AUDIT TRAIL TABLE (Immutable Ledger of Verifications)
CREATE TABLE IF NOT EXISTS land_audit_trail (
    id BIGSERIAL PRIMARY KEY,
    record_id VARCHAR(64) REFERENCES land_records(id) ON DELETE CASCADE,
    action VARCHAR(64) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    remarks TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_record_id ON land_audit_trail(record_id);
