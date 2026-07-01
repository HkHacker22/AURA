export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { agentRegistry } from '@/lib/backend/agent-registry';
import { registerAllAgents } from '@/lib/backend/agents';

registerAllAgents();

export async function POST(req: NextRequest) {
  try {
    const { userMessage, userId } = await req.json();
    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }

    const agent = agentRegistry.get('brain-dump');
    if (!agent) return NextResponse.json({ error: 'Brain dump agent not found' }, { status: 500 });

    const result = await agent.process(userMessage, userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
