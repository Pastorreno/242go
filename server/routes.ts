import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(httpServer: Server, app: Express) {
  // Submit assessment
  app.post("/api/assessments", (req, res) => {
    try {
      const data = insertAssessmentSchema.parse(req.body);
      const assessment = storage.createAssessment(data);
      res.json(assessment);
    } catch (e) {
      res.status(400).json({ error: "Invalid data", details: e });
    }
  });

  // Get all assessments (pastor dashboard)
  app.get("/api/assessments", (_req, res) => {
    const assessments = storage.getAssessments();
    res.json(assessments);
  });

  // Get single assessment
  app.get("/api/assessments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const assessment = storage.getAssessmentById(id);
    if (!assessment) return res.status(404).json({ error: "Not found" });
    res.json(assessment);
  });

  // Update AI profile
  app.patch("/api/assessments/:id/profile", (req, res) => {
    const id = parseInt(req.params.id);
    const { aiProfile } = z.object({ aiProfile: z.string() }).parse(req.body);
    const updated = storage.updateAiProfile(id, aiProfile);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });
}
