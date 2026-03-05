import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase
        .from('deliveries')
        .select('*, driver:drivers(name, phone, telegram_id)')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer_name, customer_phone, pickup_location, dropoff_location, package_type, delivery_fee } = body;

        const { data, error } = await supabase
            .from('deliveries')
            .insert([
                { customer_name, customer_phone, pickup_location, dropoff_location, package_type, delivery_fee }
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
