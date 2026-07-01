import { test, expect } from '@playwright/test';

test.describe('AURA Feature Specifications Verification', () => {

  test('🎙️ Core Input & Brain Dump Mode', async ({ page }) => {
    test.setTimeout(30000);

    // Mock the brain-dump API to return instantly without hitting the real Vertex AI
    await page.route('**/api/ai/brain-dump', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'I have processed your brain dump and found 2 items. I\'ve added a task for your report and scheduled your team call.',
          tasks: [{ title: 'Submit report tomorrow morning', priority: 'high', tags: ['work'] }],
          events: [{ title: 'Team call', date: new Date().toISOString().split('T')[0], time: '14:00', durationMinutes: 60 }],
          notes: [],
        }),
      });
    });

    await page.goto('/brain-dump');
    await page.waitForLoadState('networkidle');

    // Verify input panel
    const input = page.getByPlaceholder('Type or speak...');
    await expect(input).toBeVisible();

    // Type a sample brain dump message
    await input.fill('Need to submit report tomorrow morning and call team at 2 PM.');
    await page.keyboard.press('Enter');

    // Mocked API responds instantly — just wait for the AI response text to appear
    await expect(page.getByText('AURA is thinking...')).toBeHidden({ timeout: 12000 });

    // Verify an AI reply is rendered in the chat
    await expect(page.getByText('I have processed your brain dump')).toBeVisible({ timeout: 8000 });
  });

  test('🤖 Multi-Agent Architecture Status', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify "Your Agents" list renders
    await expect(page.getByText('Your Agents')).toBeVisible();

    // Verify critical agents are displayed in the status grid
    const agents = ['planner', 'deadline', 'research', 'reflection', 'focus'];
    for (const name of agents) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible();
    }
  });

  test('📅 Autonomous Planning, Opportunity Detection, and Focus Sessions', async ({ page }) => {
    // Verify Schedule View renders correctly
    await page.goto('/schedule');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Schedule' })).toBeVisible();

    // Verify Focus Session view
    await page.goto('/focus-session');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Focus Session' })).toBeVisible();
    await expect(page.getByText('25:00')).toBeVisible();
  });

  test('⚡ Specialized Tools: Save Me Button Emergency Mode', async ({ page }) => {
    test.setTimeout(30000);

    // Mock the save-me API to return instantly without hitting the real Vertex AI
    await page.route('**/api/ai/save-me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          overloaded: true,
          workloadScore: 78,
          suggestedActions: [
            'Take a 10-minute focus break to ease mental fatigue.',
            'Postpone lower priority design updates to tomorrow morning.',
            'Allocate a block of 45 minutes for head-down focus work.',
          ],
          priorityAdjustments: [{
            taskId: '2',
            from: 'high',
            to: 'medium',
            reason: 'Task is non-critical for today\'s primary objectives.',
          }],
        }),
      });
    });

    await page.goto('/save-me');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Allow React to fully hydrate

    const saveMeBtn = page.getByRole('button', { name: 'SAVE ME', exact: true });
    await expect(saveMeBtn).toBeVisible();

    // Force click to bypass stability issues with rotating neon orbit animations
    await saveMeBtn.click({ force: true });

    // Verify emergency results panel rendered (mocked response is instant)
    await expect(page.getByRole('heading', { name: 'Emergency Mode Active' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Workload Survival Checklist' })).toBeVisible();
    await expect(page.getByText('Take a 10-minute focus break')).toBeVisible();
  });

  test('📊 Timeline & Weekly Premium Report Features', async ({ page }) => {
    // Verify timeline view
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Life Timeline' })).toBeVisible();

    // Verify weekly premium report page renders
    await page.goto('/weekly-report');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Weekly Report' })).toBeVisible();
  });
});
