import { MapContainer, TileLayer, CircleMarker, Popup, Polygon } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { Info } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface CityData {
    name: string;
    lat: number;
    lon: number;
    value?: number;
}

const cities: CityData[] = [
    { name: "Mumbai", lat: 19.07, lon: 72.87 },
    { name: "Delhi", lat: 28.61, lon: 77.20 },
    { name: "Bangalore", lat: 12.97, lon: 77.59 },
    { name: "Kolkata", lat: 22.57, lon: 88.36 },
    { name: "Chennai", lat: 13.08, lon: 80.27 },
    { name: "Hyderabad", lat: 17.38, lon: 78.48 },
    { name: "Ahmedabad", lat: 23.02, lon: 72.57 },
    { name: "Pune", lat: 18.52, lon: 73.85 },
    { name: "Jaipur", lat: 26.91, lon: 75.79 },
    { name: "Lucknow", lat: 26.84, lon: 80.94 },
];

function getAQICategory(value: number) {
    if (value <= 50) return { label: "Good", color: "#00e400" };
    if (value <= 100) return { label: "Moderate", color: "#ffff00" };
    if (value <= 150) return { label: "Unhealthy (Sensitive)", color: "#ff7e00" };
    if (value <= 200) return { label: "Unhealthy", color: "#ff0000" };
    if (value <= 300) return { label: "Very Unhealthy", color: "#8f3f97" };
    return { label: "Hazardous", color: "#7e0023" };
}

const ClimateMapPage = () => {
    const [mode, setMode] = useState<"aqi" | "heat" | "sea">("aqi");
    const [data, setData] = useState<CityData[]>([]);
    const [indiaAverage, setIndiaAverage] = useState(0);

    const [seaLevel, setSeaLevel] = useState(0);
    const [targetSeaLevel, setTargetSeaLevel] = useState(0);
    const [floodedPoints, setFloodedPoints] = useState<[number, number][]>([]);
    const [loading, setLoading] = useState(false);

    // ================= AQI + HEAT =================
    useEffect(() => {
        async function fetchData() {
            const results: CityData[] = [];
            let total = 0;
            setLoading(true);

            try {
                for (let city of cities) {
                    if (mode === "aqi") {
                        const res = await axios.get(
                            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=pm10`
                        );

                        const pm10 = res.data.hourly?.pm10?.[0] ?? 0;
                        total += pm10;
                        results.push({ ...city, value: pm10 });
                    }

                    if (mode === "heat") {
                        const res = await axios.get(
                            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
                        );

                        const temp = res.data.current_weather?.temperature ?? 0;
                        results.push({ ...city, value: temp });
                    }
                }

                if (mode === "aqi") {
                    setIndiaAverage(Math.round(total / cities.length));
                }

                setData(results);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        if (mode === "aqi" || mode === "heat") {
            fetchData();
        }
    }, [mode]);

    // ================= SEA ANIMATION =================
    useEffect(() => {
        if (mode !== "sea") return;

        if (seaLevel < targetSeaLevel) {
            const interval = setInterval(() => {
                setSeaLevel(prev => {
                    if (prev >= targetSeaLevel) {
                        clearInterval(interval);
                        return targetSeaLevel;
                    }
                    return +(prev + 0.1).toFixed(1);
                });
            }, 60);

            return () => clearInterval(interval);
        }

        if (seaLevel > targetSeaLevel) {
            const interval = setInterval(() => {
                setSeaLevel(prev => {
                    if (prev <= targetSeaLevel) {
                        clearInterval(interval);
                        return targetSeaLevel;
                    }
                    return +(prev - 0.1).toFixed(1);
                });
            }, 60);

            return () => clearInterval(interval);
        }
    }, [targetSeaLevel, mode, seaLevel]);

    // ================= FETCH FLOOD DATA =================
    useEffect(() => {
        if (mode !== "sea") return;

        async function fetchFlood() {
            try {
                const res = await axios.get(
                    `${API_BASE}/api/flood?level=${seaLevel}`
                );

                setFloodedPoints(res.data.flooded || []);
            } catch (err) {
                console.log("Flood error:", err);
            }
        }

        fetchFlood();
    }, [seaLevel, mode]);

    return (
        <AppLayout>
            <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] p-4 space-y-4">

                {/* Controls Card */}
                <div className="lisboa-card bg-white p-4 shadow-sm z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
                            <button
                                onClick={() => setMode("aqi")}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "aqi" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                🌫 AQI
                            </button>
                            <button
                                onClick={() => setMode("heat")}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "heat" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                🌡 Heat
                            </button>
                            <button
                                onClick={() => setMode("sea")}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "sea" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                🌊 Sea Level
                            </button>
                        </div>

                        {mode === "aqi" && (
                            <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-xl">
                                <Info size={18} className="text-accent" />
                                <span className="text-sm font-medium">India Avg AQI: <strong>{indiaAverage}</strong></span>
                            </div>
                        )}
                    </div>

                    {/* Logic Specific Controls/Legend */}
                    <div className="mt-4 pt-4 border-t border-border">
                        {mode === "aqi" && (
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                {[
                                    { label: "Good", color: "#00e400" },
                                    { label: "Moderate", color: "#ffff00" },
                                    { label: "Unhealthy", color: "#ff0000" },
                                    { label: "Hazardous", color: "#7e0023" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ background: item.color }}
                                        />
                                        <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {mode === "sea" && (
                            <div className="flex flex-col items-center justify-center gap-2 w-full max-w-md mx-auto">
                                <label className="text-sm font-bold text-foreground">
                                    Sea Level Rise: <span className="text-accent text-lg">{seaLevel}m</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="1"
                                    value={targetSeaLevel}
                                    onChange={(e) => setTargetSeaLevel(Number(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                                />
                                <p className="text-xs text-muted-foreground text-center">
                                    Drag slider to simulate sea level rise on coastal cities
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 rounded-3xl overflow-hidden border border-border shadow-lg relative bg-muted">
                    {typeof window !== 'undefined' && (
                        <MapContainer
                            center={[22, 79]}
                            zoom={5}
                            style={{ height: "100%", width: "100%" }}
                            className="z-0"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* AQI + Heat Markers */}
                            {(mode === "aqi" || mode === "heat") &&
                                data.map((city, index) => {
                                    const category =
                                        mode === "aqi"
                                            ? getAQICategory(city.value || 0)
                                            : { color: "#e74c3c", label: "Temperature" };

                                    return (
                                        <CircleMarker
                                            key={index}
                                            center={[city.lat, city.lon]}
                                            radius={Math.max(8, (city.value || 0) / 10)}
                                            pathOptions={{
                                                color: category.color,
                                                fillColor: category.color,
                                                fillOpacity: 0.7,
                                                weight: 1
                                            }}
                                        >
                                            <Popup className="font-sans">
                                                <div className="text-center p-1">
                                                    <strong className="text-base text-foreground block mb-1">{city.name}</strong>
                                                    <div className="text-sm">
                                                        {mode === "aqi"
                                                            ? <><span className="font-bold">{city.value}</span> AQI<br /><span className="text-xs opacity-80">({category.label})</span></>
                                                            : <><span className="font-bold">{city.value}°C</span></>
                                                        }
                                                    </div>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    );
                                })}

                            {/* SEA POLYGON */}
                            {mode === "sea" && floodedPoints.length > 2 && (
                                <Polygon
                                    positions={floodedPoints}
                                    pathOptions={{
                                        color: "#3b82f6",
                                        fillColor: "#3b82f6",
                                        fillOpacity: 0.6,
                                        weight: 0
                                    }}
                                />
                            )}
                        </MapContainer>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default ClimateMapPage;