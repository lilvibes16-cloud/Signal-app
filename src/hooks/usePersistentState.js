import { useEffect, useState } from "react";
import { readStored, writeStored } from "../workspace.js";

// Accessing localStorage itself can throw in restricted browser contexts.
function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function usePersistentState(key, normalize) {
  const [initial] = useState(() =>
    readStored(browserStorage(), key, normalize),
  );
  const [value, setValue] = useState(initial.value);
  const [failed, setFailed] = useState(initial.error);
  useEffect(() => {
    setFailed(!writeStored(browserStorage(), key, value));
  }, [key, value]);
  return [value, setValue, failed];
}
