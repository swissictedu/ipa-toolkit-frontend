export function generatePathHierarchy(pathname: string) {
  return pathname.split('/').reduce((previous, current, index) => {
    if (index === 0) {
      return previous;
    }
    return [...previous, (previous[previous.length - 1] ?? '') + '/' + current];
  }, Array<string>());
}

export function generateBookmarklet(code: string) {
  return `javascript:${encodeURIComponent(`(function(){${code}})()`)}`;
}
