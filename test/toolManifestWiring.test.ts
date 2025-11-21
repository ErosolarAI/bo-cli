import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ToolSelectionManifest } from '../src/contracts/v1/toolAccess.js';
import type { ProfileName } from '../src/config.js';
import { createPerformanceToolPlugin } from '../src/plugins/tools/performance/performancePlugin.js';
import { createCodeIntelligenceToolPlugin } from '../src/plugins/tools/codeIntelligence/codeIntelligencePlugin.js';

const TEST_CONTEXT = {
  profile: 'bo-code' as ProfileName,
  workspaceContext: null,
  workingDir: process.cwd(),
  env: process.env,
};

test('code intelligence tools are exposed via plugin and manifest', async () => {
  const manifest = loadToolManifest();
  const option = manifest.options.find((entry) => entry.id === 'code-intelligence');
  assert.ok(option, 'expected manifest to expose code-intelligence toggle');
  assert.ok(
    option.pluginIds.includes('tool.code-intelligence.analysis'),
    'manifest should bind code intelligence plugin id'
  );

  const plugin = createCodeIntelligenceToolPlugin();
  assert.equal(plugin.id, 'tool.code-intelligence.analysis');
  const capability = await plugin.create({
    workingDir: TEST_CONTEXT.workingDir,
    env: TEST_CONTEXT.env,
  });

  const module = Array.isArray(capability) ? capability[0] : capability;
  assert.ok(module, 'plugin should return a capability module');

  const contributionResult = await module!.create(TEST_CONTEXT);
  const contribution = Array.isArray(contributionResult)
    ? contributionResult[0]
    : contributionResult;

  const tools = contribution?.toolSuite?.tools.map((tool) => tool.name) ?? [];
  assert.ok(tools.includes('AnalyzeCodeComplexity'));
});

test('performance tools are exposed via plugin and manifest', async () => {
  const manifest = loadToolManifest();
  const option = manifest.options.find((entry) => entry.id === 'performance');
  assert.ok(option, 'expected manifest to expose performance toggle');
  assert.ok(
    option.pluginIds.includes('tool.performance.optimization'),
    'manifest should bind performance plugin id'
  );

  const plugin = createPerformanceToolPlugin();
  assert.equal(plugin.id, 'tool.performance.optimization');
  const capability = await plugin.create({
    workingDir: TEST_CONTEXT.workingDir,
    env: TEST_CONTEXT.env,
  });

  const module = Array.isArray(capability) ? capability[0] : capability;
  assert.ok(module, 'plugin should return a capability module');

  const contributionResult = await module!.create(TEST_CONTEXT);
  const contribution = Array.isArray(contributionResult)
    ? contributionResult[0]
    : contributionResult;

  const tools = contribution?.toolSuite?.tools.map((tool) => tool.name) ?? [];
  assert.ok(tools.includes('ParallelExecute'));
});

function loadToolManifest(): ToolSelectionManifest {
  const manifestPath = fileURLToPath(
    new URL('../src/contracts/tools.schema.json', import.meta.url)
  );
  const content = readFileSync(manifestPath, 'utf8');
  return JSON.parse(content) as ToolSelectionManifest;
}
