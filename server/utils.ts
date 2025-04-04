// Encode JSON object to Base64 string
export function encodeConfig(config: any): string {
  // Convert JSON object to string and then to Base64
  const jsonString = JSON.stringify(config);
  return btoa(jsonString);
}

// Decode Base64 string back to JSON object
export function decodeConfig(encodedString: string): any {
  // Decode Base64 to string and parse back to JSON
  const jsonString = atob(encodedString);
  return JSON.parse(jsonString);
}
