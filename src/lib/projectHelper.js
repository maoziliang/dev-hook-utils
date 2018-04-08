import { join } from "path";

function resolveProjectRoot() {
  const cwd = process.cwd();
  return cwd.split('node_modules')[0];
}

export const projectRoot = resolveProjectRoot();
export function resolveProjectRootPath(relativePath) {
  return join(projectRoot, relativePath);
}
