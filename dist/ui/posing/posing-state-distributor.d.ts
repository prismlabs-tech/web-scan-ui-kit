import { DetectionFeedback, PoseReadinessDistributor, PositionReadinessDistributor } from "@prismlabs/web-scan-core";
import { Observable } from "rxjs";
export declare enum PosingStateType {
    Starting = 0,
    Assisting = 1,
    VerifyingConsistency = 2
}
/**
 * DetectionFeedback returns the high-level results of the position and pose readiness check.
 */
export declare class PosingState {
    readonly type: PosingStateType;
    readonly detectionFeedback?: DetectionFeedback;
    private constructor();
    static starting(): PosingState;
    static assisting(feedback: DetectionFeedback): PosingState;
    static verifyingConsistency(): PosingState;
}
/**
 * Distributor of Posing state
 *
 * This class facilitates taking in state information from the PositionReadinessDistributor &
 * PoseReadinessDistributor and mapping them down to a flow of distinct PositioningState.
 * Beyond that it also reacts to the distinct PositioningState and manages timing of
 * the PositioningState.Starting.
 */
export declare class PosingStateDistributor {
    private _starting;
    private stop$;
    private _isStarted;
    private _startingTimeout;
    get isStarted(): boolean;
    readonly posingState: Observable<PosingState>;
    constructor(positionReadinessDistributor: PositionReadinessDistributor, poseReadinessDistributor: PoseReadinessDistributor);
    start(): void;
    dispose(): void;
}
