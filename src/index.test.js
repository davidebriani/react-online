import React from "react";
import renderer from "react-test-renderer";
import Online from "./index";

test("learning to use jest for unit testing", () => {
  const onChange = () => {};
  const render = () => <div />;
  const component = renderer.create(
    <Online onChange={onChange} render={render} />
  );
  expect(onChange).toBeDefined();
});
