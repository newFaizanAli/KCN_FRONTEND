const canAccess = (allowed: string[] | null, role: string) =>
  !allowed || allowed.includes(role);

export { canAccess };
