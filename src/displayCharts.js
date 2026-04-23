import jwt from "jsonwebtoken";
import User from "./models/user.model.js";
import Chart from "./models/chart.model.js";

const displayCharts = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, process.env.jwt_secret);
        const userId = decodedToken._id;

        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
 
        const charts = await Chart.findOne({ userId: userId });
        
        if (!charts || !charts.allchart || charts.allchart.length === 0) {
            console.log("No charts found for this user.");
            return res.status(500).json({ message: "No charts found for this user." });
        }
        
        res.status(200).json({ 
            message: "Charts retrieved successfully", 
            chart: charts
        });
    } catch (error) {
        console.error("DisplayCharts Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default displayCharts;