import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, isSupabaseConfigured, memoryDb } from '@/lib/supabase';

const experimentSchema = z.object({
  sessionId: z.string().uuid().optional(),
  taskType: z.string().min(1).max(50),
  inputMethod: z.enum(['voice', 'typing']),
  durationMs: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
  transcribedText: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = experimentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid experiment data', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { sessionId, taskType, inputMethod, durationMs, wordCount, transcribedText } = validated.data;
    const finalSessionId = sessionId || crypto.randomUUID();
    const experimentId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const record = {
      id: experimentId,
      session_id: finalSessionId,
      task_type: taskType,
      input_method: inputMethod,
      duration_ms: durationMs,
      word_count: wordCount,
      transcribed_text: transcribedText || '',
      created_at: createdAt,
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('voice_experiments').insert(record);
      if (error) {
        console.warn('Supabase insert warning, falling back to local memory store:', error.message);
        memoryDb.experiments.unshift(record);
      }
    } else {
      memoryDb.experiments.unshift(record);
    }

    return NextResponse.json({
      success: true,
      experiment: record,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('voice_experiments').select('*').order('created_at', { ascending: false }).limit(20);
      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ experiments: data });
      }
    }

    const filtered = sessionId
      ? memoryDb.experiments.filter((e) => e.session_id === sessionId)
      : memoryDb.experiments.slice(0, 20);

    return NextResponse.json({ experiments: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch experiments' }, { status: 500 });
  }
}

