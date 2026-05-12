import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className,
    style,
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <picture className={className} style={style}>
            <source srcSet="/logo.webp" type="image/webp" />
            <img
                {...props}
                src="/logo-optimized.png"
                alt="Diva AC Logo"
                width={400}
                height={400}
                className="h-full w-full object-contain"
                decoding="async"
            />
        </picture>
    );
}
