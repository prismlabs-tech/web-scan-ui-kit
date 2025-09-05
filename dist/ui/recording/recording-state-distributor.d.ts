import { PrismSession } from "@prismlabs/web-scan-core";
import { Observable } from "rxjs";
export declare enum RecordingStateType {
    Starting = 0,
    Preparing = 1,
    Recording = 2
}
export declare class RecordingState {
    readonly type: RecordingStateType;
    readonly countdown?: number;
    private constructor();
    static starting(): RecordingState;
    static preparing(countdown: number): RecordingState;
    static recording(countdown: number): RecordingState;
}
/**
 * Distributor of Recording Assistant state
 *
 * This class facilitates moving through the different states of the recording stage: start,
 * preparation, countdown, and recording—and maps them to a flow of distinct RecordingStates.
 * It also handles some of the prism session logic that runs based on these timers, including
 * starting and stopping the recorder.
 */
export declare class RecordingStateDistributor {
    private readonly prismSession;
    private readonly _recordingStateFlow;
    private _startingTimeout;
    private _preparationTimer;
    private _recordingTimer;
    private subscriptions;
    private _isStarted;
    get isStarted(): boolean;
    readonly recordingState: Observable<RecordingState>;
    constructor(prismSession: PrismSession);
    start(): void;
    dispose(): void;
    private cancelTimers;
    private initializeSubscriptions;
    private setupTimers;
    private updateRecordingState;
}
