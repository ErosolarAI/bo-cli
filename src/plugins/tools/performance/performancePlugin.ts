import { PerformanceCapabilityModule } from '../../../capabilities/performanceCapability.js';
import type { ToolPlugin, ToolPluginContext } from '../registry.js';

export function createPerformanceToolPlugin(): ToolPlugin {
  return {
    id: 'tool.performance.optimization',
    description: 'Performance optimization tools for parallel execution and throughput improvements.',
    targets: ['node'],
    create: (_context: ToolPluginContext) => {
      return new PerformanceCapabilityModule();
    },
  };
}
