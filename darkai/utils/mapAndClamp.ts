/**
 * Maps a value from one range to another, clamping to the target range.
 *
 * @param value - The value to map.
 * @param fromMin - The minimum of the input range.
 * @param fromMax - The maximum of the input range.
 * @param toMin - The minimum of the target range.
 * @param toMax - The maximum of the target range.
 * @returns The mapped value, clamped to the target range.
 */
export function mapAndClamp(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  'worklet';

  // Ensure input range is valid to avoid division by zero
  if (fromMax === fromMin) {
    throw new Error('Input range cannot have fromMin equal to fromMax.');
  }

  // Map the value from the input range to the target range
  const mappedValue =
    ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;

  // Clamp the value to the target range
  return Math.min(Math.max(mappedValue, toMin), toMax);
}
