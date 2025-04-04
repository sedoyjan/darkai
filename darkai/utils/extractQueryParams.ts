export function extractQueryParams(url: string): Record<string, string> {
  const queryParams: Record<string, string> = {};
  const urlObj = new URL(url);

  urlObj.searchParams.forEach((value, key) => {
    queryParams[key] = decodeURIComponent(value);
  });

  return queryParams;
}
