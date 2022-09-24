import { useEffect, useRef, useState, useTransition } from "react";

export const SIZE_BREAKPOINTS = { mob: 1000 };

type useOnWindowResizeCallbackType = () => void;

// FIXME: use debounce
const useOnWindowResize = (callback: useOnWindowResizeCallbackType) => {
    const listener = useRef<useOnWindowResizeCallbackType | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (listener.current)
            window.removeEventListener('resize', listener.current);

        listener.current = callback;
        window.addEventListener('resize', callback);
        return () => {
            if (listener.current) {
                window.removeEventListener('resize', listener.current);
            }
        };
    }, [callback]);
};

export const useResponsiveValue = () => {
    const [, startTransition] = useTransition();
    const [breakpoint, setBreakpoint] = useState<"mob" | "desktop" | undefined>();

    const updateBreakpoint = () => {
        if (typeof window === "undefined") {
            return;
        }
        if (window.innerWidth < SIZE_BREAKPOINTS.mob) {
            setBreakpoint("mob");
            return;
        }
        setBreakpoint("desktop");
    }
    useOnWindowResize(() => {
            startTransition(() => {
                updateBreakpoint();
            });
        }
    );

    useEffect(() => {
        updateBreakpoint();
    }, []);

    return [([mb, desktop]: [any, any]) => {
        switch (breakpoint) {
            case "mob":
                return mb;
            case "desktop":
                return desktop;
        }
    }]
}