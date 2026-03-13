import { useCallback, useRef, useState } from "react";

interface UseClayTransitionReturn {
  isTransitioning: boolean;
  trigger: (targetId: string, onMidpoint?: () => void) => void;
  transitionProps: {
    active: boolean;
    targetId: string;
    onMidpoint: (() => void) | undefined;
    onDone: () => void;
  };
}

export function useClayTransition(): UseClayTransitionReturn {
  const [state, setState] = useState({
    active: false,
    targetId: "",
    onMidpoint: undefined as (() => void) | undefined,
  });

  const trigger = useCallback((targetId: string, onMidpoint?: () => void) => {
    setState({ active: true, targetId, onMidpoint });
  }, []);

  const onDone = useCallback(() => {
    setState((s) => ({ ...s, active: false }));
  }, []);

  return {
    isTransitioning: state.active,
    trigger,
    transitionProps: {
      active: state.active,
      targetId: state.targetId,
      onMidpoint: state.onMidpoint,
      onDone,
    },
  };
}
