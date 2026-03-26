import * as alumniService from "./alumni.service.js";
import AppError from "../../utils/AppError.js";

export async function listAlumni(req, res, next) {
  try {
    const { branch, year } = req.query || {};

    let parsedYear;
    if (year !== undefined && year !== null && String(year).trim() !== "") {
      const n = Number(String(year));
      if (!Number.isInteger(n) || n <= 0) {
        throw new AppError("Invalid year", 400);
      }
      parsedYear = n;
    }

    const alumni = await alumniService.listApprovedAlumni({
      branch: branch ? String(branch) : undefined,
      year: parsedYear,
    });

    // Spec: Return clean data only.
    res.status(200).json(alumni);
  } catch (err) {
    next(err);
  }
}

