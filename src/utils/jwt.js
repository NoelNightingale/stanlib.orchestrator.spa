// src/utils/jwt.js
export function getScopesFromToken(token) {
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded JWT payload:', payload);
    if (payload.scope) return payload.scope.split(' ');
    if (payload.scopes) return payload.scopes;
    return [];
  } catch {
    return [];
  }
}
