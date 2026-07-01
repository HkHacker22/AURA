import { BaseAgent, type AgentMeta } from '../agent';
import { loadPrompts } from '../load-prompts';
import { SaveMeResponseSchema } from '../types';

const prompts = loadPrompts('save-me');

export class SaveMeAgent extends BaseAgent {
  meta: AgentMeta = {
    id: 'save-me',
    name: 'Save Me',
    description: 'Analyze workload and suggest priority adjustments when overloaded',
    systemPrompt: prompts.systemPrompt,
    examples: prompts.examples,
    outputSchema: SaveMeResponseSchema,
  };
}
