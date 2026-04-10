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

const getAllCharts = async (req, res) => {
    try {
        const source = Object.keys(req.body || {}).length > 0 ? req.body : req.query;

        // Fetch everything SEQUENTIALLY to avoid hitting API burst limits (Error 429)
        const d1Chart = await fetchD1Chart(source).catch(err => ({ error: err.message }));
        const d4Chart = await fetchD4Chart(source).catch(err => ({ error: err.message }));
        const d9Chart = await fetchD9Chart(source).catch(err => ({ error: err.message }));
        const d10Chart = await fetchD10Chart(source).catch(err => ({ error: err.message }));
        const d8Chart = await fetchD8Chart(source).catch(err => ({ error: err.message }));

        const d1ChartImage = await fetchD1ChartImage(source).catch(err => ({ error: err.message }));
        const d4ChartImage = await fetchD4ChartImage(source).catch(err => ({ error: err.message }));
        const d9ChartImage = await fetchD9ChartImage(source).catch(err => ({ error: err.message }));
        const d10ChartImage = await fetchD10ChartImage(source).catch(err => ({ error: err.message }));
        const d8ChartImage = await fetchD8ChartImage(source).catch(err => ({ error: err.message }));

        // Specific helper for D1 Chart to include all details
        const formatD1ChartToString = (chartTitle, chartData) => {
            const rawOutput = chartData?.output || chartData;
            if (!rawOutput || chartData.error || Object.keys(rawOutput).length === 0) return `${chartTitle}: Data Unavailable\n`;
            
            let result = `--- ${chartTitle} ---\n`;
            
            Object.entries(rawOutput).forEach(([planetName, details]) => {
                if (typeof details !== 'object') return;
                
                const detailsStr = Object.entries(details)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");
                
                result += `${planetName}: ${detailsStr}\n`;
            });
            
            return result + "\n";
        };

        // Helper function to format any other chart into a readable string
        const formatChartToString = (chartTitle, chartData) => {
            const rawOutput = chartData?.output || chartData;
            if (!rawOutput || chartData.error || Object.keys(rawOutput).length === 0) return `${chartTitle}: Data Unavailable\n`;
            
            const signName = ["NA", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
            
            let result = `--- ${chartTitle} ---\n`;
            const planets = Array.isArray(rawOutput) ? rawOutput : Object.values(rawOutput);
            
            planets.forEach(planet => {
                let sign = planet.current_sign;
                // If sign is a number (D1 format), convert to name. If string, use as is.
                if (typeof sign === 'number') {
                    sign = signName[sign] || sign;
                }
                result += `${planet.name}: Sign: ${sign}, House: ${planet.house_number}\n`;
            });
            
            return result + "\n";
        };

        // Aggregating all specific charts into one single string
        const allChartDataString = 
            formatD1ChartToString("D1 Chart (Rashi)", d1Chart) +
            formatChartToString("D4 Chart (Chaturthamsa)", d4Chart) +
            formatChartToString("D8 Chart (Ashtamsha)", d8Chart) +
            formatChartToString("D9 Chart (Navamsa)", d9Chart) +
            formatChartToString("D10 Chart (Dashamsha)", d10Chart);


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
            d8ChartImage
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