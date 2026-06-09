import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "@/components/ui/Spinner";

describe("<Spinner />", () => {
  it("renders a span element", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("span")).not.toBeNull();
  });

  it("applies 'sm' size class", () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveClass("w-3.5", "h-3.5");
  });

  it("applies 'md' size class (default)", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass("w-[17px]", "h-[17px]");
  });

  it("applies 'lg' size class", () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass("w-6", "h-6");
  });

  it("uses dark border by default (light=false)", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass("border-t-[#0C0E2A]");
  });

  it("uses light border when light=true", () => {
    const { container } = render(<Spinner light />);
    expect(container.firstChild).toHaveClass("border-t-white");
  });

  it("applies spin animation class", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass("animate-spin");
  });

  it("merges extra className", () => {
    const { container } = render(<Spinner className="my-custom-class" />);
    expect(container.firstChild).toHaveClass("my-custom-class");
  });
});
