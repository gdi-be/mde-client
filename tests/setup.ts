/* eslint-disable @typescript-eslint/no-explicit-any */
import { mock } from "bun:test";

// Mock $app/state
mock.module("$app/state", () => {
  return {
    page: {
      url: new URL("http://localhost:3000")
    }
  };
});

// Mock $app/navigation
mock.module("$app/navigation", () => {
  return {
    invalidateAll: async () => {
      // Mock implementation of invalidateAll
      console.log("invalidateAll called");
    }
  };
});

// Mock svelte-french-toast
mock.module("svelte-french-toast", () => {
  return {
    toast: {
      error: (message: string) => {
        console.error("[Toast Error]:", message);
      },
      success: (message: string) => {
        console.log("[Toast Success]:", message);
      }
    }
  };
});

// Mock svelte context API and state
mock.module("svelte", () => {
  const contexts = new Map();

  return {
    getContext: (key: symbol) => contexts.get(key),
    setContext: (key: symbol, value: unknown) => contexts.set(key, value)
  };
});


// Mock svelte $state rune
const $state = Object.assign(
  <T>(initial?: T): T => initial as T,
  {
    raw: <T>(initial?: T): T => initial as T,
    snapshot: <T>(initial?: T): T => initial as T
  }
);
(global as any).$state = $state;
