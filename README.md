# react-online

[![Build passing](https://img.shields.io/travis/TheWorm/react-online.svg?label=Travis+CI)](https://travis-ci.org/TheWorm/react-online)
[![Code coverage](https://img.shields.io/codecov/c/github/theworm/react-online.svg)](https://codecov.io/github/theworm/react-online)
[![NPM package](https://img.shields.io/npm/v/react-online.svg)](https://www.npmjs.com/package/isomorphic-is-online)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Last commit](https://img.shields.io/github/last-commit/theworm/react-online.svg)](https://github.com/TheWorm/react-online)
[![License](https://img.shields.io/github/license/theworm/react-online.svg)](https://github.com/TheWorm/react-online/blob/master/LICENSE)

A react component to declaratively check connection status. Uses [isomorphic-is-online](https://github.com/TheWorm/isomorphic-is-online) to work on Web, React Native and Node.

## Installation

On your command-line terminal:

```bash
npm install --save react-online
```

Then in your code:

```javascript
// Using ES6 modules with Babel or TypeScript
import Online from "react-online";

// Using CommonJS modules
const Online = require("react-online").default;
```

## Usage

For example, in a web environment:

```jsx
import Online from "react-online";

ReactDOM.render(
  <Online
    onChange={({ online }) => {
      if (online) {
        console.log("We can reach the internet, whoop whoop!");
      }
    }}
    render={({ online }) => (
      <div style={{ textAlign: "center" }}>
        <p>
          You can open up the devtools to simulate losing the network, or
          actually turn off your wifi to test things out.
        </p>
        <h1>{online ? "You are online." : "You are offline."}</h1>
      </div>
    )}
  />,
  DOM_NODE
);
```

Indeed, the `Online` component exposes a status object to represent connectivity so that you can act accordingly:

```javascript
{
  online: boolean;
}
```

| Prop name | type | default          | description                                                              |
| --------- | ---- | ---------------- | ------------------------------------------------------------------------ |
| onChange  | func | (status) => {}   | receives the latest status object, define some side effects              |
| render    | func | (status) => null | receives the latest status object, returns the React component to render |
