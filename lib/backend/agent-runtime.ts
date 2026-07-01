import { classifyIntent } from './intent-classifier';
import { agentRegistry } from './agent-registry';

export async function runAgent(agentId: string | undefined, userMessage: string, userId?: string): Promise<unknown> {
  const resolvedAgentId = agentId || await classifyIntent(userMessage);
  const agent = agentRegistry.get(resolvedAgentId);
  if (!agent) {
    const fallback = agentRegistry.get('chat');
    if (!fallback) throw new Error(`No agent found for '${resolvedAgentId}' and no chat fallback`);
    return fallback.process(userMessage, userId);
  }
  return agent.process(userMessage, userId);
}

export async function* streamAgent(agentId: string | undefined, userMessage: string, userId?: string) {
  const resolvedAgentId = agentId || await classifyIntent(userMessage);
  const agent = agentRegistry.get(resolvedAgentId);
  if (!agent) {
    const fallback = agentRegistry.get('chat');
    if (!fallback) throw new Error(`No agent found for '${resolvedAgentId}' and no chat fallback`);
    yield* fallback.streamProcess(userMessage, userId);
    return;
  }
  yield* agent.streamProcess(userMessage, userId);
}
