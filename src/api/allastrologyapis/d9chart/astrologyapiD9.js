import axios from "axios";

/**
 * Logic to fetch Navamsa Chart Info (D9 Chart)
 */
export const fetchD9Chart = async (argumentoncall) => {
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
        settings = {
            "observation_point": "topocentric",
            "ayanamsha": "lahiri"
        }
    } = argumentoncall;

    const options = {
        method: 'POST',
        url: 'https://json.freeastrologyapi.com/navamsa-chart-info/',
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
            "settings": settings
        }
    };

    const response = await axios(options);
    const data=response.data
       const signName=["NA","Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
        const signLords = {"Aries": "Mars","Taurus": "Venus","Gemini": "Mercury","Cancer": "Moon","Leo": "Sun","Virgo": "Mercury","Libra": "Venus","Scorpio": "Mars","Sagittarius": "Jupiter","Capricorn": "Saturn","Aquarius": "Saturn","Pisces": "Jupiter"};
       for(let key in data.output){
        data.output[key].current_sign=signName[data.output[key].current_sign]
        data.output[key].zodiacSignLord=signLords[data.output[key].current_sign]
    }
    return data;
};

/**
 * Controller to handle standalone route requests
 */
const getD9ChartInfoController = async (req, res) => {
    try {
        const datafromreq = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        const data = await fetchD9Chart(datafromreq);
       
        return res.status(200).json({
            success: true,
            d9Chart: data.output
        });
    } catch (error) {
        console.error("D9 Chart Info Error:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to fetch D9 chart info",
            error: error.response?.data || error.message
        });
    }
};

export default getD9ChartInfoController;
