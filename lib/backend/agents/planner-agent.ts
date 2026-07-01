import { BaseAgent, type AgentMeta } from '../agent';
import { loadPrompts } from '../load-prompts';

const prompts = loadPrompts('planner');

export class PlannerAgent extends BaseAgent {
  meta: AgentMeta = {
    id: 'planner',
    name: 'Planner',
    description: 'Create optimized daily and weekly schedules',
    systemPrompt: prompts.systemPrompt,
    examples: prompts.examples,
  };
}
