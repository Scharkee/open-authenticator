const express = require("express");
const config = require("./config.json");

const axios = require("axios");

let app = express();

const page = ` <!DOCTYPE html>
<html>
<body>

<div id="demo">
  <h2>Log in to see secret content!</h2>
  <ul>
    <li>
        <a type="button" href="/login">Login with Pushover</a></button>
    </li>
    <li>
        <a type="button" href="/loginGoogle">Login with Google</a></button>
    </li>
    <li>
        <a type="button" href="/loginAny">Login witth any method</a></button>
    </li>
  </ul>

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
    `${config.url}:${config.port}/initiate?client_id=EXAMPLE&strategy=pushover&identity=matas&redirect_uri=http://localhost:3001/callback`
  );
});

app.get("/loginAny", (req, res) => {
  return res.redirect(
    `${config.url}:${config.port}/initiate?client_id=EXAMPLE&redirect_uri=http://localhost:3001/callback`
  );
});

app.get("/loginGoogle", (req, res) => {
  return res.redirect(
    `${config.url}:${config.port}/initiate?client_id=EXAMPLE&strategy=google&redirect_uri=http://localhost:3001/callback`
  );
});

app.get("/callback", async (req, res) => {
  if (!req.query.code) {
    console.log("Authenitcation failed! No code returned.");
    return;
  }

  // verifying...
  let verif = await axios.post(`${config.url}:${config.port}/verify`, {
    code: req.query.code,
  });

  // TODO: verify token
  return res.send(
    secretPage.replace("RETURNS", JSON.stringify(verif.data, null, 4))
  );
});
app.listen(3001);
console.log("Listening on 3001!");
