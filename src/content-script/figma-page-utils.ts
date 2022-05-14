import { debounceTime, map, Observable } from 'rxjs';
import { content as log } from '~/logger';

export function observeFigmaFileChange() {
  return new Observable<void>((observer) => {
    const mutationObserver = new MutationObserver(() => {
      observer.next();
    });
    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: [ 'data-editor-theme' ],
    });
    return () => mutationObserver.disconnect();
  }).pipe(
    debounceTime(500),
    map(getFileId)
  );
}

function isInFigmaFile() {
  log.debug('current file', window.location.href);
  return window.location.href.startsWith('https://www.figma.com/file/');
}

export function getFileId() {
  if (!isInFigmaFile()) {
    return null;
  }
  return window.location.pathname.split('/')[2];
}
