const eventType = <T extends string,>(type: T) => `figma-bridge:${type}` as const;
export const NODE_SELECTED = eventType('node-selected');
export const INIT = eventType('init');
export const INITIALIZED = eventType('initialized');
