/**
 * Parse `/#section` or `/path#section` for same-document hash navigation.
 */
export function parseInPageHash(path: string): { pathOnly: string; hash: string } | null {
  if (!path.includes('#')) return null
  const i = path.indexOf('#')
  return {
    pathOnly: path.slice(0, i) || '/',
    hash: path.slice(i),
  }
}

/** Whether the current route already matches this in-page hash target (Home treats empty hash as #intro). */
export function isInPageHashActive(
  routePath: string,
  routeHash: string,
  pathOnly: string,
  hash: string,
): boolean {
  if (routePath !== pathOnly) return false
  if (hash === '#intro') {
    return routeHash === '#intro' || routeHash === ''
  }
  return routeHash === hash
}
