import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'BOLO INDIA — Voice-First Platform',
    version: '1.0.0',
    database: isSupabaseConfigured ? 'Supabase PostgreSQL (Connected)' : 'Local Memory Store (Active)',
    timestamp: new Date().toISOString(),
  });
}

