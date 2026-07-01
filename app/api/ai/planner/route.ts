export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { agentRegistry } from '@/lib/backend/agent-registry';
import { registerAllAgents } from '@/lib/backend/agents';

registerAllAgents();

export async function POST(req: NextRequest) {
  try {
    const { userMessage, userId, tasks } = await req.json();
    if (!userMessage && !tasks) {
      return NextResponse.json({ error: 'userMessage or tasks required' }, { status: 400 });
    }

    const payload = tasks
      ? `Plan my day. I have: ${tasks.map((t: any) => `${t.title} (${t.priority || 'medium'}${t.estimatedMinutes ? ', ' + t.estimatedMinutes + 'min' : ''})`).join(', ')}.`
      : userMessage;

    const agent = agentRegistry.get('planner');
    if (!agent) return NextResponse.json({ error: 'Planner agent not found' }, { status: 500 });

    const result = await agent.process(payload, userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
