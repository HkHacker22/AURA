import { agentRegistry } from '../agent-registry';
import { BrainDumpAgent } from './brain-dump-agent';
import { ChatAgent } from './chat-agent';
import { PlannerAgent } from './planner-agent';
import { SaveMeAgent } from './save-me-agent';
import { ResearchAgent } from './research-agent';

let registered = false;

export function registerAllAgents(): void {
  if (registered) return;
  registered = true;
  agentRegistry.register(new BrainDumpAgent());
  agentRegistry.register(new ChatAgent());
  agentRegistry.register(new PlannerAgent());
  agentRegistry.register(new SaveMeAgent());
  agentRegistry.register(new ResearchAgent());
}
