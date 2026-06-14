import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import type { LightboxExternalProps } from '../../src/index';
import { Download } from '../../src/plugins/index';
import { clickButton, lightbox, expectLightboxToBeOpen } from "../test-utils";

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ plugins: [Download], ...props }));
}

describe("Download", () => {
  it("renders the download button", () => {
    const download = vi.fn();

    renderLightbox({
      on: { download },
      slides: [{ src: "image1" }, { src: "image2" }],
    });

    expect(screen.queryByLabelText("Download")).toBeInTheDocument();

    clickButton("Download");

    expect(download).toHaveBeenCalled();
  });

  it("doesn't crash with empty slides", () => {
    renderLightbox();

    expectLightboxToBeOpen();
  });

  it("supports custom download button", () => {
    const buttonDownload = vi.fn();

    renderLightbox({ render: { buttonDownload } });

    expect(buttonDownload).toHaveBeenCalled();
  });

  it("supports custom download function", () => {
    const download = vi.fn();

    renderLightbox({
      download: { download },
      slides: [{ download: true, src: "image" }],
    });

    clickButton("Download");

    expect(download).toHaveBeenCalled();
  });
});
