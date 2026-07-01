export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { agentRegistry } from '@/lib/backend/agent-registry';
import { registerAllAgents } from '@/lib/backend/agents/index';

registerAllAgents();

export async function POST(req: NextRequest) {
  try {
    const {
      userMessage,
      userId,
      currentTasks = [],
      currentEvents = [],
      conversationContext = '',
    } = await req.json();

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }

    const agent = agentRegistry.get('brain-dump');
    if (!agent) return NextResponse.json({ error: 'Brain dump agent not found' }, { status: 500 });

    // Build rich context block prepended to the user message
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const isoDate = now.toISOString().split('T')[0];

    const taskContext = currentTasks.length > 0
      ? currentTasks.map((t: any) => `  - [ID: ${t.taskId}] "${t.content}" (priority: ${t.priority === 1 ? 'high' : t.priority === 3 ? 'low' : 'medium'}, status: ${t.status})`).join('\n')
      : '  (no tasks yet)';

    const eventContext = currentEvents.length > 0
      ? currentEvents.map((e: any) => `  - [ID: ${e.id}] "${e.title}" on ${e.date} at ${e.time}`).join('\n')
      : '  (no events yet)';

    const contextBlock = `
=== CONTEXT (injected by AURA system) ===
Current date: ${dateStr} (${isoDate})
Current time: ${timeStr}

Existing tasks:
${taskContext}

Existing calendar events:
${eventContext}

${conversationContext ? `Previous conversation context:\n${conversationContext}\n` : ''}
=== END CONTEXT ===

User input: ${userMessage}`;

    const result = await agent.process(contextBlock, userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
