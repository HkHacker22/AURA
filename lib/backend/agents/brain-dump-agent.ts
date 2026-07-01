import { BaseAgent, type AgentMeta } from '../agent';
import { loadPrompts } from '../load-prompts';
import { BrainDumpResponseSchema } from '../types';

const prompts = loadPrompts('brain-dump');

export class BrainDumpAgent extends BaseAgent {
  meta: AgentMeta = {
    id: 'brain-dump',
    name: 'Brain Dump',
    description: 'Process voice and text brain dumps into tasks, events, and notes',
    systemPrompt: prompts.systemPrompt,
    examples: prompts.examples,
    outputSchema: BrainDumpResponseSchema,
  };
}
