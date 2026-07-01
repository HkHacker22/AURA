export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { agentRegistry } from '@/lib/backend/agent-registry';
import { registerAllAgents } from '@/lib/backend/agents';

registerAllAgents();

export async function POST(req: NextRequest) {
  try {
    const { userMessage, userId, taskData, tasks } = await req.json();

    let payload = '';
    if (tasks && tasks.length > 0) {
      payload += `Here is my task list:\n`;
      tasks.forEach((t: any) => {
        const priorityLabel = t.priority === 1 || t.priority === 'high' ? 'high' : t.priority === 3 || t.priority === 'low' ? 'low' : 'medium';
        payload += `- ID: ${t.taskId || t.id}, Content: "${t.content || t.title}", Current Priority: ${priorityLabel}\n`;
      });
    }

    if (taskData) {
      payload += `\nI have ${taskData.taskCount} tasks, ${taskData.highPriorityCount} are high priority. ` +
        `I have ${taskData.meetingCount} meetings totaling ${taskData.meetingHours} hours. ` +
        `Available time: ${taskData.availableHours}h.`;
    } else if (userMessage) {
      payload += `\nUser details: ${userMessage}`;
    }

    if (!payload) {
      return NextResponse.json({ error: 'tasks, userMessage or taskData required' }, { status: 400 });
    }

    const agent = agentRegistry.get('save-me');
    if (!agent) return NextResponse.json({ error: 'Save Me agent not found' }, { status: 500 });

    const result = await agent.process(payload, userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
