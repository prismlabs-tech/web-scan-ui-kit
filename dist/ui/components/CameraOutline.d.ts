export declare enum OutlineState {
    Clear = "clear",
    Error = "error",
    Success = "success"
}
declare const CameraOutline: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    $outlineState: OutlineState;
}>> & string;
export default CameraOutline;
