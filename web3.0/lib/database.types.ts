export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_fee: number
          delivery_address: string
          landmark: string | null
          preferred_delivery_time: string | null
          notes: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: 'paystack' | 'flutterwave' | 'bank_transfer' | 'ussd' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_fee?: number
          delivery_address: string
          landmark?: string | null
          preferred_delivery_time?: string | null
          notes?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: 'paystack' | 'flutterwave' | 'bank_transfer' | 'ussd' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount?: number
          delivery_fee?: number
          delivery_address?: string
          landmark?: string | null
          preferred_delivery_time?: string | null
          notes?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: 'paystack' | 'flutterwave' | 'bank_transfer' | 'ussd' | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          cylinder_type: '3kg' | '6kg' | '12.5kg' | '25kg' | '50kg'
          quantity: number
          unit_price: number
          refill_type: 'refill' | 'top_up'
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          cylinder_type: '3kg' | '6kg' | '12.5kg' | '25kg' | '50kg'
          quantity: number
          unit_price: number
          refill_type: 'refill' | 'top_up'
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          cylinder_type?: '3kg' | '6kg' | '12.5kg' | '25kg' | '50kg'
          quantity?: number
          unit_price?: number
          refill_type?: 'refill' | 'top_up'
          created_at?: string
        }
      }
    }
    Enums: {
      order_status: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
      payment_method: 'paystack' | 'flutterwave' | 'bank_transfer' | 'ussd'
      cylinder_type: '3kg' | '6kg' | '12.5kg' | '25kg' | '50kg'
      refill_type: 'refill' | 'top_up'
    }
  }
}