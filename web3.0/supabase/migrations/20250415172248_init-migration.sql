/*
  # Initial Schema Setup for Bobchi Gas

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - full_name (text)
      - phone_number (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - orders
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - status (enum)
      - total_amount (numeric)
      - delivery_fee (numeric)
      - delivery_address (text)
      - landmark (text)
      - preferred_delivery_time (timestamp)
      - notes (text)
      - payment_status (enum)
      - payment_method (enum)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - order_items
      - id (uuid, primary key)
      - order_id (uuid, foreign key)
      - cylinder_type (enum)
      - quantity (numeric)
      - unit_price (numeric)
      - refill_type (enum)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('paystack', 'flutterwave', 'bank_transfer', 'ussd');
CREATE TYPE cylinder_type AS ENUM ('3kg', '6kg', '12.5kg', '25kg', '50kg');
CREATE TYPE refill_type AS ENUM ('refill', 'top_up');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  status order_status DEFAULT 'pending',
  total_amount numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) DEFAULT 0,
  delivery_address text NOT NULL,
  landmark text,
  preferred_delivery_time timestamptz,
  notes text,
  payment_status payment_status DEFAULT 'pending',
  payment_method payment_method,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  cylinder_type cylinder_type NOT NULL,
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  refill_type refill_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();