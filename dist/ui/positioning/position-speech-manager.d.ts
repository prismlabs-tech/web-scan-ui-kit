import { TFunction } from "i18next/typescript/t";
import { PositioningStateDistributor } from "./positioning-state-distributor";
export declare class PositionSpeechError extends Error {
    constructor(message: string);
}
export declare class PositionSpeechManager {
    private speechSynthesizer;
    private positioningStateDistributor;
    private subscription;
    private localization;
    constructor(positioningStateDistributor: PositioningStateDistributor, t: TFunction<"translation", undefined>);
    start(): PositionSpeechManager;
    stop(): void;
}
