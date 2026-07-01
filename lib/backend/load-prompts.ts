import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROMPTS_DIR = join(process.cwd(), 'lib', 'backend', 'prompts');

export interface AgentPromptSet {
  systemPrompt: string;
  examples?: Array<{ role: string; content: string }>;
  schema?: Record<string, unknown>;
}

export function loadPrompts(agentId: string): AgentPromptSet {
  const dir = join(PROMPTS_DIR, agentId);
  const systemFile = join(dir, `${agentId}.system.md`);
  const examplesFile = join(dir, `${agentId}.examples.md`);
  const schemaFile = join(dir, `${agentId}.schema.json`);

  const systemPrompt = readFileSync(systemFile, 'utf-8');

  let examples: Array<{ role: string; content: string }> | undefined;
  if (existsSync(examplesFile)) {
    const raw = readFileSync(examplesFile, 'utf-8');
    examples = raw.split('\n\n').filter(Boolean).map(block => {
      if (block.startsWith('User:')) return { role: 'user', content: block.slice(5).trim() };
      if (block.startsWith('Assistant:')) return { role: 'assistant', content: block.slice(10).trim() };
      return { role: 'user', content: block.trim() };
    });
  }

  let schema: Record<string, unknown> | undefined;
  if (existsSync(schemaFile)) {
    schema = JSON.parse(readFileSync(schemaFile, 'utf-8'));
  }

  return { systemPrompt, examples, schema };
}
