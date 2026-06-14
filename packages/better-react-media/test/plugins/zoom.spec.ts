import { act, render, screen } from "@testing-library/react";
import * as React from "react";

import { domClasses } from '../../src/dom-classes';
import { Zoom } from '../../src/plugins/index';
import type { GenericSlide, Slide } from '../../src/types';
import {
  expectLightboxToBeOpen,
  findCurrentSlide,
  lightbox,
} from "../test-utils";

declare module "../../types" {
  interface SlideTypes {
    "custom-slide": CustomSlide;
  }
}

interface CustomSlide extends GenericSlide {
  type: "custom-slide";
}

function customSlideRenderer({ slide }: { slide: Slide }) {
  if (slide.type === "custom-slide") {
    return React.createElement("div", { "data-testid": "custom-slide" });
  }
}

describe("Zoom", () => {
  it("renders without crashing", () => {
    render(
      lightbox({
        plugins: [Zoom],
        slides: Array.from({ length: 3 }).map((_, i) => ({
          height: 2000,
          src: `image${i + 1}`,
          width: 3000,
        })),
      })
    );

    act(() => {
      screen.getByLabelText("Zoom in").click();
    });

    act(() => {
      screen.getByLabelText("Zoom out").click();
    });

    expectLightboxToBeOpen();
  });

  it("supports custom slide types", () => {
    render(
      lightbox({
        plugins: [Zoom],
        render: { slide: customSlideRenderer },
        slides: [{ type: "custom-slide" }],
        zoom: { supports: ["custom-slide"] },
      })
    );

    const customSlide = findCurrentSlide()?.querySelector(
      "[data-testid='custom-slide']"
    );
    expect(customSlide).toBeInTheDocument();
    expect(
      customSlide?.closest(`.${CSS.escape(domClasses.slideWrapper)}`)
    ).toBeInTheDocument();
  });

  it("does not wrap unsupported custom slide types", () => {
    render(
      lightbox({
        plugins: [Zoom],
        render: { slide: customSlideRenderer },
        slides: [{ type: "custom-slide" }],
      })
    );

    const customSlide = findCurrentSlide()?.querySelector(
      "[data-testid='custom-slide']"
    );
    expect(customSlide).toBeInTheDocument();
    expect(customSlide?.closest(`.${CSS.escape(domClasses.slideWrapper)}`)).toBeNull();
  });

  it("supports maxZoom as a function", () => {
    render(
      lightbox({
        plugins: [Zoom],
        render: { slide: customSlideRenderer },
        slides: [{ type: "custom-slide" }],
        zoom: {
          maxZoom: (slide: Slide) =>
            slide.type === "custom-slide" ? 5 : undefined,
          supports: ["custom-slide"],
        },
      })
    );

    const customSlide = findCurrentSlide()?.querySelector(
      "[data-testid='custom-slide']"
    );
    expect(customSlide).toBeInTheDocument();
    expect(
      customSlide?.closest(`.${CSS.escape(domClasses.slideWrapper)}`)
    ).toBeInTheDocument();
  });
});
