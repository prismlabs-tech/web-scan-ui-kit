import { Observable, OperatorFunction } from "rxjs";

/**
 * RxJS operator that defers emission of certain state transitions until
 * the new value has been received `count` consecutive times.
 *
 * This is useful for preventing jitter-induced state resets. For example,
 * requiring 7 consecutive non-approved frames before leaving a
 * "VerifyingConsistency" state absorbs brief landmark detection glitches
 * without noticeably delaying the response to genuine movement.
 *
 * @param count - Number of consecutive emissions that must satisfy `shouldDefer`
 *   before the deferred value is actually emitted.
 * @param shouldDefer - Predicate receiving the incoming value and the last
 *   emitted value. Return `true` to defer (suppress) the emission and
 *   increment the consecutive counter, or `false` to emit immediately
 *   and reset the counter.
 */
export function requireConsecutive<T>(
  count: number,
  shouldDefer: (newValue: T, lastEmitted: T) => boolean,
): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    return new Observable<T>((subscriber) => {
      let lastEmittedValue: T | null = null;
      let consecutiveCount = 0;
      let deferredValue: T | null = null;

      const subscription = source.subscribe({
        next: (value) => {
          // First value always emits immediately
          if (lastEmittedValue === null) {
            lastEmittedValue = value;
            consecutiveCount = 0;
            deferredValue = null;
            subscriber.next(value);
            return;
          }

          if (shouldDefer(value, lastEmittedValue)) {
            consecutiveCount++;
            deferredValue = value;

            if (consecutiveCount >= count) {
              // Threshold reached — emit the deferred value
              lastEmittedValue = deferredValue;
              consecutiveCount = 0;
              deferredValue = null;
              subscriber.next(lastEmittedValue);
            }
            // Otherwise suppress the emission
          } else {
            // No deferral — emit immediately and reset counter
            consecutiveCount = 0;
            deferredValue = null;
            lastEmittedValue = value;
            subscriber.next(value);
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  };
}
