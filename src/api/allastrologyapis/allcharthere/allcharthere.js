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


const getAllCharts = async (req, res) => {
    try {
        const source = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        const jwtdata=jwt.verify(req.cookies.token,process.env.jwt_secret);
        const {email,username,_id}=jwtdata;

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const delay = 2000; // 2000ms delay between calls

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

        // Helpers to normalize and parse data
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
        
        const d1ChartImage = d1ChartImageRes?.output || "Unavailable";
        const d4ChartImage = d4ChartImageRes?.output || "Unavailable";
        const d9ChartImage = d9ChartImageRes?.output || "Unavailable";
        const d10ChartImage = d10ChartImageRes?.output || "Unavailable";
        const d8ChartImage = d8ChartImageRes?.output || "Unavailable";

        const shadbala = parseAstroData(shadbalaRes);
        const dashatimings = parseAstroData(dashatimingsRes);

        // Specific helper for D1 Chart to include all details
        const formatD1ChartToString = (chartTitle, chartData) => {
            const rawOutput = chartData?.output || chartData;
            if (!rawOutput || chartData.error || Object.keys(rawOutput).length === 0) return `${chartTitle}: Data Unavailable\n`;
            
            let result = `--- ${chartTitle} ---\n`;
            
            for (const planetName in rawOutput) {
                const details = rawOutput[planetName];
                if (typeof details !== 'object') continue;
                
                let detailsStr = "";
                for (const key in details) {
                    detailsStr += `${key}: ${details[key]}, `;
                }
                // Remove trailing comma and space
                detailsStr = detailsStr.replace(/, $/, "");
                
                result += `${planetName}: ${detailsStr}\n`;
            }
            
            return result + "\n";
        };

        // Helper function to format any other chart into a readable string
        const formatChartToString = (chartTitle, chartData) => {
            const rawOutput = chartData?.output || chartData;
            if (!rawOutput || chartData.error || Object.keys(rawOutput).length === 0) return `${chartTitle}: Data Unavailable\n`;
            
            const signName = ["NA", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
            
            let result = `--- ${chartTitle} ---\n`;
            const planets = Array.isArray(rawOutput) ? rawOutput : Object.values(rawOutput);
            
            for (const planet of planets) {
                let sign = planet.current_sign;
                // If sign is a number (D1 format), convert to name. If string, use as is.
                if (typeof sign === 'number') {
                    sign = signName[sign] || sign;
                }
                result += `${planet.name}: Sign: ${sign}, House: ${planet.house_number}\n`;
            }
            
            return result + "\n";
        };

        // Helper function to format Shadbala
        const formatShadbalaToString = (shadbalaData) => {
            let rawOutput = shadbalaData?.output || shadbalaData;
            if (typeof rawOutput === 'string') {
                try { rawOutput = JSON.parse(rawOutput); } catch (e) { return "Shadbala: Format Error\n"; }
            }

            if (!rawOutput || shadbalaData.error || Object.keys(rawOutput).length === 0) return "Shadbala: Data Unavailable\n";

            let result = "--- Shadbala (Planetary Strength) ---\n";
            for (const planet in rawOutput) {
                const details = rawOutput[planet];
                if (typeof details !== 'object') continue;
                result += `${planet}: Strength: ${details.Shadbala}, Rupas: ${details.rupas}, Percentage: ${details.percentage_strength}%\n`;
            }
            return result + "\n";
        };

        // Helper function to format Dasha Timings
        const formatDashaTimingsToString = (dashaData) => {
            let rawOutput = dashaData?.output || dashaData;
            if (typeof rawOutput === 'string') {
                try { rawOutput = JSON.parse(rawOutput); } catch (e) { return "Dasha Timings: Format Error\n"; }
            }

            if (!rawOutput || dashaData.error || Object.keys(rawOutput).length === 0) return "Dasha Timings: Data Unavailable\n";

            let result = "--- Vimshottari Dasha Timings ---\n";
            for (const mahaDasha in rawOutput) {
                const antarDashas = rawOutput[mahaDasha];
                if (typeof antarDashas !== 'object') continue;
                result += `${mahaDasha} Maha Dasha:\n`;
                for (const antarDasha in antarDashas) {
                    const timings = antarDashas[antarDasha];
                    if (typeof timings !== 'object') continue;
                    result += `  - ${antarDasha}: ${timings.start_time} to ${timings.end_time}\n`;
                }
            }
            return result + "\n";
        };

        // Aggregating all specific charts into one single string
        const allChartDataString = 
            formatD1ChartToString("D1 Chart (Rashi)", d1Chart) +
            formatChartToString("D4 Chart (Chaturthamsa)", d4Chart) +
            formatChartToString("D8 Chart (Ashtamsha)", d8Chart) +
            formatChartToString("D9 Chart (Navamsa)", d9Chart) +
            formatChartToString("D10 Chart (Dashamsha)", d10Chart) +
            formatShadbalaToString(shadbala) +
            formatDashaTimingsToString(dashatimings);

        Chart.create({
            userId:_id,
            email,
            username,
            allchart:[{
                name:req.body.name,
                d1Chart,
                d4Chart,
                d9Chart,
                d10Chart,
                d8Chart,
                d1ChartImage,
                d4ChartImage,
                d9ChartImage,
                d10ChartImage,
                d8ChartImage,
                shadbala,
                dashatimings,
                allChartDataString
            }]
        })

        return res.status(200).json({
            success: true,
            allChartDataString,
            d1Chart,
            d4Chart,
            d9Chart,
            d10Chart,
            d8Chart,
            d1ChartImage,
            d4ChartImage,
            d9ChartImage,
            d10ChartImage,
            d8ChartImage,
            shadbala,
            dashatimings
            });
    } catch (error) {
        console.error("All Charts Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch aggregated chart data",
            error: error.message
        });
    }
};

export default getAllCharts;