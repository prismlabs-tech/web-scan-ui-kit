export declare class CountdownTimer {
    private readonly initialCount;
    private interval;
    private currentCount;
    onTick: ((count: number) => void) | null;
    onFinished: (() => void) | null;
    constructor(initialCount: number);
    start(): void;
    cancel(): void;
    private tickHandler;
}
