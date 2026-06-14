import { render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import { cn } from '../../src/cn';
import type { Labels } from '../../src/types';
import { cleanup, makeUseContext, translateLabel } from '../../src/utils';

describe("utils", () => {
  describe("cn", () => {
    it("can be called with no arguments", () => {
      expect(cn()).toBe("");
    });

    it("can be called with single class name argument", () => {
      expect(cn("class1")).toBe("class1");
    });

    it("can be called with multiple class name arguments", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("merges conflicting tailwind classes", () => {
      expect(cn("p-2", "p-4")).toBe("p-4");
    });
  });

  describe("translateLabel", () => {
    const labels: Labels = {
      Next: "next",
      Previous: "previous",
    };

    it("can be called with no labels", () => {
      expect(translateLabel(undefined, "Previous")).toBe("Previous");
    });

    it("handles absent translation correctly", () => {
      // @ts-expect-error - expected error
      expect(translateLabel(labels, "Other")).toBe("Other");
    });

    it("translates labels correctly", () => {
      expect(translateLabel(labels, "Previous")).toBe("previous");
      expect(translateLabel(labels, "Next")).toBe("next");
    });
  });

  describe("cleanup", () => {
    it("returns cleanup function", () => {
      expect(typeof cleanup() === "function").toBeTruthy();
    });

    it("calls cleanup methods", () => {
      const cleaners: (() => void)[] = Array.from({ length: 3 }).map(() =>
        vi.fn()
      );
      cleanup(...cleaners)();
      cleaners.forEach((cleaner) => {
        expect(cleaner).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("makeUseContext", () => {
    const context = {};
    const Context = React.createContext<typeof context | null>(null);

    function Test() {
      const useContext = makeUseContext("useContext", "Context", Context);
      return React.createElement(
        "div",
        null,
        useContext() === context ? "pass" : "fail"
      );
    }

    it("returns context", () => {
      render(
        React.createElement(
          Context.Provider,
          { value: context },
          React.createElement(Test)
        )
      );

      expect(screen.queryByText("pass")).toBeInTheDocument();
    });

    it("throws error when used outside of context provider", () => {
      class ErrorBoundary extends React.Component<
        React.PropsWithChildren<object>,
        { error: boolean }
      > {
        constructor(props: React.PropsWithChildren<object>) {
          super(props);
          this.state = { error: false };
        }

        // noinspection JSUnusedGlobalSymbols
        componentDidCatch() {
          this.setState({ error: true });
        }

        render() {
          const { props, state } = this;
          if (state.error) {
            return React.createElement("div", null, "error");
          }
          return props.children;
        }
      }

      const consoleSpy = vi.spyOn(console, "error");
      consoleSpy.mockImplementation(() => {});

      try {
        render(
          React.createElement(ErrorBoundary, null, React.createElement(Test))
        );
      } finally {
        consoleSpy.mockRestore();
      }

      expect(screen.queryByText("error")).toBeInTheDocument();
      expect(screen.queryByText("pass")).not.toBeInTheDocument();
      expect(screen.queryByText("fail")).not.toBeInTheDocument();
    });
  });
});
