# P2P File Sharing - Error Log

## Error #1

### Problem

While importing simple-peer:

```text
Uncaught ReferenceError: global is not defined
```

### Cause

simple-peer depends on Node.js globals.

Vite does not provide Node.js globals in browser builds.

### Wrong Attempts

1. Added:

```js
window.global = window;
```

in main.jsx

Result:
Did not solve the problem.

2. Added:

```js
globalThis.global = globalThis;
```

in main.jsx

Result:
Did not solve the problem.

3. Installed:

```bash
npm install buffer process
```

Result:
Did not solve the problem.

### Research

Found multiple reports on:

- StackOverflow
- simple-peer GitHub issues
- Vite discussions

The issue occurs because Vite replaces Node built-ins during dependency pre-bundling.

### Final Fix

Added:

```js
// vite.config.js

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
});
```

Result:

simple-peer imported successfully.

---

## Error #2

### Problem

After fixing the global issue:

```text
TypeError: Cannot read properties of undefined (reading 'call')
```

when executing:

```js
new Peer(...)
```

### Cause

simple-peer internally requires Node modules:

- events
- util
- stream

Vite externalized these modules for browser compatibility.

### Evidence

Browser warnings:

```text
Module "events" has been externalized
Module "util" has been externalized
```

### Wrong Assumption

Initially assumed the issue was caused by:

- simple-peer version
- React
- WebRTC configuration

Actual cause:

Missing Node polyfills.

### Final Fix

Installed:

```bash
npm install vite-plugin-node-polyfills
```

Updated:

```js
// vite.config.js

import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],

  define: {
    global: {},
  },
});
```

### Result

Successfully created:

```js
const peer = new Peer(...)
```

Successfully generated:

```js
{
  type: "offer",
  sdp: "..."
}
```