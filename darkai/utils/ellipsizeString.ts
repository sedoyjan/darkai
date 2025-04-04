export function ellipsize(input: string, maxLength: number): string {
  // Check if the input length is greater than the max length
  if (input.length > maxLength) {
    // Return the substring from start to max length minus 3 for the ellipsis, then add the ellipsis
    return input.substring(0, maxLength - 3) + '...';
  } else {
    // Return the original input if it's within the max length
    return input;
  }
}
