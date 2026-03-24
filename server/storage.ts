import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { assessments, type Assessment, type InsertAssessment } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const sqlite = new Database("242go.db");
export const db = drizzle(sqlite);

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    church_name TEXT NOT NULL DEFAULT 'Jesus Generation',
    answers TEXT NOT NULL,
    disc_profile TEXT NOT NULL,
    tier INTEGER NOT NULL,
    tier_name TEXT NOT NULL,
    who_score REAL NOT NULL,
    where_score REAL NOT NULL,
    carry_score REAL NOT NULL,
    mature_score REAL NOT NULL,
    why_score REAL NOT NULL,
    composite_score REAL NOT NULL,
    risk_level TEXT NOT NULL,
    ai_profile TEXT,
    submitted_at TEXT NOT NULL
  )
`);

export interface IStorage {
  createAssessment(data: InsertAssessment): Assessment;
  getAssessments(): Assessment[];
  getAssessmentById(id: number): Assessment | undefined;
  updateAiProfile(id: number, aiProfile: string): Assessment | undefined;
}

export class DatabaseStorage implements IStorage {
  createAssessment(data: InsertAssessment): Assessment {
    return db.insert(assessments).values(data).returning().get();
  }

  getAssessments(): Assessment[] {
    return db.select().from(assessments).orderBy(desc(assessments.id)).all();
  }

  getAssessmentById(id: number): Assessment | undefined {
    return db.select().from(assessments).where(eq(assessments.id, id)).get();
  }

  updateAiProfile(id: number, aiProfile: string): Assessment | undefined {
    return db.update(assessments)
      .set({ aiProfile })
      .where(eq(assessments.id, id))
      .returning()
      .get();
  }
}

export const storage = new DatabaseStorage();
