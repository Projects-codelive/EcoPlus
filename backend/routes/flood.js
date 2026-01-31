import express from "express";
import axios from "axios";

const router = express.Router();

const coastalCities = [
    { name: "Mumbai", lat: 19.07, lon: 72.87 },
    { name: "Chennai", lat: 13.08, lon: 80.27 },
    { name: "Kolkata", lat: 22.57, lon: 88.36 },
    { name: "Visakhapatnam", lat: 17.68, lon: 83.22 },
    { name: "Kochi", lat: 9.97, lon: 76.28 },
];

let elevationCache = null;

async function loadElevationGrid() {
    const gridSize = 0.25;
    const latitudes = [];
    const longitudes = [];

    for (let city of coastalCities) {
        for (let i = -1; i <= 1; i++) {   // 3x3 grid only
            for (let j = -1; j <= 1; j++) {
                latitudes.push(city.lat + i * gridSize);
                longitudes.push(city.lon + j * gridSize);
            }
        }
    }

    const response = await axios.get(
        "https://api.open-meteo.com/v1/elevation",
        {
            params: {
                latitude: latitudes.join(","),
                longitude: longitudes.join(","),
            },
        }
    );

    const elevations = response.data.elevation;

    elevationCache = latitudes.map((lat, index) => ({
        lat,
        lon: longitudes[index],
        elevation: elevations[index] ?? 0,
    }));

    console.log("Elevation grid cached safely.");
}

router.get("/", async (req, res) => {
    try {
        const level = parseFloat(req.query.level);

        if (!elevationCache) {
            await loadElevationGrid();
        }

        const flooded = elevationCache
            .filter(point => point.elevation <= level)
            .map(point => [point.lat, point.lon]);

        res.json({ flooded });

    } catch (err) {
        console.error("Flood route error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;