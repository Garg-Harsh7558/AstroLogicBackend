import axios from 'axios';

/**
 * Helper to safely parse stringified responses from FreeAstrologyAPI.
 */
const parseAstroData = (apiResponse) => {
    if (!apiResponse || !apiResponse.output) return apiResponse;
    try {
        let output = apiResponse.output;
        if (typeof output === 'string') {
            if (output.startsWith('"') && output.endsWith('"')) {
                output = JSON.parse(output);
            }
            return JSON.parse(output);
        }
        return output;
    } catch (e) {
        console.error("Parse Warning: Output was not valid JSON string", e.message);
        return apiResponse.output;
    }
};

/**
 * Merged Controller for Daily Horoscope Data
 * Sequentially fetches Tithi, Hora, and Sunrise/Sunset with delays.
 */
const getHoraController = async (req, res) => {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        const now = new Date();
        let yesterdayhoraData = null;
        const settings = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            date: now.getDate(),
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds(),
            latitude: 28.651,
            longitude: 77.216,
            timezone: 5.5,
            config: {
                observation_point: "topocentric",
                ayanamsha: "lahiri"
            }
        };

        const apiHeaders = {
            'Content-Type': 'application/json',
            'x-api-key': process.env.HOROSCOPE_API
        };

        // 1. Fetch Tithi
        const tithiRes = await axios.post('https://json.freeastrologyapi.com/tithi-durations', settings, { headers: apiHeaders });
        await wait(2000);

        // 2. Fetch Hora
        const horaRes = await axios.post('https://json.freeastrologyapi.com/hora-timings', settings, { headers: apiHeaders });
        await wait(2000);
        let horaData = parseAstroData(horaRes.data);

        // Check if we are BEFORE the first hora of the day (Pre-sunrise)
        if (horaData && horaData["1"]) {
            const firstHoraStart = new Date(horaData["1"].starts_at.replace(' ', 'T'));
            if (now < firstHoraStart) {
                // Fetch for yesterday to get the current active night hora
                const yesterdaySettings = { ...settings, date: now.getDate() - 1 };
                const prevHoraRes = await axios.post('https://json.freeastrologyapi.com/hora-timings', yesterdaySettings, { headers: apiHeaders });
                yesterdayhoraData = parseAstroData(prevHoraRes.data);
                await wait(2000);
            }
        }

        // 3. Fetch Sunrise/Sunset
        const sunRes = await axios.post('https://json.freeastrologyapi.com/getsunriseandset', settings, { headers: apiHeaders });

        return res.status(200).json({
            success: true,
            timestamp: now.toISOString(),
            data: {
                tithi: parseAstroData(tithiRes.data),
                hora: horaData,
                sun: sunRes.data?.output || sunRes.data,
                yesterday: yesterdayhoraData || null
            }
        });

    } catch (error) {
        console.error("Horoscope API Error:", error.response?.data || error.message);
        return res.status(500).json({
            message: "Failed to aggregate daily horoscope data.",
            error: error.response?.data || error.message
        });
    }
};

export default getHoraController;
