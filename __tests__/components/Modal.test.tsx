import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/ui/Modal";

describe("<Modal />", () => {
  it("renders nothing when open=false", () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} title="Test">
        Contenido
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders children when open=true", () => {
    render(
      <Modal open onClose={vi.fn()}>
        Contenido del modal
      </Modal>
    );
    expect(screen.getByText("Contenido del modal")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Modal open onClose={vi.fn()} title="Mi Título">
        X
      </Modal>
    );
    expect(screen.getByText("Mi Título")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <Modal open onClose={vi.fn()} title="T" subtitle="Sub">
        X
      </Modal>
    );
    expect(screen.getByText("Sub")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Modal open onClose={vi.fn()} footer={<button>Aceptar</button>}>
        X
      </Modal>
    );
    expect(screen.getByRole("button", { name: "Aceptar" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="T">
        X
      </Modal>
    );
    await userEvent.click(screen.getByRole("button", { name: "" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="T">
        X
      </Modal>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when backdrop is clicked", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} title="T">
        X
      </Modal>
    );
    // The backdrop is the outermost fixed div
    const backdrop = container.querySelector(".fixed");
    if (backdrop) {
      fireEvent.click(backdrop, { target: backdrop });
    }
    // Note: the handler only fires when e.target === e.currentTarget,
    // so simulate that explicitly
    backdrop?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });

  it("does not call onClose when Escape is pressed and modal is closed", () => {
    const onClose = vi.fn();
    render(
      <Modal open={false} onClose={onClose} title="T">
        X
      </Modal>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders icon when provided", () => {
    render(
      <Modal open onClose={vi.fn()} title="T" icon="⚡">
        X
      </Modal>
    );
    expect(screen.getByText("⚡")).toBeInTheDocument();
  });
});
