import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Get the phone number from the form
    const { phoneNumber } = await request.json();

    // Server-side validation
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Extract digits only for validation and storage
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Ensure we have exactly 10 digits
    if (digits.length !== 10) {
      return NextResponse.json(
        { error: 'Phone number must be 10 digits' },
        { status: 400 }
      );
    }

    // Check if phone number already exists in the database
    const { data: existingPhone, error: queryError } = await supabase
      .from('phone_numbers')
      .select()
      .eq('phone', digits)
      .single();

    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      throw queryError;
    }

    // If phone already exists, return a friendly message
    if (existingPhone) {
      return NextResponse.json(
        { error: 'This phone number is already registered' },
        { status: 409 } // 409 Conflict is appropriate for this case
      );
    }

    // Save to Supabase if phone number doesn't exist
    const { data, error } = await supabase
      .from('phone_numbers')
      .insert([
        { phone: digits } // Or store formatted: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error saving phone number:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to save phone number';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}