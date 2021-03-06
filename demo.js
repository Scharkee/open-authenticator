const express = require("express");
const config = require("./config/config.json");

const axios = require("axios");

let app = express();

const page = ` <!DOCTYPE html>
<html>
<body>

<div id="demo">
  <h2>Log in to see secret content!</h2>
  <ul>
    <li>
        <a type="button" href="/loginGoogle">Login with Google</a></button>
    </li>
    <li>
        <a type="button" href="/login">Login with Pushover</a></button>
    </li>
    <li>
        <a type="button" href="/loginAny">Login with any method</a></button>
    </li>
  </ul>
  <a href="https://github.com/Scharkee/open-authenticator/blob/master/demo.js">Click here to view the source of this demo!</p>

</div>

</body>
</html> `;

const secretPage = ` <!DOCTYPE html>
<html>
<body>
  <h2>This is secret content!</h2>
  <p> You have logged in.</p>

  <p> This is what Open Authenticator returned:</p>
  <textarea style="width:1000px; height:1000px;"> RETURNS </textarea>

</body>

</html> `;

app.get("/", (req, res) => {
  res.send(page);
});

app.get("/login", (req, res) => {
  return res.redirect(
    `${config.url}/initiate?client_id=${
      config.demoClient ?? "EXAMPLE"
    }&strategy=pushover&redirect_uri=${
      config.demoUrl || "http://localhost:3001"
    }/callback`
  );
});

app.get("/loginAny", (req, res) => {
  return res.redirect(
    `${config.url}/initiate?client_id=${
      config.demoClient ?? "EXAMPLE"
    }&redirect_uri=${config.demoUrl}/callback`
  );
});

app.get("/loginGoogle", (req, res) => {
  return res.redirect(
    `${config.url}/initiate?client_id=${
      config.demoClient ?? "EXAMPLE"
    }&strategy=google&redirect_uri=${config.demoUrl}/callback`
  );
});

app.get("/callback", async (req, res) => {
  if (!req.query.code) {
    console.log("Authenitcation failed! No code returned.");
    return;
  }

  // verifying...
  let verif = await axios.post(`${config.url}/verify`, {
    code: req.query.code,
  });

  // TODO: verify token
  return res.send(
    secretPage.replace("RETURNS", JSON.stringify(verif.data, null, 4))
  );
});
app.listen(3001);
console.log("Listening on 3001!");
