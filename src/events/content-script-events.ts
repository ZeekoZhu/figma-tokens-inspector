const eventType = (type: string) => `content-script:${type}`;
export const FILE_OPENED = eventType('file-opened');
export const NODE_SELECTED = eventType('node-selected');
