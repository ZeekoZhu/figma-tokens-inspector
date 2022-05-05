const eventType = <T extends string, >(type: T) => `content-script:${type}` as `content-script:${T}`;
export const FILE_OPENED = eventType('file-opened');
export const NODE_SELECTED = eventType('node-selected');
