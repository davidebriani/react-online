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
  render: (state: State) => Element<any>,
  onChange: (state: State) => any
};

export default class Online extends React.Component<Props, State> {
  static defaultProps = {
    onChange: () => {},
    render: () => null
  };

  checkInterval = null;

  state = {
    online: window && window.navigator ? window.navigator.onLine : false
  };

  componentDidMount() {
    if (utils.environment === "WEB" && window && window.addEventListener) {
      window.addEventListener("offline", this.markAsOffline);
      window.addEventListener("online", this.checkIfOnline);
    } else if (utils.environment === "REACT-NATIVE") {
      NetInfo.addEventListener(
        "connectionChange",
        this.handleReactNativeConnectionChange
      );
    } else {
      this.checkInterval = setInterval(this.checkIfOnline, 5000);
    }
    this.checkIfOnline();
  }

  componentWillUnmount() {
    if (utils.environment === "WEB" && window && window.addEventListener) {
      window.removeEventListener("offline", this.markAsOffline);
      window.removeEventListener("online", this.checkIfOnline);
    } else if (utils.environment === "REACT-NATIVE") {
      NetInfo.remoteEventListener(
        "connectionChange",
        this.handleReactNativeConnectionChange
      );
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  checkIfOnline = () => {
    if (window && window.navigator) {
      if (!window.navigator.onLine) {
        return this.handleConnectionChange(false);
      }
    }
    isOnline().then((online: boolean) => this.handleConnectionChange(online));
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
      return;
    }
    this.setState({ online });
    if (typeof onChange === "function") {
      onChange({ online });
    }
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
