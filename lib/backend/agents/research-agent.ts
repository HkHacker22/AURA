import { BaseAgent, type AgentMeta } from '../agent';
import { loadPrompts } from '../load-prompts';

const prompts = loadPrompts('research');

export class ResearchAgent extends BaseAgent {
  meta: AgentMeta = {
    id: 'research',
    name: 'Research',
    description: 'Research topics and produce structured briefs',
    systemPrompt: prompts.systemPrompt,
    examples: prompts.examples,
  };
}
