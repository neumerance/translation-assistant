import * as browserCheck from 'bowser';

export const redirectIfNotSupportedBrowser = (router = null) => {
  if (!router) return;
  const isRoot = router.location.pathname == '/';
  if (browserCheck.msie && !isRoot) router.push('/');
}

export const hasValidBrowser = () => {
  return !browserCheck.msie;
}