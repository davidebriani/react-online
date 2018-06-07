/* @flow */
export default {
  get environment() {
    if (typeof document !== "undefined") {
      return "WEB";
    } else if (
      typeof navigator !== "undefined" &&
      navigator.product === "ReactNative"
    ) {
      return "REACT-NATIVE";
    } else {
      return "NODE";
    }
  }
};
