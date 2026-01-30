import { act, renderHook } from "@testing-library/react";
import { useIsDarkMode } from "./useIsDarkMode";

describe("useIsDarkMode", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => {
      return {
        matches: false, // default to light mode
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
  });
  afterEach(() => {
    // Restore the original matchMedia after each test
    window.matchMedia = originalMatchMedia;

    // Clear all mocks to reset call counts
    jest.clearAllMocks();
  });
  it("should return true if in dark mode", () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => {
      return {
        matches: true, // default to light mode
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    const { result } = renderHook(() => useIsDarkMode());
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-color-scheme: dark)",
    );
    expect(result.current[0]).toBe(true);
  });

  it("should return false if in light mode", () => {
    const { result } = renderHook(() => useIsDarkMode());
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-color-scheme: dark)",
    );
    expect(result.current[0]).toBe(false);
  });

  it("sets up adds and remove event listener", () => {
    const addEventListenerSpy = jest.fn();
    const removeEventListenerSpy = jest.fn();

    window.matchMedia = jest.fn().mockImplementation((query: string) => {
      return {
        matches: true, // default to light mode
        media: query,
        onchange: null,
        addEventListener: addEventListenerSpy,
        removeEventListener: removeEventListenerSpy,
        dispatchEvent: jest.fn(),
      };
    });
    const { unmount } = renderHook(() => useIsDarkMode());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should be able set dark mode manually", () => {
    const { result } = renderHook(() => useIsDarkMode());
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](false);
    });
    expect(result.current[0]).toBe(false);
  });

  it.skip("should be able to listen to change event within media query list", () => {});
});
