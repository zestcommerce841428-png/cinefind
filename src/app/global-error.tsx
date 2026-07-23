"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0e14",
          color: "#fff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>CineFind hit a snag</div>
          <p style={{ opacity: 0.7, marginBottom: 24 }}>
            A critical error occurred. Please reload the page — if this keeps happening, try again
            later.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#fff",
              color: "#0b0e14",
              border: "none",
              borderRadius: 999,
              padding: "10px 24px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
