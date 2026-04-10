import axios from "axios";

/**
 * Logic to fetch Shadbala Summary (Planetary Strength)
 */
export const fetchShadbala = async (argumentoncall) => {
    const {
        year = 1993,
        month = 1,
        date = 22,
        hours = 13,
        minutes = 20,
        seconds = 0,
        latitude = 30.37,
        longitude = 75.86,
        timezone = 5.5,
        config = {
            "observation_point": "geocentric",
            "ayanamsha": "lahiri"
        }
    } = argumentoncall;
    const options = {
        method: 'POST',
        url: 'https://json.freeastrologyapi.com/shadbala/summary',
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
            "seconds": parseInt(seconds),
            "latitude": parseFloat(latitude),
            "longitude": parseFloat(longitude),
            "timezone": parseFloat(timezone),
            "config": config
        }
    };

    const response = await axios(options);
    return response.data;
};

/**
 * Controller to handle standalone route requests
 */
const getShadbalaController = async (req, res) => {
    try {
        const datafromreq = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        const data = await fetchShadbala(datafromreq);
        return res.status(200).json({
            success: true,
            shadbala: data
        });
    } catch (error) {
        console.error("Shadbala Error:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to fetch Shadbala summary",
            error: error.response?.data || error.message
        });
    }
};

export default getShadbalaController;
