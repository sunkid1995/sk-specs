/**
 * Xây dựng đồ thị phụ thuộc trực tiếp.
 */
export function buildDependencyGraph(moduleMap) {
  const graph = {};
  for (const [key, info] of moduleMap) {
    const knownImports = info.imports.filter(k => moduleMap.has(k));
    graph[key] = {
      type:     info.type,
      name:     info.name,
      feature:  info.feature,
      path:     info.relativePath,
      imports:  knownImports,
      exports:  info.exports,
    };
  }
  return graph;
}

/**
 * Xây dựng danh sách đảo ngược (ai sử dụng module này).
 */
export function buildReverseImports(moduleMap) {
  const reverse = {};
  for (const [key] of moduleMap) reverse[key] = [];

  for (const [consumer, info] of moduleMap) {
    for (const dep of info.imports) {
      if (reverse[dep] !== undefined && !reverse[dep].includes(consumer)) {
        reverse[dep].push(consumer);
      }
    }
  }
  return reverse;
}

/**
 * Xây dựng Module Manifest V2.
 */
export function buildModuleManifest(moduleMap, reverseMap) {
  const manifest = {};
  for (const [key, info] of moduleMap) {
    manifest[key] = {
      type:        info.type,
      name:        info.name,
      feature:     info.feature,
      path:        info.relativePath,
      exports:     info.exports,
      imports:     info.imports.filter(k => moduleMap.has(k)),
      usedBy:      reverseMap[key] || [],
      description: "",
      impactScore: 0
    };
  }
  return manifest;
}
