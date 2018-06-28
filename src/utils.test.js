import utils from "./utils.js";

describe("environment", () => {
  beforeEach(() => {
    delete global.document;
    delete global.navigator;
  });

  test("should get a WEB environment", () => {
    global.document = {};
    const environment = utils.environment;
    expect(environment).toBe("WEB");
  });

  test("should get a REACT-NATIVE environment", () => {
    global.navigator = {
      product: "ReactNative"
    };
    const environment = utils.environment;
    expect(environment).toBe("REACT-NATIVE");
  });

  test("should get a NODE environment", () => {
    const environment = utils.environment;
    expect(environment).toBe("NODE");
  });
});
