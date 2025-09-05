import Header from "./header/header";
import Footer from "./footer";
import { useRef, useEffect, useState } from "react";

export default function Layout({ children }) {
  const headerRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setOffset(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div ref={headerRef}>
        <Header />
      </div>

      <main className="flex-grow" style={{ marginTop: offset+24 }}>
        {children}
      </main>

      <Footer />
    </div>
  );
}

