import { useEffect } from "react";
import { auth } from "../../server/firebase";

function AutoLogout() {
  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        auth.signOut();
        window.location.href = "/"; 
      }, 60 * 60 * 1000); 
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer(); 

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  return null;
}

export default AutoLogout;
