import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, isSupabaseConfigured, memoryDb } from '@/lib/supabase';

const gameResultSchema = z.object({
  sessionId: z.string().uuid().optional(),
  totalScore: z.number().int().min(0).max(300),
  roundsCompleted: z.number().int().min(1).max(3),
  breakdown: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = gameResultSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid game result payload', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { sessionId, totalScore, roundsCompleted, breakdown } = validated.data;
    const finalSessionId = sessionId || crypto.randomUUID();
    const gameId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const record = {
      id: gameId,
      session_id: finalSessionId,
      total_score: totalScore,
      rounds_completed: roundsCompleted,
      breakdown: breakdown || {},
      created_at: createdAt,
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('game_results').insert(record);
      if (error) {
        console.warn('Supabase game_results insert warning, falling back:', error.message);
        memoryDb.gameResults.unshift(record);
      }
    } else {
      memoryDb.gameResults.unshift(record);
    }

    return NextResponse.json({
      success: true,
      gameResult: record,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save game result' }, { status: 500 });
  }
}

