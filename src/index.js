import React from "react";

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
    online: window.navigator.onLine
  };

  componentDidMount() {
    const { onChange } = this.props;
    window.addEventListener("offline", this.handleChange);
    window.addEventListener("online", this.handleChange);
    if (typeof onChange === "function") {
      onChange(this.state);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("offline", this.handleChange);
    window.removeEventListener("online", this.handleChange);
  }

  handleChange = () => {
    const online = window.navigator.onLine;
    this.props.onChange({ online });
    this.setState({ online });
  };

  render() {
    const { render } = this.props;
    return typeof render === "function" ? render(this.state) : null;
  }
}
