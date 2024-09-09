import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "../utils/setupTests";
import "@testing-library/jest-dom/vitest";

import Calendar from "../pages/calendar";
import { makeServer } from "../server";
import { TServerContext } from "../server/types";

let server: TServerContext;

beforeEach(() => {
  server = makeServer();
  //  If your API is at a different port or host than your app, you'll need something like:
  //  server = createServer({
  //    environment: "test",
  //    urlPrefix: "http://api.acme.com:3000",
  //  })
});

afterEach(() => {
  server.shutdown();
});

describe("The Calendar Page", () => {
  it("should render calendar on July, 07th 2024", async () => {
    expect.assertions(5);

    render(<Calendar />);

    await waitFor(() => screen.getByText("10:00"));

    expect(
      screen.getByRole("button", { name: "Dia anterior" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Próximo dia" })
    ).toBeInTheDocument();
    expect(screen.getByText("7 de julho de 2024")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.getByText("11:00")).toBeInTheDocument();
  });

  it("should render no results when loads the appointments for day July, 6th", async () => {
    expect.assertions(10);
    render(<Calendar />);

    await waitFor(() => screen.getByText("10:00"));

    const dayBeforeButton = screen.getByRole("button", {
      name: "Dia anterior",
    });

    expect(dayBeforeButton).toBeInTheDocument();
    expect(screen.getByText("7 de julho de 2024")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.getByText("11:00")).toBeDefined();
    expect(screen.queryByText("Não existem horários disponíveis.")).toBeNull();

    fireEvent.click(dayBeforeButton);
    await waitFor(() => screen.getByText("Não existem horários disponíveis."));

    expect(screen.queryByText("7 de julho de 2024")).toBeNull();
    expect(screen.getByText("6 de julho de 2024")).toBeDefined();
    expect(screen.queryByText("10:00")).toBeNull();
    expect(screen.queryByText("11:00")).toBeNull();
    expect(
      screen.getByText("Não existem horários disponíveis.")
    ).toBeInTheDocument();
  });

  it("should render no results when loads the appointments for day July, 8th", async () => {
    expect.assertions(8);
    render(<Calendar />);

    await waitFor(() => screen.getByText("10:00"));

    const dayBeforeButton = screen.getByRole("button", {
      name: "Próximo dia",
    });

    expect(dayBeforeButton).toBeDefined();
    expect(screen.getByText("7 de julho de 2024")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.getByText("11:00")).toBeInTheDocument();

    fireEvent.click(dayBeforeButton);
    await waitFor(() => screen.getByText("09:00"));

    expect(screen.queryByText("7 de julho de 2024")).toBeNull();
    expect(screen.getByText("8 de julho de 2024")).toBeInTheDocument();
    expect(screen.queryByText("10:00")).toBeNull();
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });
});
