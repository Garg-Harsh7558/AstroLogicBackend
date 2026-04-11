import axios from "axios";

/**
 * Logic to fetch Vimshottari Maha Dasas and Antar Dasas
 */
export const fetchDashaTimings = async (argumentoncall) => {
    const {
        year = 1994,
        month = 4,
        date = 30,
        hours = 12,
        minutes = 45,
        seconds = 0,
        latitude = 21.1904,
        longitude = 81.28491,
        timezone = 5.5,
        config = {
            "observation_point": "topocentric",
            "ayanamsha": "lahiri"
        }
    } = argumentoncall;

    const options = {
        method: 'POST',
        url: 'https://json.freeastrologyapi.com/vimsottari/maha-dasas-and-antar-dasas',
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
    console.log(response.data);
    response.data.output=JSON.parse(response.data.output);
    return response.data;
};

/**
 * Controller to handle standalone route requests
 */
const getDashaTimingsController = async (req, res) => {
    try {
        const datafromreq = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        const data = await fetchDashaTimings(datafromreq);
         

        return res.status(200).json({
            success: true, 
            dashaTimings: data.output
        });
    } catch (error) {
        console.error("Dasha Timings Error:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to fetch Vimshottari dasha timings",
            error: error.response?.data || error.message
        });
    }
};

export default getDashaTimingsController;
