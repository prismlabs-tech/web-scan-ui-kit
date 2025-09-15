import { PrismSessionState } from "@prismlabs/web-scan-core";
import "../../i18n/i18n";
interface PrismSessionViewProps {
    onSessionStateChange?: (state: PrismSessionState) => void;
    onClose: () => void;
}
export declare function PrismSessionView({ onSessionStateChange, onClose, }: PrismSessionViewProps): import("react/jsx-runtime").JSX.Element;
export {};
