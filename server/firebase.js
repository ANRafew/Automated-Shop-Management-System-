import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./firebaseConfig.js"; // Here Use Your firebaseConfig (provided by your firebase project) 
                                                  // hidden due to security reason (never share apiKeys in public platform)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);