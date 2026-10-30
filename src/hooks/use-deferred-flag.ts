import { useEffect, useState } from 'react';

/**
 * A skeleton is shown only once the wait is real (§5.11): a fast response
 * never flashes a placeholder. Returns `false` during the first `delay` ms of
 * `active`, then `true` while it stays active.
 *
 * Once the flag has fired it stays fired for the life of the mount, so a later
 * refresh through the same screen is not delayed a second time.
 */
export function useDeferredFlag(active: boolean, delay = 200) {
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => setElapsed(true), delay);
    return () => clearTimeout(timer);
  }, [active, delay]);

  return active && elapsed;
}
