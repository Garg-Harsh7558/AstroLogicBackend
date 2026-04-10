import axios from "axios";

/**
 * Logic to fetch planets data (D1 Chart)
 */
export const fetchD1Chart = async (argumentoncall) => {
    const { 
        year = 2024, 
        month = 6, 
        date = 10, 
        hours = 15, 
        minutes = 10, 
        seconds = 0, 
        latitude = 18.9333, 
        longitude = 72.8166, 
        timezone = 5.5,
        settings = {
            "observation_point": "topocentric",
            "ayanamsha": "lahiri",
            "language": "en"
        }
    } = argumentoncall;

    const options = {
        method: 'POST',
        url: 'https://json.freeastrologyapi.com/planets/extended',
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
       for(let key in data.output){
        data.output[key].current_sign=signName[data.output[key].current_sign]
                const {current_sign,normDegree,isRetro,house_number,nakshatra_name,zodiac_sign_lord,nakshatra_vimsottari_lord}=data.output[key]
                data.output[key]={'zodiacSign':current_sign,'degree':normDegree,'isRetro':isRetro,'houseNumber':house_number,'nakshatra':nakshatra_name,'zodiacSignLord':zodiac_sign_lord,'nakshatraLord':nakshatra_vimsottari_lord}


       }

    return data;
};

/**
 * Controller to handle standalone route requests
 */
const getPlanetsController = async (req, res) => {
    try {
        const datafromreq = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
        const data = await fetchD1Chart(datafromreq);
       
        
        return res.status(200).json({
            success: true,
            d1Chart: data.output
        });
    } catch (error) {
        console.error("D1 Chart Error:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to fetch extended astrology data",
            error: error.response?.data || error.message
        });
    }
};

export default getPlanetsController;