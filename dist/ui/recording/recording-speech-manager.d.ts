import { TFunction } from "i18next";
import { RecordingStateDistributor } from "./recording-state-distributor";
export declare class RecordingSpeechError extends Error {
    constructor(message: string);
}
export declare class RecordingSpeechManager {
    private speechSynthesizer;
    private recordingStateDistributor;
    private subscription;
    private localization;
    private lastSpokenCountdown;
    constructor(recordingStateDistributor: RecordingStateDistributor, t: TFunction<"translation", undefined>);
    start(): RecordingSpeechManager;
    private handlePreparationCountdown;
    private handleRecordingCountdown;
    stop(): RecordingSpeechManager;
}
