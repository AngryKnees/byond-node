###### based on [tigercat2000](https://github.com/tigercat2000)'s [http2byond](https://github.com/tigercat2000/http2byond)

# byond-node

A Node.js library for communicating with BYOND servers written in Typescript.

### Installation
`npm install byond-node`


### Example
```javascript
const ByondClient = require("byond-node").default;

const client = new ByondClient({
	address: "localhost", // default
	port: 1337
	timeout: 2000 // default
});

client.get("?status").then(console.log, console.error);
```