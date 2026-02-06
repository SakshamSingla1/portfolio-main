import React, { useState, useEffect } from 'react';
import { useColors, gradients } from '../../../utils/theme';

interface SectionProps {
    id?: string;
    title: string;
    children: React.ReactNode;
    gridClass?: string;
    head?: boolean;
}

const Section: React.FC<SectionProps> = ({
    id,
    title,
    children,
    gridClass,
    head = false,
}) => {
    const colors = useColors();
    const g = gradients(colors);

    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div id={id} className={`relative space-y-6 scroll-mt-32`}>
            <div className="absolute inset-0 -z-10 opacity-20"
                style={{ background: g.cardBorderGradient }}
            />

            {!head && (
                <div className={`flex flex-col ${isMobile ? 'items-center' : 'items-start'} justify-start`}>
                    <div className="text-2xl font-semibold" style={{ color: colors.accent100 }}>
                        {title}
                    </div>
                    <div className="mt-3 h-[3px] w-20 rounded-full" style={{ background: g.dividerGradient }} />
                </div>
            )}
            {gridClass ? (<div className={`${gridClass} items-start gap-8`}>{children}</div>) : (<div>{children}</div>)}
        </div>
    );
};

export default Section;