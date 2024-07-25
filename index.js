const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const xlsx = require("xlsx");

const PORT = "8000";
const url = "https://www.theguardian.com/uk";
const json_url = "https://www.theguardian.com/";

axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    /* save in array */
    const articles = [];
    $("[class^='dcr-4z6ajs']").each(function () {
      const title = $(this).text();
      const url = $(this).find("a").attr("href");
      articles.push({
        title,
        url,
      });
    });

    console.log(articles.length);
    /* save in json  */
    fs.writeFile("articles.json", JSON.stringify(articles, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("Articles saved to articles.json");
      }
    });

    /* save in excel */
    const worksheet = xlsx.utils.json_to_sheet(articles);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Articles");

    xlsx.writeFile(workbook, "articles.xlsx");
    console.log("Articles saved to articles.xlsx");
  })
  .catch((err) => console.log(err));

const app = express();
app.listen(PORT, () => console.log("server running on " + PORT));

app.get("/", function (req, res) {
  return res.send("welcome");
});
