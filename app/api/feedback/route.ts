import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, isSupabaseConfigured, memoryDb } from '@/lib/supabase';

const feedbackSchema = z.object({
  sessionId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  feedbackText: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = feedbackSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid feedback data', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { sessionId, rating, feedbackText } = validated.data;
    const feedbackId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const record = {
      id: feedbackId,
      session_id: sessionId || null,
      rating,
      feedback_text: feedbackText || '',
      created_at: createdAt,
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('user_feedback').insert(record);
      if (error) {
        console.warn('Supabase feedback insert fallback:', error.message);
        memoryDb.feedback.unshift(record);
      }
    } else {
      memoryDb.feedback.unshift(record);
    }

    return NextResponse.json({
      success: true,
      message: 'Dhanyawad! Your feedback helps make Bolo India better.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
  }
}

