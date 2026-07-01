export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { agentRegistry } from '@/lib/backend/agent-registry';
import { registerAllAgents } from '@/lib/backend/agents';

registerAllAgents();

export async function POST(req: NextRequest) {
  try {
    const { userMessage, userId } = await req.json();
    if (!userMessage || typeof userMessage !== 'string') {
      return new Response(JSON.stringify({ error: 'userMessage is required' }), { status: 400 });
    }

    const agent = agentRegistry.get('chat');
    if (!agent) return new Response(JSON.stringify({ error: 'Chat agent not found' }), { status: 500 });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const gen = agent.streamProcess(userMessage, userId);
          for await (const chunk of gen) {
            controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'));
            if (chunk.done) break;
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(encoder.encode(JSON.stringify({ error: msg, done: true }) + '\n'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
