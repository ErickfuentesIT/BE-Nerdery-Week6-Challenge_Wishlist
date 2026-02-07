import { Router } from "express";
import { WishlistService } from "../services/wishlist.service";

const router = Router();

router.get("/csvs", async (_req, res) => {
  try {
    const filePath = await WishlistService.exportToCsv();
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

export default router;
