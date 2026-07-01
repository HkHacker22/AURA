import { BaseAgent, type AgentMeta } from './agent';

class AgentRegistry {
  private agents = new Map<string, BaseAgent>();

  register(agent: BaseAgent): void {
    if (this.agents.has(agent.meta.id)) {
      throw new Error(`Agent '${agent.meta.id}' already registered`);
    }
    this.agents.set(agent.meta.id, agent);
  }

  get(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  getAll(): AgentMeta[] {
    return Array.from(this.agents.values()).map(a => a.meta);
  }
}

export const agentRegistry = new AgentRegistry();
