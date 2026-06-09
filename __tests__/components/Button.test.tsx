import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("<Button />", () => {
  it("renders children text", () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>No</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled and shows spinner when loading=true", () => {
    const { container } = render(<Button loading>Cargando</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  it("does not call onClick when disabled", async () => {
    const handler = vi.fn();
    render(<Button disabled onClick={handler}>X</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("applies 'gold' variant class by default", () => {
    const { container } = render(<Button>X</Button>);
    expect(container.firstChild).toHaveClass("bg-gold-500");
  });

  it("applies 'indigo' variant class", () => {
    const { container } = render(<Button variant="indigo">X</Button>);
    expect(container.firstChild).toHaveClass("bg-[#1B1F5A]");
  });

  it("applies 'outline' variant class", () => {
    const { container } = render(<Button variant="outline">X</Button>);
    expect(container.firstChild).toHaveClass("border-[#313861]");
  });

  it("applies 'sm' size class", () => {
    const { container } = render(<Button size="sm">X</Button>);
    expect(container.firstChild).toHaveClass("rounded-[9px]");
  });

  it("applies 'lg' size class", () => {
    const { container } = render(<Button size="lg">X</Button>);
    expect(container.firstChild).toHaveClass("py-[16px]");
  });

  it("merges extra className", () => {
    const { container } = render(<Button className="w-full">X</Button>);
    expect(container.firstChild).toHaveClass("w-full");
  });

  it("passes down extra props (e.g. type=submit)", () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
