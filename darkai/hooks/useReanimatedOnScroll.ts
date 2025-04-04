/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  ScrollHandler,
  ScrollHandlers,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { clamp } from 'react-native-redash';

interface DiffClampConfig {
  min?: number;
  max: number;
  overScrollEnabled?: {
    top?: boolean;
    bottom?: boolean;
  };
}

export interface FlatReanimatedOnScrollParams {
  scrollY?: SharedValue<number>;
  isScrollActive?: SharedValue<boolean>;
  diffClampScrollY?: SharedValue<number>;
  diffClampConfig?: DiffClampConfig;
  /** NOTE: worklet */
  onScroll?: ScrollHandler<any>;
  /** NOTE: worklet */
  onBeginDrag?: ScrollHandler<any>;
  /** NOTE: worklet */
  onEndDrag?: ScrollHandler<any>;
  /** NOTE: worklet */
  onMomentumBegin?: ScrollHandler<any>;
  /** NOTE: worklet */
  onMomentumEnd?: ScrollHandler<any>;
}

interface ReanimatedOnScrollParams {
  max?: number;
  min?: number;
  diffClampConfig?: DiffClampConfig;
  handlers?: ScrollHandlers<any>;
}

interface ReanimatedOnScrollParamsWithDeps
  extends Omit<ReanimatedOnScrollParams, 'handlers'> {
  scrollY?: SharedValue<number>;
  diffClampScrollY?: SharedValue<number>;
  isScrollActive?: SharedValue<boolean>;
  isWebScrollActive?: SharedValue<boolean>;
  /** NOTE: worklet */
  onScroll?: ScrollHandler<any>;
  /** NOTE: worklet */
  onBeginDrag?: ScrollHandler<any>;
  /** NOTE: worklet */
  onEndDrag?: ScrollHandler<any>;
  /** NOTE: worklet */
  onMomentumBegin?: ScrollHandler<any>;
  /** NOTE: worklet */
  onMomentumEnd?: ScrollHandler<any>;
}

export const useReanimatedOnScrollExtDeps = ({
  scrollY,
  diffClampScrollY,
  isScrollActive,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  diffClampConfig,
  onScroll,
  onBeginDrag,
  onEndDrag,
  onMomentumBegin,
  onMomentumEnd,
}: ReanimatedOnScrollParamsWithDeps = {}) => {
  const reanimatedScrollWorklet = useAnimatedScrollHandler<{ prevY: number }>({
    onBeginDrag: (event, context) => {
      if (context) {
        context.prevY = event.contentOffset.y;
      }
      if (isScrollActive) {
        isScrollActive.value = true;
      }

      onBeginDrag?.(event, context);
    },
    onScroll: (event, context) => {
      const scrollValue = Math.max(min, Math.min(max, event.contentOffset.y));
      if (scrollY) {
        scrollY.value = scrollValue;
      }

      const _isScrollingNext = context?.prevY !== scrollValue;

      const scrollViewEndY =
        event.contentSize.height - event.layoutMeasurement.height;
      const overScrollEnabled = {
        top: true,
        bottom: true,
        ...diffClampConfig?.overScrollEnabled,
      };
      const diffClampContentOffsetY = Math.max(
        overScrollEnabled.top ? Number.MIN_SAFE_INTEGER : 0,
        Math.min(
          overScrollEnabled.bottom ? Number.MAX_SAFE_INTEGER : scrollViewEndY,
          event.contentOffset.y,
        ),
      );
      // Sometimes, context?.prevY goes out of bounds on overscroll, so we need limit it
      const contextPrevY = Math.max(
        overScrollEnabled.top ? Number.MIN_SAFE_INTEGER : 0,
        Math.min(
          overScrollEnabled.bottom ? Number.MAX_SAFE_INTEGER : scrollViewEndY,
          context?.prevY ?? 0,
        ),
      );
      const dy = diffClampContentOffsetY - contextPrevY;
      if (diffClampScrollY) {
        diffClampScrollY.value = clamp(
          diffClampScrollY.value + dy,
          diffClampConfig?.min ?? 0,
          diffClampConfig?.max ?? 0,
        );
      }

      if (context) {
        context.prevY = diffClampContentOffsetY;
      }

      onScroll?.(event, context);
    },
    onEndDrag: (event, ctx) => {
      if (isScrollActive) {
        isScrollActive.value = false;
      }

      onEndDrag?.(event, ctx);
    },
    onMomentumBegin: (event, ctx) => {
      if (isScrollActive) {
        isScrollActive.value = true;
      }
      onMomentumBegin?.(event, ctx);
    },
    onMomentumEnd: (event, ctx) => {
      if (isScrollActive) {
        isScrollActive.value = false;
      }

      onMomentumEnd?.(event, ctx);
    },
  });
  /* eslint-enable no-param-reassign */

  return reanimatedScrollWorklet;
};

/**
 * Creates `onScroll` callback for RN Lists, which proxies scroll change events to Animated.Value
 * named `scrollY`. Also, allows to set observable range for `scrollY`, by setting `min` and `max`
 * @param max - Do not track scrollY if greater than this value
 * @param min - Do not track scrollY if less than this value
 * @param diffClampConfig - Clamp scrollY between min and max values and return the result in diffClampScrollY
 * @param handlers - Extra handlers to be passed to `scrollHandler`
 */
export const useReanimatedOnScroll = ({
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  diffClampConfig,
  handlers,
}: ReanimatedOnScrollParams = {}) => {
  const scrollY = useSharedValue<number>(0);
  const diffClampScrollY = useSharedValue<number>(0);
  const isScrollActive = useSharedValue<boolean>(false);
  const isWebScrollActive = useSharedValue<boolean>(false);

  const onScroll = useReanimatedOnScrollExtDeps({
    scrollY,
    diffClampScrollY,
    isScrollActive,
    isWebScrollActive,
    max,
    min,
    diffClampConfig,
    ...handlers,
  });

  return {
    scrollY,
    diffClampScrollY,
    isScrollActive,
    onScroll,
    isWebScrollActive,
  };
};

/**
 * RecycleView doesn't send onScroll event to useAnimatedScrollHandler
 * when refreshControl is used, so we need to proxy it
 * https://github.com/Flipkart/recyclerlistview/issues/467
 * @param max - Do not track scrollY if greater than this value
 * @param min - Do not track scrollY if less than this value
 */
export const useReanimatedAdapterOnScroll = ({
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
}: Pick<ReanimatedOnScrollParams, 'min' | 'max'> = {}) => {
  const scrollY = useSharedValue<number>(0);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      'worklet';

      scrollY.value = Math.max(
        min,
        Math.min(max, event.nativeEvent.contentOffset.y),
      );
    },
    [max, min, scrollY],
  );

  return {
    scrollY,
    onScroll,
  };
};
