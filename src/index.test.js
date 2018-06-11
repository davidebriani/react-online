import React from "react";
import isOnline from "isomorphic-is-online";
import renderer from "react-test-renderer";
import Enzyme, { shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Online from "./index";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("isomorphic-is-online");

describe("WEB", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    isOnline.mockReset();
  });

  test("navigator: online, isomorphic-is-online: offline", async done => {
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: true,
        configurable: true
      });
      isOnline.mockResolvedValue(false);
      const onChange = jest.fn();
      const render = () => <div />;
      const wrapper = shallow(<Online onChange={onChange} render={render} />);
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(1);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toEqual({ online: false });
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  test("navigator: online, isomorphic-is-online: online", async done => {
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: true,
        configurable: true
      });
      isOnline.mockResolvedValue(true);
      const onChange = jest.fn();
      const render = () => <div />;
      const wrapper = shallow(<Online onChange={onChange} render={render} />);
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(1);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(true);
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  test("navigator: offline, isomorphic-is-online: offline", async done => {
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(false);
      const onChange = jest.fn();
      const render = () => <div />;
      const wrapper = shallow(<Online onChange={onChange} render={render} />);
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(0);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  test("navigator: offline, isomorphic-is-online: online", async done => {
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(true);
      const onChange = jest.fn();
      const render = () => <div />;
      const wrapper = shallow(<Online onChange={onChange} render={render} />);
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(0);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(false);
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  test("component registers event handlers properly", async done => {
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(false);
      const onChange = jest.fn();
      const render = () => <div />;
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      expect(addEventListenerSpy).toHaveBeenCalledTimes(0);
      const wrapper = shallow(<Online onChange={onChange} render={render} />);
      await wrapper.instance().componentDidMount();
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(addEventListenerSpy.mock.calls[0][0]).toEqual("offline");
      expect(addEventListenerSpy.mock.calls[1][0]).toEqual("online");
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  test.skip("navigator: offline -> online, isomorphic-is-online: online", async done => {
    try {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true
      });
      isOnline.mockResolvedValue(true);
      const onChange = jest.fn();
      const render = () => <div />;
      const wrapper = shallow(<Online onChange={onChange} render={render} />);
      await wrapper.instance().componentDidMount();
      expect(isOnline.mock.calls.length).toBe(0);
      expect(onChange.mock.calls.length).toBe(0);
      expect(wrapper.state("online")).toBe(false);

      // const map = {};
      // document.addEventListener = jest.fn((event, cb) => {
      //   map[event] = cb;
      // });
      // map.online({ type: "online" });

      const checkIfOnlineSpy = jest.spyOn(wrapper.instance(), "checkIfOnline");
      const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");
      Object.defineProperty(window.navigator, "onLine", {
        value: true,
        configurable: true
      });
      window.dispatchEvent(new Event("online"));
      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      // expect(checkIfOnlineSpy).toHaveBeenCalledTimes(1);

      await new Promise(resolve => setTimeout(() => resolve(), 1000));
      expect(isOnline.mock.calls.length).toBe(1);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toEqual({ online: true });
      expect(wrapper.state("online")).toBe(true);
      done();
    } catch (e) {
      done.fail(e);
    }
  });
});
