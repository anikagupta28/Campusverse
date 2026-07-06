import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const isAdmin =
      localStorage.getItem("adminAuth") === "true" ||
      localStorage.getItem("role") === "admin";

    return isAdmin ? { admin: true } : { admin: false };
  });

  // Keep state in sync with localStorage changes (e.g. after login/logout)
  useEffect(() => {
    const syncFromStorage = () => {
      const storedToken = localStorage.getItem("token");
      const isAdmin =
        localStorage.getItem("adminAuth") === "true" ||
        localStorage.getItem("role") === "admin";

      setToken((prev) => (prev === storedToken ? prev : storedToken));
      setUser((prev) => {
        const prevIsAdmin = Boolean(prev?.admin);
        return prevIsAdmin === isAdmin ? prev : { admin: isAdmin };
      });
    };

    window.addEventListener("storage", syncFromStorage);

    // Same-tab localStorage writes don't trigger the `storage` event.
    // Poll lightly so logout/login immediately updates `user.admin`.
    const intervalId = window.setInterval(syncFromStorage, 500);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.clearInterval(intervalId);
    };
  }, []);

  const value = { user, token, setUser, setToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;