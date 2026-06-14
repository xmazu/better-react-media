import { render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import type { ControllerRef, LightboxExternalProps } from '../../src/index';
import { Inline } from '../../src/plugins/index';
import { lightbox, expectLightboxToBeOpen } from "../test-utils";

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ plugins: [Inline], ...props }));
}

function testMainScenario() {
  expectLightboxToBeOpen();
  expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Previous")).toBeInTheDocument();
  expect(screen.queryByLabelText("Next")).toBeInTheDocument();
}

describe("Inline", () => {
  it("renders inline lightbox", () => {
    renderLightbox();

    testMainScenario();
  });

  it("ignores open prop", () => {
    renderLightbox({ open: false });

    testMainScenario();
  });

  it("doesn't close", () => {
    const close = vi.fn();
    const ref = React.createRef<ControllerRef>();

    renderLightbox({ close, controller: { ref } });

    ref.current!.close();

    expect(close).not.toHaveBeenCalled();

    testMainScenario();
  });
});
