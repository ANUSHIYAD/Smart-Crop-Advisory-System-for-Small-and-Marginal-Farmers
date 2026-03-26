import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/weather", async (req, res) => {
    const { lat, lon, city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "MY_WEATHER_KEY") {
      // Return mock data if no API key
      return res.json({
        mock: true,
        temp: 28,
        humidity: 65,
        description: "Partly Cloudy",
        forecast: [
          { day: "Today", temp: 28, condition: "Cloudy" },
          { day: "Tomorrow", temp: 30, condition: "Sunny" },
          { day: "Friday", temp: 27, condition: "Rain" },
        ]
      });
    }

    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
      if (lat && lon) url += `&lat=${lat}&lon=${lon}`;
      else if (city) url += `&q=${city}`;
      else return res.status(400).json({ error: "Missing location parameters" });

      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather" });
    }
  });

  app.get("/api/market-prices", (req, res) => {
    // Mock market data
    const prices = [
      { crop: "Rice", price: 2400, unit: "Quintal", trend: "up" },
      { crop: "Wheat", price: 2100, unit: "Quintal", trend: "down" },
      { crop: "Groundnut", price: 5500, unit: "Quintal", trend: "stable" },
      { crop: "Cotton", price: 6200, unit: "Quintal", trend: "up" },
      { crop: "Tomato", price: 30, unit: "kg", trend: "down" },
    ];
    res.json(prices);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
