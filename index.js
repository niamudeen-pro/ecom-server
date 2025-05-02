require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router/index.js");
const connectDb = require("./utils/db.js");
const cron = require("node-cron");
const colors = require("colors");

connectDb();

const TIME_EXPRESSION = "0 9 * * *";
// const TIME_EXPRESSION = "* * * * * *";

const PORT = process.env.PORT || 7000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json("ecom backend server is working");
});

// cron.schedule(TIME_EXPRESSION, () => {
//   fetch("http://localhost:7000/")
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//     });
// });
// Route to fetch movies by search query
app.get('/api/movies', async (req, res) => {
  const { s } = req.query; // Movie search query
  console.log('req.query: ', req.query);

  if (!s) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const response = await fetch(`${process.env.OMDB_API_URL}?apiKey=${process.env.OMDB_API_KEY}&s=${s}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status}`);
    }
    const data = await response.json();
    if (data.Error) {
      return res.status(404).json({ error: data.Error });
    }
    res.json(data.Search || []); // Return the list of movies
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch a movie by its IMDb ID
app.get('/api/movie/:id', async (req, res) => {
  const { id } = req.params; // Movie IMDb ID
  console.log('id: ', id);

  if (!id) {
    return res.status(400).json({ error: 'Movie id is required' });
  }

  try {
    const response = await fetch(`${process.env.OMDB_API_URL}?apiKey=${process.env.OMDB_API_KEY}&i=${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch movie: ${response.status}`);
    }
    const data = await response.json();
    if (data.Error) {
      return res.status(404).json({ error: data.Error });
    }
    res.json(data); // Return movie details
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`.bgMagenta);
});

module.exports = app;
