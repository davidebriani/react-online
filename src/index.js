import React from "react";
import isOnline from "isomorphic-is-online";

type Props = {
  render: Function,
  onChange: Function
};

type State = {
  online: boolean
};

export default class Online extends React.Component<Props, State> {
  static defaultProps = {
    onChange: () => {},
    render: () => null
  };

  state = {
    online: window && window.navigator ? window.navigator.onLine : false
  };

  componentDidMount() {
    if (window && window.addEventListener) {
      window.addEventListener("offline", this.markAsOffline);
      window.addEventListener("online", this.checkIfOnline);
    } else {
      this.checkInterval = setInterval(this.checkIfOnline, 30000);
    }
  }

  componentWillUnmount() {
    if (window && window.addEventListener) {
      window.removeEventListener("offline", this.markAsOffline);
      window.removeEventListener("online", this.checkIfOnline);
    }
    clearInterval(this.checkInterval);
  }

  checkIfOnline = () => {
    if (window && window.navigator) {
      if (!window.navigator.onLine) {
        return this.handleChange(false);
      }
    }
    isOnline.then(online => this.handleChange(online));
  };

  handleChange = online => {
    const { onChange } = this.props;
    this.setState({ online });
    if (typeof onChange === "function") {
      onChange({ online });
    }
  };

  markAsOffline = () => {
    this.handleChange(false);
  };

  render() {
    const { render } = this.props;
    const renderedComponent =
      typeof render === "function" ? render(this.state) : null;
    return renderedComponent;
  }
}
