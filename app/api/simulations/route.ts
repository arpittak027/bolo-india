import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const simulationSchema = z.object({
  persona: z.string().min(1),
  language: z.string().min(1),
  taskGoal: z.string().min(1),
  typingDifficulty: z.string().min(1),
  spokenIntent: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = simulationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid simulation parameters', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { persona, language, taskGoal, typingDifficulty, spokenIntent } = validated.data;

    // Deterministic scenario mapping
    const personaProfiles: Record<string, { role: string; environment: string; icon: string }> = {
      student: { role: 'College Student (Engineering / Arts)', environment: 'Campus lecture hall / Metro commute', icon: '🎓' },
      grandparent: { role: 'Elder / Grandparent', environment: 'Home living room with family WhatsApp', icon: '👵' },
      creator: { role: 'Digital Creator / Solo Builder', environment: 'Walking or transit ideation', icon: '✨' },
      business: { role: 'Kirana / Handloom / Boutique Owner', environment: 'Busy retail shop floor', icon: '🏪' },
      parent: { role: 'Working Parent', environment: 'Multitasking kitchen / grocery runs', icon: '🏡' },
    };

    const profile = personaProfiles[persona.toLowerCase()] || {
      role: persona,
      environment: 'Everyday Indian setting',
      icon: '🇮🇳',
    };

    // Synthesize structured outcome based on real user input
    const cleanOutput = `[Formatted for ${taskGoal.toUpperCase()}]\n\n"${spokenIntent.trim()}"\n\n— Auto-transcribed in ${language}. Ready to send or export.`;

    const scenarioResult = {
      id: crypto.randomUUID(),
      persona: profile.role,
      environment: profile.environment,
      icon: profile.icon,
      selectedLanguage: language,
      everydayProblem: typingDifficulty,
      spokenInput: spokenIntent,
      recognizedRawText: spokenIntent,
      formattedOutput: cleanOutput,
      practicalValue: `Saved ~120 seconds of frustrating typing on mobile keyboard. No Hinglish spelling confusion. Zero friction.`,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      scenario: scenarioResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to generate simulation' }, { status: 500 });
  }
}

