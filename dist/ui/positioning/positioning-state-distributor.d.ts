import { DetectionFeedback, PositionReadinessDistributor } from "@prismlabs/web-scan-core";
import { Observable } from "rxjs";
export declare enum PositioningStateType {
    Starting = 0,
    Assisting = 1,
    VerifyingConsistency = 2
}
/**
 * DetectionFeedback returns the high level results of the position and pose readiness check.
 */
export declare class PositioningState {
    readonly type: PositioningStateType;
    readonly detectionFeedback?: DetectionFeedback;
    private constructor();
    static starting(): PositioningState;
    static assisting(feedback: DetectionFeedback): PositioningState;
    static verifyingConsistency(): PositioningState;
}
/**
 * Distributor of Positioning state
 *
 * This class facilitates taking in state information from the PositionReadinessDistributor
 * and mapping it to a flow of distinct PositioningState.
 * Beyond that it also reacts to the distinct PositioningState and manages timing of
 * the PositioningState.Starting.
 */
export declare class PositioningStateDistributor {
    private _starting;
    private stop$;
    private _isStarted;
    private _startingTimeout;
    get isStarted(): boolean;
    /**
     * The positioningState observable
     */
    readonly positioningState: Observable<PositioningState>;
    constructor(positionReadinessDistributor: PositionReadinessDistributor);
    start(): void;
    dispose(): void;
}
