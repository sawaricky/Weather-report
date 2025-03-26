const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || "8888";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// Set up static path (for use with CSS, client-side JS, and image files)
app.use(express.static(path.join(__dirname, "public")));

// Route for the home page
// app.get('/', async (request, response) => {
//   response.render('index', { title: 'Home' });
// });
const countryCityPairs = [
  { country: "Canada", city: "Toronto", code: "CA" },
  { country: "India", city: "Delhi", code: "IN" },
  { country: "United States", city: "New York", code: "US" },
  { country: "Australia", city: "Sydney", code: "AU" },
  { country: "United Kingdom", city: "London", code: "GB" },
];

// fetch weather data
app.get("/", async (request, response) => {
  try {
    // Dynamic import of fetch
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));
    //making it default to toronotos weather
    const city = request.query.city || "Toronto";
    // Fetch weather data
    const weatherUrl = new URL(
      `https://api.openweathermap.org/data/2.5/weather`
    );
    weatherUrl.searchParams.append("q", city); //choose city
    weatherUrl.searchParams.append("appid", process.env.OPENWEATHER_API_KEY);
    weatherUrl.searchParams.append("units", "metric"); // makes the temperature to 27.4 unitsfrom the standard 297.23

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Failed to fetch weather: ${weatherResponse.statusText}`);
    }
    const weatherData = await weatherResponse.json();

    // Render index.pug with data
    response.render("index", {
      title: "Home",
      weather: weatherData,
      countryCityPairs,
    });
  } catch (error) {
    console.error(error);
    response.render("index", {
      error: "Error retrieving data",
      countryCityPairs,
    });
  }
});

// fetching news information
app.get("/news", async (request, response) => {
  try {
    // Dynamic import of fetch
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    // Fetch news data
    // default country to be canada
    const country = request.query.country || "ca";
    const newsUrl = new URL("https://newsapi.org/v2/top-headlines");
    newsUrl.searchParams.append("country", country);
    newsUrl.searchParams.append("apiKey", process.env.NEWSAPI_API_KEY);

    const newsResponse = await fetch(newsUrl);
    if (!newsResponse.ok) {
      throw new Error(`Failed to fetch news: ${newsResponse.statusText}`);
    }
    const newsData = await newsResponse.json();

    // Render index.pug with data
    response.render("news", {
      title: "News",
      news: newsData.articles,
      selectedCountry: country,
      countryCityPairs,
    });
  } catch (error) {
    console.error(error);
    response.render("news", {
      error: "Error retrieving data",
      countryCityPairs,
    });
  }
});

// Server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
