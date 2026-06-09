import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/Input";

describe("<Input />", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders label text when provided", () => {
    render(<Input label="Correo electrónico" />);
    expect(screen.getByText("Correo electrónico")).toBeInTheDocument();
  });

  it("renders hint text when provided", () => {
    render(<Input hint="Mínimo 8 caracteres" />);
    expect(screen.getByText("Mínimo 8 caracteres")).toBeInTheDocument();
  });

  it("renders error message when provided", () => {
    render(<Input error="Campo requerido" />);
    expect(screen.getByText("Campo requerido")).toBeInTheDocument();
  });

  it("applies error border class when error is set", () => {
    render(<Input error="Error" />);
    expect(screen.getByRole("textbox")).toHaveClass("border-[#FF6B6B]");
  });

  it("does not apply error border class when no error", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).not.toHaveClass("border-[#FF6B6B]");
  });

  it("applies dark theme classes by default", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveClass("bg-[#151935]");
  });

  it("applies light theme classes when dark=false", () => {
    render(<Input dark={false} />);
    expect(screen.getByRole("textbox")).toHaveClass("bg-white");
  });

  it("forwards value and onChange", async () => {
    let value = "";
    const { rerender } = render(
      <Input value={value} onChange={(e) => { value = e.target.value; }} />
    );
    await userEvent.type(screen.getByRole("textbox"), "hola");
    rerender(<Input value="hola" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("hola");
  });

  it("accepts placeholder prop", () => {
    render(<Input placeholder="Escribe aquí..." />);
    expect(screen.getByPlaceholderText("Escribe aquí...")).toBeInTheDocument();
  });

  it("merges extra className", () => {
    render(<Input className="w-full" />);
    expect(screen.getByRole("textbox")).toHaveClass("w-full");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });
});
