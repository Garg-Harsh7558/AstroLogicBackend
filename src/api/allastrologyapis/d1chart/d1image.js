import axios from "axios";

/**
 * Logic to fetch Horoscope Chart Image URL (D1 Chart)
 */
export const fetchD1ChartImage = async (argumentoncall) => {
    const {
        year = 2022,
        month = 8,
        date = 11,
        hours = 6,
        minutes = 0,
        seconds = 0,
        latitude = 17.38333,
        longitude = 78.4666,
        timezone = 5.5,
        config = {
            "observation_point": "topocentric",
            "ayanamsha": "lahiri"
        }
    } = argumentoncall;

    const options = {
        method: 'POST',
        url: 'https://json.freeastrologyapi.com/horoscope-chart-url',
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
    return response.data.output;
};

/**
 * Controller to handle standalone route requests
 */
const getD1ChartImageController = async (req, res) => {
    try {
        const datafromreq = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        const chartUrl = await fetchD1ChartImage(datafromreq);
        return res.status(200).json({
            success: true,
            chartUrl
        });
    } catch (error) {
        console.error("D1 Chart URL Error:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to fetch horoscope chart image URL",
            error: error.response?.data || error.message
        });
    }
};

export default getD1ChartImageController;
