import { act, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import type { CaptionsRef, LightboxExternalProps } from '../../src/index';
import { Captions } from '../../src/plugins/index';
import { lightbox } from "../test-utils";

function renderLightbox(props?: LightboxExternalProps) {
  const slides = [
    { description: "description1", src: "image1", title: "title1" },
    { description: "description2", src: "image2", title: "title2" },
  ];

  return render(
    lightbox({
      carousel: { preload: 0 },
      plugins: [Captions],
      slides,
      ...props,
    })
  );
}

describe("Captions", () => {
  it("renders title an description", () => {
    renderLightbox();

    expect(screen.queryByText("title1")).toBeInTheDocument();
    expect(screen.queryByText("description1")).toBeInTheDocument();
    expect(screen.queryByText("title2")).not.toBeInTheDocument();
    expect(screen.queryByText("description2")).not.toBeInTheDocument();

    act(() => {
      screen.getByRole("button", { name: "Next" }).click();
    });

    expect(screen.queryByText("title1")).not.toBeInTheDocument();
    expect(screen.queryByText("description1")).not.toBeInTheDocument();
    expect(screen.queryByText("title2")).toBeInTheDocument();
    expect(screen.queryByText("description2")).toBeInTheDocument();
  });

  it("supports captions toggle button", () => {
    const ref = React.createRef<CaptionsRef>();

    renderLightbox({ captions: { ref, showToggle: true } });

    expect(screen.queryByText("title1")).toBeInTheDocument();

    act(() => {
      ref.current!.hide();
    });

    expect(screen.queryByText("title1")).not.toBeInTheDocument();

    act(() => {
      ref.current!.show();
    });

    expect(screen.queryByText("title1")).toBeInTheDocument();
  });

  it("supports custom captions toggle button", () => {
    const buttonCaptions = vi.fn();

    renderLightbox({
      captions: { showToggle: true },
      render: { buttonCaptions },
    });

    expect(buttonCaptions).toHaveBeenCalled();
  });

  it("supports multiline descriptions ", () => {
    renderLightbox({
      captions: { descriptionMaxLines: 1, descriptionTextAlign: "center" },
      slides: [
        {
          description: "description line1\ndescription line2",
          src: "image",
          title: "title",
        },
      ],
    });

    expect(
      screen.queryByText(/description line1.*description line2/iu)
    ).toBeInTheDocument();
  });

  it("supports jsx in title and description", () => {
    renderLightbox({
      slides: [
        {
          description: React.createElement("h2", null, "description"),
          src: "image",
          title: React.createElement("h1", null, "title"),
        },
      ],
    });

    expect(screen.queryByText("title")).toBeInTheDocument();
    expect(screen.queryByText("description")).toBeInTheDocument();
  });

  it("doesn't override custom footer", () => {
    const slideFooter = vi.fn();

    renderLightbox({ render: { slideFooter } });

    expect(slideFooter).toHaveBeenCalled();
  });
});
