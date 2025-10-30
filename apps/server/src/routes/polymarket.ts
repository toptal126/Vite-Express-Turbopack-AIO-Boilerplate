import { Router } from "express";
import {
  searchMarkets,
  getMarketDetails,
  getMarketHistory,
} from "../controllers/polymarketController";

const router: Router = Router();

// Search markets
router.get("/search", searchMarkets);

// Get market details
router.get("/market/:marketId", getMarketDetails);

// Get market price history
router.get("/market/:marketId/history", getMarketHistory);

export default router;
