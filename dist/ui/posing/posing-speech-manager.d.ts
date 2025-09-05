import { TFunction } from "i18next";
import { PosingStateDistributor } from "./posing-state-distributor";
export declare class PosingSpeechError extends Error {
    constructor(message: string);
}
export declare class PosingSpeechManager {
    private speechSynthesizer;
    private posingStateDistributor;
    private subscription;
    private localization;
    constructor(posingStateDistributor: PosingStateDistributor, t: TFunction<"translation", undefined>);
    start(): PosingSpeechManager;
    stop(): PosingSpeechManager;
}
