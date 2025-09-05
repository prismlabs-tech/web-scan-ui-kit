import { PrismSession } from "@prismlabs/web-scan-core";
import React from "react";
export declare const CountdownText: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
interface RecordingScreenProps {
    prismSession: PrismSession;
}
declare const RecordingScreen: React.FC<RecordingScreenProps>;
export default RecordingScreen;
