import axios from "axios";

/**
 * Logic to fetch Current Vimshottari Dasha Information
 */
export const fetchCurrentDasha = async (argumentoncall) => {
    const now = new Date();
    
    // Extract base birth details and event_data
    const {
        year, month, date, hours, minutes, seconds,
        latitude, longitude, timezone, config = {
            "observation_point": "geocentric",
            "ayanamsha": "lahiri"
        },
        event_data = {
            "year": now.getFullYear(),
            "month": now.getMonth() + 1, // JavaScript months are 0-indexed
            "date": now.getDate(),
            "hours": now.getHours(),
            "minutes": now.getMinutes(),
            "seconds": now.getSeconds()
        }
    } = argumentoncall;

    const options = {
        method: 'POST',
        url: 'https://json.freeastrologyapi.com/vimsottari/dasa-information',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ASTRO_API_KEY
        },
        data: {
            "year": parseInt(year),
            "month": parseInt(month),
            "date": parseInt(date),
            "hours": parseInt(hours),
            "minutes": parseInt(minutes),
            "seconds": parseInt(seconds || 0),
            "latitude": parseFloat(latitude),
            "longitude": parseFloat(longitude),
            "timezone": parseFloat(timezone),
            "config": config,
            "event_data": event_data
        }
    };

    const response = await axios(options);
    return response.data;
};

/**
 * Controller to handle standalone route requests
 */
const getCurrentDashaController = async (req, res) => {
    try {
        const datafromreq = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        const data = await fetchCurrentDasha(datafromreq);
        return res.status(200).json({
            success: true,
            currentDasha: data
        });
    } catch (error) {
        console.error("Current Dasha Error:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to fetch current Vimshottari dasha info",
            error: error.response?.data || error.message
        });
    }
};

export default getCurrentDashaController;
