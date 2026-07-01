import { llmService } from './llm-service';
import { agentRegistry } from './agent-registry';

export async function classifyIntent(userMessage: string): Promise<string> {
  const agents = agentRegistry.getAll();
  const agentList = agents
    .map(a => `- "${a.id}": ${a.description}`)
    .join('\n');

  const prompt = `Given the user message below, select the single best agent to handle it from this list:

${agentList}

Rules:
- Return ONLY the agent ID (one word).
- If unsure, return "chat".
- Never explain your choice.

User message: "${userMessage}"`;

  try {
    const result = await llmService.generate<{ agentId: string }>({
      systemPrompt: 'You classify user requests into agent categories. Return JSON: {"agentId": "..."}',
      userMessage: prompt,
      temperature: 0.1,
      maxOutputTokens: 50,
    });
    const id = (typeof result === 'string' ? result : (result as any).agentId ?? 'chat') as string;
    return agents.some(a => a.id === id) ? id : 'chat';
  } catch {
    return 'chat';
  }
}
