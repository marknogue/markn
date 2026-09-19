"use client";

import { useState, useEffect } from "react";

export function useHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHash);
    setHash(window.location.hash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return hash;
}
