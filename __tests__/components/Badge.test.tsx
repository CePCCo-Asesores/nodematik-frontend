import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("<Badge />", () => {
  it("renders children text", () => {
    render(<Badge>Activo</Badge>);
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  it("defaults to 'ok' variant classes", () => {
    const { container } = render(<Badge>OK</Badge>);
    expect(container.firstChild).toHaveClass("text-[#34D17F]");
  });

  it("applies 'err' variant classes", () => {
    const { container } = render(<Badge variant="err">Error</Badge>);
    expect(container.firstChild).toHaveClass("text-[#FF6B6B]");
  });

  it("applies 'warn' variant classes", () => {
    const { container } = render(<Badge variant="warn">Alerta</Badge>);
    expect(container.firstChild).toHaveClass("text-[#E3B43C]");
  });

  it("applies 'info' variant classes", () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    expect(container.firstChild).toHaveClass("text-[#5BA8E3]");
  });

  it("applies 'gold' variant classes", () => {
    const { container } = render(<Badge variant="gold">Gold</Badge>);
    expect(container.firstChild).toHaveClass("text-[#A8861C]");
  });

  it("applies extra className", () => {
    const { container } = render(<Badge className="mt-4">X</Badge>);
    expect(container.firstChild).toHaveClass("mt-4");
  });
});
