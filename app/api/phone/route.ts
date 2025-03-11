import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Get the phone number from the form
    const { phoneNumber } = await request.json();

    // Simple validation
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('phone_numbers')
      .insert([
        { phone: phoneNumber }
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