import type { PrismSessionState } from "@prismlabs/web-scan-core";
import type { PrismInstance } from "../widgetConfig";
import { PRISM_LOADED_EVENT, PRISM_SCAN_COMPLETE_EVENT, PRISM_STATE_CHANGE_EVENT } from "./EventNames";
export type PrismEventName = typeof PRISM_LOADED_EVENT | typeof PRISM_STATE_CHANGE_EVENT | typeof PRISM_SCAN_COMPLETE_EVENT;
export type PrismEventMap = {
    [PRISM_LOADED_EVENT]: {
        prism: PrismInstance;
    };
    [PRISM_STATE_CHANGE_EVENT]: {
        state: PrismSessionState;
    };
    [PRISM_SCAN_COMPLETE_EVENT]: {
        blob: Blob;
    };
};
type Handler<T> = (payload: T) => void;
declare class EventBus {
    private listeners;
    on<K extends keyof PrismEventMap>(event: K, handler: Handler<PrismEventMap[K]>): () => void;
    remove<K extends keyof PrismEventMap>(event: K, handler: Handler<PrismEventMap[K]>): void;
    emit<K extends keyof PrismEventMap>(event: K, payload: PrismEventMap[K]): void;
}
export declare const prismEventBus: EventBus;
export {};
