import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Exchange from "../components/Exchange/Exchange";
import "@testing-library/jest-dom";

describe("Exchange", () => {
  it("renders a Echange without crashing", () => {
    render(<Exchange />);
  });
  it("it should render  all test and headhing, without duplicate", async () => {
    render(<Exchange />);
    expect(
      await screen.findByRole("heading", { name: /send money/i })
    ).toBeInTheDocument();
    expect(await screen.getByText(/reciever gets/i)).toBeInTheDocument();
  });

  it("renders enabled button,  send meny  ", async () => {
    const doc = render(<Exchange />);
    const buttonSignup = doc.getByTestId("signup");
    expect(buttonSignup).toBeEnabled();
  });
  // it("renders Exchange unchanged", () => {
  //   const { container } = render(<Exchange />);
  //   expect(container).toMatchSnapshot();
  // });
});
