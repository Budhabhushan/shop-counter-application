import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cart from "./Cart";

describe("Checkout divergence", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("charges the original snapshot when cart changes", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          attemptId: "attempt-1",
          lines: [
            {
              sku: "notebook",
              name: "Field notebook",
              unitPriceCents: 1500,
              qty: 1,
            },
          ],
          amountCents: 1500,
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          orderId: "order-1",
          attemptId: "attempt-1",
          lines: [
            {
              sku: "notebook",
              name: "Field notebook",
              unitPriceCents: 1500,
              qty: 1,
            },
          ],
          amountCents: 1500,
        }),
      } as Response);
    render(<Cart />);
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    fireEvent.click(screen.getByRole("button", { name: "Pay" }));

    await screen.findByText("Amount due");

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(
      screen.getByText(
        "Your cart changed after payment started. You will be charged the amount below.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("$15")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Complete payment",
      }),
    );
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Order placed" }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Field notebook × 1")).toBeInTheDocument();
    expect(screen.getByText("Amount charged")).toBeInTheDocument();

    const completeCall = vi.mocked(fetch).mock.calls[1];

    expect(JSON.parse(completeCall[1]?.body as string)).toEqual({
      attemptId: "attempt-1",
    });
  });
});
