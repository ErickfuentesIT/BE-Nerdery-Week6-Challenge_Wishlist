import { Router } from "express";
import { WishlistService } from "../services/wishlist.service";

const router = Router();

router.get("/export-csv", (req, res) => {
  const csvData = WishlistService.exportToCsv();
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="wishlist.csv"');
  res.status(200).send(csvData);
});

export default router;
