"use client";

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      style={{
        position: "absolute",
        left: -9999,
        top: 0,
        zIndex: 2000,
        padding: "12px 20px",
        background: "#0d6efd",
        color: "#fff",
        borderRadius: 8,
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = "12px";
        e.currentTarget.style.top = "12px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = "-9999px";
      }}
    >
      Skip to main content
    </a>
  );
}
