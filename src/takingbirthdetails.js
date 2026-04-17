import User from "./models/user.model.js";
import Chart from "./models/chart.model.js";
import jwt from "jsonwebtoken";
import { fetchAndProcessAllCharts } from "./api/allastrologyapis/allcharthere/allcharthere.js";

const birthdetails = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Please login first" });
        }

        const { year, month, date, hours, minutes, seconds = 0, latitude, longitude, timezone = 5.5, name } = req.body;
        
        if (!name || !year || !month || !date || !hours || !minutes || !latitude || !longitude) {
            return res.status(400).json({ success: false, message: "Please provide all the details" });
        }

        // Format: Name=YYYY,MM,DD,HH,mm,ss,timezone,lat,long
        const birthdata = `${name}=${year},${month},${date},${hours},${minutes},${seconds},${timezone},${latitude},${longitude}`;

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.jwt_secret);
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid session. Please login again." });
        }

        const { _id, email, username } = decodedToken;
        const existingUser = await User.findById(_id);
        
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if name already exists in birthdetails
        if (existingUser.birthdetails.some(item => item.split('=')[0] === name)) {
            return res.status(400).json({ success: false, message: "A profile with this name already exists in your records" });
        }

        // Save birth details to user
        existingUser.birthdetails.push(birthdata);
        await existingUser.save();

        // Trigger chart generation/update internally
        // We use the core function instead of the controller to avoid premature response.
        const allChartData = await fetchAndProcessAllCharts(req.body, _id, email, username);

        // Send final response
        res.status(201).json({
            success: true,
            name:name,
            message: "Birth details saved and charts generated successfully",
            user: existingUser,
            charts: allChartData // We can still return it if we want, or user can get it from DB later
        });
    } catch (error) {
        console.error("Birth Details Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Failed to save birth details", error: error.message });
        }
    }
};

export { birthdetails };