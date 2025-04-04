import firebaseConfig from "./subtaskai-firebase-adminsdk.json";

function escapeFirebaseConfig(config: any) {
  // Convert JSON object to string
  const jsonString = JSON.stringify(config);

  // Replace special characters to escape them, including changing double quotes to single quotes
  return jsonString
    .replace(/\\/g, "\\\\") // Escape backslashes
    .replace(/\n/g, "\\n") // Escape newlines
    .replace(/\r/g, "\\r") // Escape carriage returns
    .replace(/\t/g, "\\t") // Escape tabs
    .replace(/"/g, '\\"') // Escape double quotes for JSON
    .replace(/'/g, "\\'"); // Escape single quotes for .env
}

const escapedConfig = escapeFirebaseConfig(firebaseConfig);
console.log(escapedConfig);
