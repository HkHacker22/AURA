import { BaseAgent, type AgentMeta } from '../agent';
import { loadPrompts } from '../load-prompts';

const prompts = loadPrompts('chat');

export class ChatAgent extends BaseAgent {
  meta: AgentMeta = {
    id: 'chat',
    name: 'Chat',
    description: 'General conversation and assistance',
    systemPrompt: prompts.systemPrompt,
    examples: prompts.examples,
  };
}
