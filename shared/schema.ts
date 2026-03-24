import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Assessment submissions
export const assessments = sqliteTable("assessments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  churchName: text("church_name").notNull().default("Jesus Generation"),
  answers: text("answers").notNull(), // JSON string
  discProfile: text("disc_profile").notNull(),
  tier: integer("tier").notNull(),
  tierName: text("tier_name").notNull(),
  whoScore: real("who_score").notNull(),
  whereScore: real("where_score").notNull(),
  carryScore: real("carry_score").notNull(),
  matureScore: real("mature_score").notNull(),
  whyScore: real("why_score").notNull(),
  compositeScore: real("composite_score").notNull(),
  riskLevel: text("risk_level").notNull(), // Green | Yellow | Red
  aiProfile: text("ai_profile"), // Generated later
  submittedAt: text("submitted_at").notNull(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
