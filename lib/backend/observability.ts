import type { ObservabilityLog } from './types';

export function logLLMCall(log: ObservabilityLog): void {
  const entry = {
    ...log,
    timestamp: new Date().toISOString(),
    severity: log.success ? 'INFO' : 'ERROR',
  };

  if (process.env.NODE_ENV === 'production') {
    try {
      const payload = JSON.stringify(entry);
      if (typeof process.stdout.write === 'function') {
        process.stdout.write(`${payload}\n`);
      }
    } catch {
    }
  } else {
    console.log('[AURA]', JSON.stringify(entry, null, 0));
  }
}
