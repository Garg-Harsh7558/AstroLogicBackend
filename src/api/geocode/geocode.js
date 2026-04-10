import axios from "axios";

/**
 * Logic to fetch Geocode information
 * @param {Object} params - City, State
 */
export const fetchGeocode = async (params) => {
    const {
        city = "",
        state = ""
    } = params;

    const options = {
        method: 'GET',
        url: 'https://geocode.maps.co/search',
        params: {
            city,
            state,
            country: "India",
            api_key: process.env.geocode_api_key
        }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        console.error("Geocode API Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Controller to handle geocode search requests
 */
const getGeocodeController = async (req, res) => {
    try {
        // Handle both body (POST) and query (GET) parameters
        const params = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        
        const data = await fetchGeocode(params);
        
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to fetch geocode information",
            error: error.response?.data || error.message
        });
    }
};

export default getGeocodeController;
