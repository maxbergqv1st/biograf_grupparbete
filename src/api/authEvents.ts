type AuthEventCallback = () => void;

let onAuthRequiredCallbacks: AuthEventCallback | null = null;
let onAuthResolvedCallbacks: AuthEventCallback | null = null;

export function onAuthRequired(cb: AuthEventCallback) {
  onAuthRequiredCallbacks = cb;
}

export function onAuthResolved(cb: AuthEventCallback) {
  onAuthResolvedCallbacks = cb;
}

export function emitAuthRequired() {
  onAuthRequiredCallbacks?.();
}

export function emitAuthResolved() {
  onAuthResolvedCallbacks?.();
}
