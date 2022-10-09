import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import H1 from "../components/common/heading/H1";
import H2 from "../components/common/heading/H2";
import H3 from "../components/common/heading/H3";
import H4 from "../components/common/heading/H4";
describe("Heading component", () => {
  it("renders a h1  without crashing", () => {
    render(<H1>test</H1>);
  });
  it("renders a h2 without crashing", () => {
    render(<H2>test</H2>);
  });
  it("renders a h3 without crashing", () => {
    render(<H3>test</H3>);
  });
  it("renders a h4 without crashing", () => {
    render(<H4>test</H4>);
  });
  it("renders a h1 without  without duplicate", async () => {
    render(<H1>test</H1>);
    expect(
      await screen.findByRole("heading", { name: /test/i })
    ).toBeInTheDocument();
  });
  it("renders a h2 without  without duplicate", async () => {
    render(<H2>test</H2>);
    expect(
      await screen.findByRole("heading", { name: /test/i })
    ).toBeInTheDocument();
  });
  it("renders a h3 without  without duplicate", async () => {
    render(<H3>test</H3>);
    expect(
      await screen.findByRole("heading", { name: /test/i })
    ).toBeInTheDocument();
  });
  it("renders a h4 without without duplicate", async () => {
    render(<H4>test</H4>);
    expect(
      await screen.findByRole("heading", { name: /test/i })
    ).toBeInTheDocument();
  });

  it("renrder with props", async () => {
    let props = {
      className: "test-class",
    };
    render(<H4 {...props}>test</H4>);
  });
});
