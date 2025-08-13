import React from "react";

interface SvgDisplayProps {
    HeroComponent: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>;
    isMoving: boolean;
    style?: React.CSSProperties;
    ref?: React.Ref<SVGSVGElement>;
}

const SvgDisplay = React.forwardRef<SVGSVGElement, SvgDisplayProps>(
    ({ HeroComponent, isMoving, style }, ref) => {
        return (
            <HeroComponent
                ref={ref}
                style={{
                    transform: isMoving ? "scaleX(-1)" : "none",
                    transition: "transform 0.2s ease",
                    ...style,
                }}
            />
        );
    }
);

export default SvgDisplay;

