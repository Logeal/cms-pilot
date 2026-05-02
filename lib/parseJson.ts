/**
 * Désérialise un champ JSON qui peut être simple, double ou triple encodé
 * (problème connu avec Prisma + better-sqlite3 + champs JSON)
 */
export function parseJsonField(raw: unknown): Record<string, unknown> {
  let val: unknown = raw;
  // Dérouler jusqu'à obtenir un objet
  let iter = 0;
  while (typeof val === "string" && iter < 5) {
    try { val = JSON.parse(val); } catch { break; }
    iter++;
  }
  if (val == null || typeof val !== "object" || Array.isArray(val)) return {};
  return val as Record<string, unknown>;
}
