import getPlanetsController from "../api/allastrologyapis/d1chart/astrologyapiD1.js";
import getD1ChartImageController from "../api/allastrologyapis/d1chart/d1image.js";
import getD9ChartInfoController from "../api/allastrologyapis/d9chart/astrologyapiD9.js";
import getD9ChartImageController from "../api/allastrologyapis/d9chart/d9image.js";
import getD10ChartInfoController from "../api/allastrologyapis/d10chart/astrologyapid10.js";
import getD10ChartImageController from "../api/allastrologyapis/d10chart/d10image.js";
import getD4ChartInfoController from "../api/allastrologyapis/d4chart/astrologyapid4.js";
import getD4ChartImageController from "../api/allastrologyapis/d4chart/d4image.js";
import getD8ChartInfoController from "../api/allastrologyapis/d8chart/astrologyapiD8.js";
import getD8ChartImageController from "../api/allastrologyapis/d8chart/d8image.js";
import getDashaTimingsController from "../api/allastrologyapis/dashatimings/alldashatimings.js";
import getCurrentDashaController from "../api/allastrologyapis/dashatimings/currentdasha.js";
import getShadbalaController from "../api/allastrologyapis/shadbala/shadbala.js";
import getAllCharts from "../api/allastrologyapis/allcharthere/allcharthere.js";
import getGeocodeController from "../api/geocode/geocode.js";
import callingAIController from "../api/gemini/callingai.js";

import express from "express";
const router = express.Router();

router.post("/get-d1-chart", getPlanetsController);
router.post("/get-d1-chart-image", getD1ChartImageController);
router.post("/get-d9-chart", getD9ChartInfoController);
router.post("/get-d9-chart-image", getD9ChartImageController);
router.post("/get-d10-chart", getD10ChartInfoController);
router.post("/get-d10-chart-image", getD10ChartImageController);
router.post("/get-d4-chart", getD4ChartInfoController);
router.post("/get-d4-chart-image", getD4ChartImageController);
router.post("/get-d8-chart", getD8ChartInfoController);
router.post("/get-d8-chart-image", getD8ChartImageController);
router.post("/get-dasha-timings", getDashaTimingsController);
router.post("/get-current-dasha", getCurrentDashaController);
router.post("/get-shadbala", getShadbalaController);
router.post("/get-all-charts", getAllCharts);
router.post("/get-geocode", getGeocodeController);
router.get("/get-geocode", getGeocodeController);
router.post("/get-ai-response", callingAIController);

export default router;