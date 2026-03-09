export const DEMO_TOKEN = "demo-token";

export function isValidToken(authHeader?: string): boolean {
  if (!authHeader) return false;
  const [scheme, token] = authHeader.split(" ");
  return scheme === "Bearer" && token === DEMO_TOKEN;
}