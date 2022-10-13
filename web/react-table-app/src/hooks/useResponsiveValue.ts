import { useEffect, useRef, useState } from "react";
import { useDebounce } from "./useDebounce";

export const SIZE_BREAKPOINTS = { mob: 1000 };

type useOnWindowResizeCallbackType = () => void;

const useOnWindowResize = (callback: useOnWindowResizeCallbackType) => {
    const listener = useRef<ReturnType<typeof useDebounce<UIEvent>> | null>(null);

    const inputHandler = useDebounce<UIEvent>(
        () => callback(),
        1000
    );
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (listener.current)
            window.removeEventListener('resize', inputHandler);

        listener.current = inputHandler;
        window.addEventListener('resize', listener.current);
        return () => {
            if (listener.current) {
                window.removeEventListener('resize', listener.current);
            }
        };
    }, [inputHandler]);
};

export const useResponsiveValue = () => {
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
            updateBreakpoint();
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