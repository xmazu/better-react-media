import { render, screen } from "@testing-library/react";

import type { LightboxExternalProps } from '../../src/index';
import { Counter } from '../../src/plugins/index';
import { lightbox, expectLightboxToBeOpen } from "../test-utils";

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ plugins: [Counter], ...props }));
}

describe("Counter", () => {
  it("renders the counter", () => {
    renderLightbox({ slides: [{ src: "image1" }, { src: "image2" }] });

    expect(screen.queryByText("1 / 2")).toBeInTheDocument();
  });

  it("doesn't crash with empty slides", () => {
    renderLightbox();

    expectLightboxToBeOpen();
  });
});
