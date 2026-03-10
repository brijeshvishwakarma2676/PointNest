import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Router from "./routes/router";
import useAuthStore from "./store/authStore";

function App() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // If the browser reloads and there's no access_token in localStorage,
    // explicitly clear the Zustand store state so they are forced logged out.
    const token = localStorage.getItem("access_token");
    if (!token) {
      logout();
    }
  }, [logout]);

  return (
    <>
      <Toaster position="top-right" />
      <Router />
    </>
  );
}

export default App;
