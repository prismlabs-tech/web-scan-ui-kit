import type { PrismSessionState } from "@prismlabs/web-scan-core";
import type { PrismInstance } from "../widgetConfig";
import {
  PRISM_LOADED_EVENT,
  PRISM_SCAN_COMPLETE_EVENT,
  PRISM_STATE_CHANGE_EVENT,
} from "./EventNames";

export type PrismEventName =
  | typeof PRISM_LOADED_EVENT
  | typeof PRISM_STATE_CHANGE_EVENT
  | typeof PRISM_SCAN_COMPLETE_EVENT;

export type PrismEventMap = {
  [PRISM_LOADED_EVENT]: { prism: PrismInstance };
  [PRISM_STATE_CHANGE_EVENT]: { state: PrismSessionState };
  [PRISM_SCAN_COMPLETE_EVENT]: { blob: Blob };
};

type Handler<T> = (payload: T) => void;

class EventBus {
  private listeners: Partial<{
    [K in keyof PrismEventMap]: Set<Handler<PrismEventMap[K]>>;
  }> = {};

  on<K extends keyof PrismEventMap>(
    event: K,
    handler: Handler<PrismEventMap[K]>
  ) {
    const set =
      (this.listeners[event] as Set<Handler<PrismEventMap[K]>>) || new Set();
    set.add(handler);
    this.listeners[event] = set as any;
    return () => this.remove(event, handler);
  }

  remove<K extends keyof PrismEventMap>(
    event: K,
    handler: Handler<PrismEventMap[K]>
  ) {
    const set = this.listeners[event] as
      | Set<Handler<PrismEventMap[K]>>
      | undefined;
    set?.delete(handler);
  }

  emit<K extends keyof PrismEventMap>(event: K, payload: PrismEventMap[K]) {
    const set = this.listeners[event] as
      | Set<Handler<PrismEventMap[K]>>
      | undefined;
    set?.forEach((h) => {
      try {
        h(payload);
      } catch {
        // swallow
      }
    });
  }
}

export const prismEventBus = new EventBus();
