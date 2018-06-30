import React from "react";
import isOnline from "isomorphic-is-online";
import renderer from "react-test-renderer";
import Enzyme, { shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Online from "./index.js";
import utils from "./utils.js";
import { NetInfo } from "react-native";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("isomorphic-is-online");
jest.mock("react-native");
jest.mock("./utils");

describe("WEB", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    utils.__setEnvironment("WEB");
  });

  test("renders with sane defaults", async done => {
    let wrapper = null;
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(false);
      wrapper = shallow(<Online />);
      await wrapper.instance().componentDidMount();
      expect(isOnline).toHaveBeenCalledTimes(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("navigator: online, isomorphic-is-online: offline", async done => {
    let wrapper = null;
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: true,
        configurable: true
      });
      isOnline.mockResolvedValue(false);
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(1);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("navigator: online, isomorphic-is-online: online", async done => {
    let wrapper = null;
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: true,
        configurable: true
      });
      isOnline.mockResolvedValue(true);
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(1);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(true);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("navigator: offline, isomorphic-is-online: offline", async done => {
    let wrapper = null;
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(false);
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(0);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("navigator: offline, isomorphic-is-online: online", async done => {
    let wrapper = null;
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(true);
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(0);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("component registers event handlers properly", async done => {
    let wrapper = null;
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(false);
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      expect(addEventListenerSpy).toHaveBeenCalledTimes(0);
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      await wrapper.instance().componentDidMount();
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(addEventListenerSpy.mock.calls[0][0]).toEqual("offline");
      expect(addEventListenerSpy.mock.calls[1][0]).toEqual("online");
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("navigator: offline -> online, isomorphic-is-online: online", async done => {
    let wrapper = null;
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(true);
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(0);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(false);

      const markAsOfflineSpy = jest.spyOn(wrapper.instance(), "markAsOffline");
      const handleReactNativeConnectionChangeSpy = jest.spyOn(
        wrapper.instance(),
        "handleReactNativeConnectionChange"
      );
      const handleConnectionChangeSpy = jest.spyOn(
        wrapper.instance(),
        "handleConnectionChange"
      );
      expect(handleConnectionChangeSpy).toHaveBeenCalledTimes(0);

      const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");
      Object.defineProperty(window.navigator, "onLine", {
        value: true,
        configurable: true
      });
      window.dispatchEvent(new Event("online"));
      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      await new Promise(resolve => setTimeout(() => resolve(), 0));

      expect(handleConnectionChangeSpy).toHaveBeenCalledTimes(1);
      expect(markAsOfflineSpy).toHaveBeenCalledTimes(0);
      expect(handleReactNativeConnectionChangeSpy).toHaveBeenCalledTimes(0);
      expect(isOnline).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toEqual({ online: true });
      expect(wrapper.state("online")).toBe(true);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("navigator: online -> offline, isomorphic-is-online: offline", async done => {
    let wrapper = null;
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: true,
        configurable: true
      });
      isOnline.mockResolvedValue(false);
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = mount(<Online onChange={onChange} render={renderComponent} />);
      await wrapper.instance().componentDidMount();
      expect(isOnline).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(wrapper.state("online")).toBe(false);

      const handleConnectionChangeSpy = jest.spyOn(
        wrapper.instance(),
        "handleConnectionChange"
      );
      expect(handleConnectionChangeSpy).toHaveBeenCalledTimes(0);

      const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      window.dispatchEvent(new Event("offline"));
      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      await new Promise(resolve => setTimeout(() => resolve(), 0));

      expect(handleConnectionChangeSpy).toHaveBeenCalledTimes(1);
      expect(isOnline).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });
});

describe("REACT-NATIVE", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    utils.__setEnvironment("REACT-NATIVE");
  });

  test("renders with sane defaults", async done => {
    let wrapper = null;
    try {
      NetInfo.__setConnectionInfo({ type: "cellular" });
      wrapper = shallow(<Online />);
      await wrapper.instance().componentDidMount();
      expect(isOnline).toHaveBeenCalledTimes(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("mounts with correct infos with cellular connectivity", async done => {
    let wrapper = null;
    try {
      NetInfo.__setConnectionInfo({ type: "cellular" });
      const connectionInfo = NetInfo.getConnectionInfo();
      expect(connectionInfo.type).toBe("cellular");
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      const handleReactNativeConnectionChangeSpy = jest.spyOn(
        wrapper.instance(),
        "handleReactNativeConnectionChange"
      );
      await wrapper.instance().componentDidMount();
      expect(handleReactNativeConnectionChangeSpy).toHaveBeenCalledTimes(0);
      expect(isOnline).toHaveBeenCalledTimes(0);
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("correctly reacts to connectivity change", async done => {
    let wrapper = null;
    try {
      NetInfo.__setConnectionInfo({ type: "none" });
      const connectionInfo = NetInfo.getConnectionInfo();
      expect(connectionInfo.type).toBe("none");
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      const handleConnectionChangeSpy = jest.spyOn(
        wrapper.instance(),
        "handleConnectionChange"
      );
      const handleReactNativeConnectionChangeSpy = jest.spyOn(
        wrapper.instance(),
        "handleReactNativeConnectionChange"
      );
      await wrapper.instance().componentDidMount();
      expect(handleReactNativeConnectionChangeSpy).toHaveBeenCalledTimes(0);
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(wrapper.state("online")).toBe(false);
      wrapper.instance().handleReactNativeConnectionChange({ type: "none" });
      expect(wrapper.state("online")).toBe(false);
      expect(handleConnectionChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledTimes(0);
      wrapper.instance().handleReactNativeConnectionChange({ type: "wifi" });
      expect(wrapper.state("online")).toBe(true);
      expect(handleConnectionChangeSpy).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(isOnline).toHaveBeenCalledTimes(0);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });

  test("returns correct online status on connection change", async done => {
    let wrapper = null;
    try {
      NetInfo.__setConnectionInfo({ type: "none" });
      const connectionInfo = NetInfo.getConnectionInfo();
      expect(connectionInfo.type).toBe("none");
      const onChange = jest.fn();
      const renderComponent = () => <div />;
      wrapper = shallow(
        <Online onChange={onChange} render={renderComponent} />
      );
      await wrapper.instance().componentDidMount();
      expect(wrapper.state("online")).toBe(false);
      wrapper.instance().handleReactNativeConnectionChange({ type: "none" });
      expect(wrapper.state("online")).toBe(false);
      wrapper.instance().handleReactNativeConnectionChange({ type: "wifi" });
      expect(wrapper.state("online")).toBe(true);
      wrapper
        .instance()
        .handleReactNativeConnectionChange({ type: "cellular" });
      expect(wrapper.state("online")).toBe(true);
      wrapper.instance().handleReactNativeConnectionChange({ type: "unknown" });
      expect(wrapper.state("online")).toBe(false);
      wrapper.instance().handleReactNativeConnectionChange({ type: "rubbish" });
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });
});

describe("NODE", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    utils.__setEnvironment("NODE");
  });

  test("renders with sane defaults", async done => {
    let wrapper = null;
    try {
      isOnline.mockResolvedValue(true);
      wrapper = shallow(<Online />);
      await wrapper.instance().componentDidMount();
      expect(isOnline).toHaveBeenCalledTimes(1);
      expect(wrapper.state("online")).toBe(true);
      expect(wrapper.instance().checkInterval).toBeTruthy();
      done();
    } catch (e) {
      done.fail(e);
    } finally {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
    }
  });
});
