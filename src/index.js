/* @flow */
import React from "react";
import { NetInfo } from "react-native";
import isOnline from "isomorphic-is-online";
import utils from "./utils";

import type { Element } from "react";

type State = {
  online: boolean
};

type Props = {
  render?: (state: State) => Element<any>,
  onChange?: (state: State) => any
};

export default class Online extends React.Component<Props, State> {
  static defaultProps = {
    onChange: () => {},
    render: () => null
  };

  checkInterval = null;
  hasEventListeners = false;
  isCheckingConnection = false;
  needsInitialCheck = true;

  // state = {
  //   online: !!window && !!window.navigator ? !!window.navigator.onLine : false
  // };

  constructor(props: Props) {
    super(props);
    let online = false;
    if (utils.environment === "WEB") {
      online =
        !!window && !!window.navigator ? !!window.navigator.onLine : false;
    }
    this.state = { online };
  }

  componentDidMount() {
    if (utils.environment === "WEB" && window && window.addEventListener) {
      if (!this.hasEventListeners) {
        window.addEventListener("offline", this.markAsOffline);
        window.addEventListener("online", this.checkIfOnline);
        this.hasEventListeners = true;
      }
      return this.checkIfOnline();
    } else if (utils.environment === "REACT-NATIVE") {
      if (!this.hasEventListeners) {
        NetInfo.addEventListener(
          "connectionChange",
          this.handleReactNativeConnectionChange
        );
        this.hasEventListeners = true;
      }
    } else {
      if (setInterval && typeof setInterval === "function") {
        this.checkInterval = setInterval(this.checkIfOnline, 5000);
      }
      return this.checkIfOnline();
    }
  }

  componentWillUnmount() {
    if (utils.environment === "WEB" && window && window.addEventListener) {
      window.removeEventListener("offline", this.markAsOffline);
      window.removeEventListener("online", this.checkIfOnline);
    } else if (utils.environment === "REACT-NATIVE") {
      NetInfo.removeEventListener(
        "connectionChange",
        this.handleReactNativeConnectionChange
      );
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.hasEventListeners = false;
  }

  checkIfOnline = () => {
    if (this.isCheckingConnection) {
      return;
    }
    this.isCheckingConnection = true;
    if (window && window.navigator) {
      if (!window.navigator.onLine) {
        this.handleConnectionChange(false);
        this.isCheckingConnection = false;
        return;
      }
    }
    return isOnline().then((online: boolean) => {
      this.handleConnectionChange(online);
      this.isCheckingConnection = false;
    });
  };

  handleReactNativeConnectionChange = (connectionInfo: any) => {
    switch (connectionInfo.type) {
      case "none":
        return this.handleConnectionChange(false);
      case "wifi":
        return this.handleConnectionChange(true);
      case "cellular":
        return this.handleConnectionChange(true);
      case "unknown":
        return this.handleConnectionChange(false);
      default:
        return this.handleConnectionChange(false);
    }
  };

  handleConnectionChange = (online: boolean) => {
    const { onChange } = this.props;
    if (online === this.state.online) {
      this.needsInitialCheck = false;
      return;
    }
    this.setState({ online });
    if (typeof onChange === "function") {
      if (!this.needsInitialCheck) {
        return onChange({ online });
      }
    }
    this.needsInitialCheck = false;
  };

  markAsOffline = () => {
    this.handleConnectionChange(false);
  };

  render() {
    const { render } = this.props;
    const renderedComponent =
      typeof render === "function" ? render(this.state) : null;
    return renderedComponent;
  }
}
