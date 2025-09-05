import React from 'react';
export declare enum BannerType {
    TOP = "top",
    CENTER = "center"
}
interface BannerProps {
    title: string;
    centerComponent?: React.ReactNode;
    bottomTitle?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    type?: BannerType;
    style?: React.CSSProperties;
    className?: string;
}
export declare const AlertContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const TopBannerContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const BottomBannerContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
declare const Banner: React.FC<BannerProps>;
export default Banner;
