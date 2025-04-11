import axios from "axios";
import { v4 } from "uuid";

export const uuid = () => {
  return v4();
};

export const getApplePublicKeys = async () => {
  const response = await axios.get("https://appleid.apple.com/auth/keys");
  return response.data.keys;
};
