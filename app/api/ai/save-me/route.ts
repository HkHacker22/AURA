export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { agentRegistry } from '@/lib/backend/agent-registry';
import { registerAllAgents } from '@/lib/backend/agents';

registerAllAgents();

export async function POST(req: NextRequest) {
  try {
    const { userMessage, userId, taskData } = await req.json();
    if (!userMessage && !taskData) {
      return NextResponse.json({ error: 'userMessage or taskData required' }, { status: 400 });
    }

    const payload = taskData
      ? `I have ${taskData.taskCount} tasks today, ${taskData.highPriorityCount} are high priority. ` +
        `I have ${taskData.meetingCount} meetings totaling ${taskData.meetingHours} hours. ` +
        `Estimated work time: ${taskData.estimatedHours}h. Available: ${taskData.availableHours}h.`
      : userMessage;

    const agent = agentRegistry.get('save-me');
    if (!agent) return NextResponse.json({ error: 'Save Me agent not found' }, { status: 500 });

    const result = await agent.process(payload, userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
