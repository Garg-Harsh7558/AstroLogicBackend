import jwt from "jsonwebtoken";
import { fetchD1Chart } from "../d1chart/astrologyapiD1.js";
import { fetchD4Chart } from "../d4chart/astrologyapid4.js";
import { fetchD9Chart } from "../d9chart/astrologyapiD9.js";
import { fetchD10Chart } from "../d10chart/astrologyapid10.js";
import { fetchD8Chart } from "../d8chart/astrologyapiD8.js";
import { fetchD1ChartImage } from "../d1chart/d1image.js";
import { fetchD4ChartImage } from "../d4chart/d4image.js";
import { fetchD9ChartImage } from "../d9chart/d9image.js";
import { fetchD10ChartImage } from "../d10chart/d10image.js";
import { fetchD8ChartImage } from "../d8chart/d8image.js";
import { fetchShadbala } from "../shadbala/shadbala.js";
import { fetchDashaTimings } from "../dashatimings/alldashatimings.js";
import Chart from "../../../models/chart.model.js";

/**
 * Core function to fetch and process all charts.
 * This can be called from anywhere (routes or other controllers).
 */
const fetchAndProcessAllCharts = async (source, userId, email, username) => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = 2000;

    const d1ChartRes = await fetchD1Chart(source).catch(err => ({ error: err.message }));
    await sleep(delay);
    const d4ChartRes = await fetchD4Chart(source).catch(err => ({ error: err.message }));
    await sleep(delay);
    const d9ChartRes = await fetchD9Chart(source).catch(err => ({ error: err.message }));
    await sleep(delay);
    const d10ChartRes = await fetchD10Chart(source).catch(err => ({ error: err.message }));
    await sleep(delay);
    const d8ChartRes = await fetchD8Chart(source).catch(err => ({ error: err.message }));
    await sleep(delay);

    const d1ChartImageRes = await fetchD1ChartImage(source).catch(err => ({ output: `Error: ${err.message}` }));
    await sleep(delay);
    const d4ChartImageRes = await fetchD4ChartImage(source).catch(err => ({ output: `Error: ${err.message}` }));
    await sleep(delay);
    const d9ChartImageRes = await fetchD9ChartImage(source).catch(err => ({ output: `Error: ${err.message}` }));
    await sleep(delay);
    const d10ChartImageRes = await fetchD10ChartImage(source).catch(err => ({ output: `Error: ${err.message}` }));
    await sleep(delay);
    const d8ChartImageRes = await fetchD8ChartImage(source).catch(err => ({ output: `Error: ${err.message}` }));
    await sleep(delay);

    const shadbalaRes = await fetchShadbala(source).catch(err => ({ error: err.message }));
    await sleep(delay);
    const dashatimingsRes = await fetchDashaTimings(source).catch(err => ({ error: err.message }));

    const parseAstroData = (data) => {
        if (!data) return data;
        if (typeof data.output === 'string') {
            try { return JSON.parse(data.output); } catch (e) { return data; }
        }
        return data.output || data;
    };

    const d1Chart = parseAstroData(d1ChartRes);
    const d4Chart = parseAstroData(d4ChartRes);
    const d9Chart = parseAstroData(d9ChartRes);
    const d10Chart = parseAstroData(d10ChartRes);
    const d8Chart = parseAstroData(d8ChartRes);
    
    const d1ChartImage = d1ChartImageRes|| "Unavailable";
    const d4ChartImage = d4ChartImageRes || "Unavailable";
    const d9ChartImage = d9ChartImageRes || "Unavailable";
    const d10ChartImage = d10ChartImageRes || "Unavailable";
    const d8ChartImage = d8ChartImageRes || "Unavailable";

    const shadbala = parseAstroData(shadbalaRes);
    const dashatimings = parseAstroData(dashatimingsRes);

    // Helpers to stringify
    const formatD1ChartToString = (chartTitle, chartData) => {
        const rawOutput = chartData?.output || chartData;
        if (!rawOutput || chartData.error || Object.keys(rawOutput).length === 0) return `${chartTitle}: Data Unavailable\n`;
        let result = `--- ${chartTitle} ---\n`;
        for (const planetName in rawOutput) {
            const details = rawOutput[planetName];
            if (typeof details !== 'object') continue;
            let detailsStr = "";
            for (const key in details) detailsStr += `${key}: ${details[key]}, `;
            result += `${planetName}: ${detailsStr.replace(/, $/, "")}\n`;
        }
        return result + "\n";
    };

    const formatChartToString = (chartTitle, chartData) => {
        const rawOutput = chartData?.output || chartData;
        if (!rawOutput || chartData.error || Object.keys(rawOutput).length === 0) return `${chartTitle}: Data Unavailable\n`;
        const signNames = ["NA", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        let result = `--- ${chartTitle} ---\n`;
        const planets = Array.isArray(rawOutput) ? rawOutput : Object.values(rawOutput);
        for (const p of planets) {
            let sign = typeof p.current_sign === 'number' ? (signNames[p.current_sign] || p.current_sign) : p.current_sign;
            result += `${p.name}: Sign: ${sign}, House: ${p.house_number}\n`;
        }
        return result + "\n";
    };

    const formatShadbalaToString = (data) => {
        let raw = data?.output || data;
        if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (e) { return "Shadbala: Format Error\n"; } }
        if (!raw || data.error || Object.keys(raw).length === 0) return "Shadbala: Data Unavailable\n";
        let result = "--- Shadbala ---\n";
        for (const p in raw) {
            if (typeof raw[p] !== 'object') continue;
            result += `${p}: Strength: ${raw[p].Shadbala}, Rupas: ${raw[p].rupas}, Percentage: ${raw[p].percentage_strength}%\n`;
        }
        return result + "\n";
    };

    const formatDashaToString = (data) => {
        let raw = data?.output || data;
        if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (e) { return "Dasha: Format Error\n"; } }
        if (!raw || data.error || Object.keys(raw).length === 0) return "Dasha: Data Unavailable\n";
        let result = "--- Vimshottari Dasha ---\n";
        for (const md in raw) {
            result += `${md} Maha Dasha:\n`;
            for (const ad in raw[md]) {
                const t = raw[md][ad];
                if (typeof t === 'object') result += `  - ${ad}: ${t.start_time} to ${t.end_time}\n`;
            }
        }
        return result + "\n";
    };

    const allChartDataString = 
        formatD1ChartToString("D1 Chart (Rashi)", d1Chart) +
        formatChartToString("D4 Chart (Chaturthamsa)", d4Chart) +
        formatChartToString("D8 Chart (Ashtamsha)", d8Chart) +
        formatChartToString("D9 Chart (Navamsa)", d9Chart) +
        formatChartToString("D10 Chart (Dashamsha)", d10Chart) +
        formatShadbalaToString(shadbala) +
        formatDashaToString(dashatimings);

    // Update Database
    const existingChart = await Chart.findOne({ userId });
    const payload = {
        name: source.name,
        allChartDataString,
        d1Chart, d9Chart, d10Chart, d4Chart, d8Chart,
        shadbala, dashatimings,
        d1ChartImage, d4ChartImage, d9ChartImage, d10ChartImage, d8ChartImage
    };

    if (existingChart) {
        existingChart.allchart.push(payload);
        await existingChart.save();
    } else {
        await Chart.create({ userId, email, username, allchart: [payload] });
    }

    return {
        allChartDataString,
        d1Chart, d9Chart, d10Chart, d4Chart, d8Chart,
        shadbala, dashatimings,
        d1ChartImage, d4ChartImage, d9ChartImage, d10ChartImage, d8ChartImage
    };
};

/**
 * Route Controller for /get-all-charts
 */
const getAllCharts = async (req, res) => {
    try {
        const source = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        const jwtdata = jwt.verify(req.cookies.token, process.env.jwt_secret);
        const { email, username, _id } = jwtdata;

        const results = await fetchAndProcessAllCharts(source, _id, email, username);
        
        return res.status(200).json({ success: true, ...results });
    } catch (error) {
        console.error("All Charts Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch aggregated chart data", error: error.message });
    }
};

export { fetchAndProcessAllCharts };
export default getAllCharts;