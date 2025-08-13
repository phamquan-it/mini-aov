import { useEffect } from 'react';

function useKeyboardHandler(
    containerRef: any,
    handleKeyDown: (e: KeyboardEvent) => void
) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('keydown', handleKeyDown);

        return () => {
            container.removeEventListener('keydown', handleKeyDown);
        };
    }, [containerRef, handleKeyDown]);
}

export default useKeyboardHandler;

