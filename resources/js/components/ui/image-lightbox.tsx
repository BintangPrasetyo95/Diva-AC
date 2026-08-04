import React from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from './dialog';

export function ImageLightbox({ 
    src, 
    alt = "", 
    children 
}: { 
    src: string; 
    alt?: string; 
    children: React.ReactNode; 
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="cursor-pointer hover:opacity-80 transition-opacity inline-block">
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent 
                aria-describedby={undefined}
                className="max-w-[90vw] md:max-w-5xl p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:text-white [&>button]:bg-black/50 [&>button]:rounded-full [&>button]:p-2 [&>button]:hover:bg-black/80 [&>button]:right-2 [&>button]:top-2"
            >
                <DialogTitle className="sr-only">{alt}</DialogTitle>
                <DialogClose className="cursor-zoom-out flex justify-center items-center h-full w-full outline-none">
                    <img src={src} alt={alt} className="w-full h-auto max-h-[90vh] object-contain rounded-xl" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
