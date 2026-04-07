"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react"; // Added this for your session
import { makeStore, AppStore } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <SessionProvider>
      <Provider store={storeRef.current}>
        {children}
      </Provider>
    </SessionProvider>
  );
}