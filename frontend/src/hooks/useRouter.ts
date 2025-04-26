import { useRouter as useNextRouter } from 'next/router';
import { useCallback } from 'react';

export function useRouter() {
  const router = useNextRouter();

  const push = useCallback(
    (url: string, options?: { shallow?: boolean }) => {
      return router.push(url, undefined, options);
    },
    [router]
  );

  const replace = useCallback(
    (url: string, options?: { shallow?: boolean }) => {
      return router.replace(url, undefined, options);
    },
    [router]
  );

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const reload = useCallback(() => {
    router.reload();
  }, [router]);

  return {
    ...router,
    push,
    replace,
    back,
    reload,
    pathname: router.pathname,
    query: router.query,
    asPath: router.asPath,
    isReady: router.isReady,
  };
}
