"use strict";

const ReactNative = jest.genMockFromModule("react-native");

let connectionInfo = { type: "wifi" };

export const NetInfo = {
  __setConnectionInfo: info => {
    connectionInfo = info;
  },
  getConnectionInfo: () => connectionInfo,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

export default ReactNative;
