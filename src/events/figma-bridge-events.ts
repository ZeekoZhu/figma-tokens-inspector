const eventType = (type: string) => `figma-bridge:${type}`;
export const NODE_SELCTED = eventType('node-selected');
export const INITIALIZED = eventType('initialized');
