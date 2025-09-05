export declare enum YellowIconType {
    Alert = "alert",
    ArrowDown = "arrow_down",
    ArrowLeft = "arrow_left",
    ArrowRight = "arrow_right",
    ArrowUp = "arrow_up",
    BodyOverlay = "body_overlay",
    BodyScan = "body_scan",
    Book = "book",
    Check = "check",
    ChevronDown = "chevron_down",
    ChevronLeft = "chevron_left",
    ChevronRight = "chevron_right",
    ChevronUp = "chevron_up",
    Close = "close",
    Help = "help",
    Info = "info",
    Loading = "loading",
    Minus = "minus",
    MoveCameraDown = "move_camera_down",
    MoveCameraUp = "move_camera_up",
    Phone = "phone",
    Play = "play",
    Plus = "plus",
    Rotate = "rotate",
    Ruler = "ruler",
    Spin = "spin",
    User = "user",
    VolumeHigh = "volume_high",
    VolumeLow = "volume_low",
    VolumeMedium = "volume_medium",
    VolumeMute = "volume_mute"
}
interface YellowIconProps {
    icon: YellowIconType;
}
export declare const YellowIcon: React.FC<YellowIconProps>;
export {};
