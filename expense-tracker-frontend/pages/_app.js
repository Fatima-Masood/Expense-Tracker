import "@/styles/globals.css";
import Layout from "@/layout/layout";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";


export default function App({ Component, pageProps }) {
  useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (!stored) {
            stored = window.matchMedia("(prefers-color-scheme: dark)").matches;
            localStorage.setItem("theme", stored);
        }        
    }, []);

  return (
    <SessionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
