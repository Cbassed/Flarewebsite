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

    // Save to Supabase (store the cleaned digits or formatted version as needed)
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