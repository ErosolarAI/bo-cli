import { CodeIntelligenceCapabilityModule } from '../../../capabilities/codeIntelligenceCapability.js';
import type { ToolPlugin, ToolPluginContext } from '../registry.js';

export function createCodeIntelligenceToolPlugin(): ToolPlugin {
  return {
    id: 'tool.code-intelligence.analysis',
    description:
      'Advanced code intelligence tools for complexity analysis, metrics, and quality assessment.',
    targets: ['node'],
    create: (_context: ToolPluginContext) => {
      return new CodeIntelligenceCapabilityModule();
    },
  };
}
