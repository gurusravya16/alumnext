import { Router } from "express";
import * as settingsController from "./settings.controller.js";
import authenticateJWT from "../../middleware/auth.js";

const router = Router();

router.use(authenticateJWT);

router.get("/", settingsController.getSettings);
router.put("/", settingsController.updateSettings);
router.delete("/deactivate", settingsController.deactivateAccount);

export default router;
