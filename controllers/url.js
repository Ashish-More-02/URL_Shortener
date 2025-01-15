const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const shortId = shortid();

  const body = req.body;
  console.log(body);

  if (!body.myUrl) {
    // return res.status(400).json({ error: "Error - url is required " });

    return res.status(400).send(`
      <html>
      <head></head>
      <body style="background-color: rgb(255, 249, 237); font-family: Arial, Helvetica, sans-serif; " >
        <div style="display:flex; align-items:center; justify-content:center; height:100vh; ">  
          <h1>Error 400 - URL is required , please enter a valid URL! 😕</h1>
        <div>
      </body>
      </htm>
      `);
  }

  // creating a entry in database
  await URL.create({
    shortId: shortId,
    redirectURL: body.myUrl,
    visitHistory: [],
  });

  const allUrls = await URL.find({});

  return res.render("home", {
    id: shortId,
    urls: allUrls,
  });
  // return res.json({ id: shortId });
}

async function handleGetAnalytics(req, res) {
  // to find number of clicks on the created url 
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };
