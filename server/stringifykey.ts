import firebaseConfig from "./darkai-ac3fd-firebase-adminsdk.json";
import { encodeConfig } from "./utils";

const escapedConfig = encodeConfig(firebaseConfig);
console.log(escapedConfig);
