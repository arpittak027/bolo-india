// BOLO INDIA — AUTOMATED INTEGRATION TEST SUITE

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting Bolo India Automated Test Suite against:', BASE_URL);
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ✗ ${name}:`, e.message);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health returns 200 and ok status', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Unexpected data: ${JSON.stringify(data)}`);
  });

  // 2. Experiments API - valid POST
  await test('POST /api/experiments logs valid voice experiment', async () => {
    const payload = {
      taskType: 'message',
      inputMethod: 'voice',
      durationMs: 3500,
      wordCount: 16,
      transcribedText: 'Namaste, kal subah 10 baje mandir chalte hain.',
    };
    const res = await fetch(`${BASE_URL}/api/experiments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.experiment?.id) throw new Error('Experiment record missing ID');
  });

  // 3. Experiments API - invalid Zod schema validation
  await test('POST /api/experiments rejects invalid inputMethod', async () => {
    const payload = {
      taskType: 'message',
      inputMethod: 'telepathy', // Invalid enum
      durationMs: 3500,
      wordCount: 16,
    };
    const res = await fetch(`${BASE_URL}/api/experiments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status !== 400) throw new Error(`Expected status 400 but got ${res.status}`);
  });

  // 4. Simulations API - valid scenario generation
  await test('POST /api/simulations generates formatted scenario', async () => {
    const payload = {
      persona: 'creator',
      language: 'Hinglish',
      taskGoal: 'Instagram Reel script',
      typingDifficulty: 'Small keyboard keys',
      spokenIntent: 'Top 3 gadgets under 500 rupees every college student needs.',
    };
    const res = await fetch(`${BASE_URL}/api/simulations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.scenario?.formattedOutput) throw new Error('Simulation output missing');
  });

  // 5. Game Results API - valid score save
  await test('POST /api/game-results records Bolo Sprint game completion', async () => {
    const payload = {
      totalScore: 285,
      roundsCompleted: 3,
      breakdown: { round1: 95, round2: 95, round3: 95 },
    };
    const res = await fetch(`${BASE_URL}/api/game-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.gameResult?.total_score !== 285) throw new Error('Game result score mismatch');
  });

  // 6. Feedback API - valid feedback
  await test('POST /api/feedback records rating and comments', async () => {
    const payload = {
      rating: 5,
      feedbackText: 'Super fast voice recognition for Hindi and Hinglish!',
    };
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Feedback not acknowledged');
  });

  console.log(`\n🏁 Test Suite Finished: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

