import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Assessment } from "@shared/schema";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const C = {
  bg: "#07111f", surface: "#0f1e33", card: "#152540",
  gold: "#d4af37", border: "rgba(212,175,55,0.2)",
  text: "#e8f0f8", muted: "#7a90a8",
  green: "#4caf82", yellow: "#e8b84b", red: "#e05c5c",
};

function RiskBadge({ level }: { level: string }) {
  const color = level === "Green" ? C.green : level === "Yellow" ? C.yellow : C.red;
  return (
    <span style={{
      fontSize: 11, color, fontWeight: 700,
      background: color + "22", padding: "3px 10px",
      borderRadius: 4, letterSpacing: 1, textTransform: "uppercase",
    }}>{level}</span>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ background: C.bg, borderRadius: 3, height: 6, overflow: "hidden", width: 80 }}>
      <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s ease" }} />
    </div>
  );
}

const tierColors: Record<number, string> = {
  5: C.gold, 4: "#c77dff", 3: C.green, 2: "#5b8dd9", 1: C.yellow, 0: C.muted,
};

export default function DashboardPage() {
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
    queryFn: () => apiRequest("GET", "/api/assessments"),
  });

  const total = assessments?.length ?? 0;
  const greens = assessments?.filter(a => a.riskLevel === "Green").length ?? 0;
  const yellows = assessments?.filter(a => a.riskLevel === "Yellow").length ?? 0;
  const reds = assessments?.filter(a => a.riskLevel === "Red").length ?? 0;
  const avgComposite = total > 0
    ? Math.round(assessments!.reduce((s, a) => s + a.compositeScore, 0) / total)
    : 0;

  const discCounts: Record<string, number> = {};
  assessments?.forEach(a => { discCounts[a.discProfile] = (discCounts[a.discProfile] ?? 0) + 1; });
  const tierCounts: Record<number, number> = {};
  assessments?.forEach(a => { tierCounts[a.tier] = (tierCounts[a.tier] ?? 0) + 1; });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "Georgia, serif", padding: 24 }}>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingTop: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              GGI Solutions · 242Go
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.gold }}>Pastoral Dashboard</div>
            <div style={{ fontSize: 13, color: C.muted }}>Jesus Generation — WATER LDP</div>
          </div>
          <a href="/#/" style={{
            background: C.gold, color: C.bg, padding: "10px 20px", borderRadius: 8,
            fontWeight: 700, fontSize: 13, textDecoration: "none",
          }}>+ New Assessment</a>
        </div>

        {/* Stats Row */}
        {!isLoading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total Members", value: total, color: C.gold },
              { label: "Promote (Green)", value: greens, color: C.green },
              { label: "Develop (Yellow)", value: yellows, color: C.yellow },
              { label: "Intervene (Red)", value: reds, color: C.red },
              { label: "Avg Score", value: `${avgComposite}%`, color: C.gold },
            ].map(({ label, value, color }, i) => (
              <div key={i} data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 20, textAlign: "center",
              }}>
                <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* DISC Breakdown */}
        {!isLoading && total > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>DISC Breakdown</div>
              {(["Driver", "Influencer", "Steadfast", "Craftsman"] as const).map(d => {
                const count = discCounts[d] ?? 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={d} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                      <span style={{ color: C.text }}>{d}</span>
                      <span style={{ color: C.muted }}>{count} · {pct}%</span>
                    </div>
                    <div style={{ background: C.bg, borderRadius: 3, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: C.gold, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Tier Distribution</div>
              {[5, 4, 3, 2, 1, 0].map(t => {
                const names = ["Seeker", "Disciple", "Servant", "Leader", "Multiplier", "Architect"];
                const count = tierCounts[t] ?? 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={t} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                      <span style={{ color: C.text }}>T{t} — {names[t]}</span>
                      <span style={{ color: C.muted }}>{count} · {pct}%</span>
                    </div>
                    <div style={{ background: C.bg, borderRadius: 3, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: tierColors[t], borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Member Table */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Member Pipeline ({total})
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Loading assessments...</div>
          ) : total === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <div style={{ color: C.gold, fontWeight: 700, marginBottom: 8 }}>No assessments yet</div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
                Share the assessment link with your members to get started.
              </div>
              <a href="/#/" style={{
                background: C.gold, color: C.bg, padding: "10px 24px",
                borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none",
              }}>Open Assessment →</a>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Name", "DISC", "Tier", "WHO", "FAT", "3T's", "3C's", "WHY", "Composite", "Status", "Date"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assessments!.map((a, i) => {
                    const composite = Math.round(a.compositeScore);
                    const riskColor = a.riskLevel === "Green" ? C.green : a.riskLevel === "Yellow" ? C.yellow : C.red;
                    return (
                      <tr key={a.id} data-testid={`row-member-${a.id}`} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.bg + "40" }}>
                        <td style={{ padding: "14px 16px", color: C.text, fontWeight: 600 }}>
                          <div>{a.name}</div>
                          <div style={{ color: C.muted, fontSize: 11 }}>{a.email}</div>
                        </td>
                        <td style={{ padding: "14px 16px", color: C.gold, fontWeight: 700 }}>{a.discProfile}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ color: tierColors[a.tier], fontWeight: 700 }}>T{a.tier}</span>
                          <span style={{ color: C.muted, fontSize: 11, marginLeft: 4 }}>{a.tierName}</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}><ScoreBar score={Math.round(a.whoScore)} color={C.blue} /></td>
                        <td style={{ padding: "14px 16px" }}><ScoreBar score={Math.round(a.whereScore)} color={C.green} /></td>
                        <td style={{ padding: "14px 16px" }}><ScoreBar score={Math.round(a.carryScore)} color={C.gold} /></td>
                        <td style={{ padding: "14px 16px" }}><ScoreBar score={Math.round(a.matureScore)} color={C.red} /></td>
                        <td style={{ padding: "14px 16px" }}><ScoreBar score={Math.round(a.whyScore)} color="#c77dff" /></td>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: riskColor }}>{composite}%</td>
                        <td style={{ padding: "14px 16px" }}><RiskBadge level={a.riskLevel} /></td>
                        <td style={{ padding: "14px 16px", color: C.muted, fontSize: 11 }}>
                          {new Date(a.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Google Sheets Setup Card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
            🔗 Connect to Google Sheets (Optional)
          </div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            To mirror assessment data to Google Sheets automatically, deploy the Apps Script backend and add your Web App URL below. This enables Looker Studio dashboards and Telegram notifications.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
            <input
              data-testid="input-sheets-url"
              placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
              style={{
                padding: "12px 16px", background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.text, fontFamily: "inherit", fontSize: 13,
              }}
            />
            <button style={{
              background: C.gold, color: C.bg, border: "none", borderRadius: 8,
              padding: "12px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>Connect</button>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: C.muted }}>
            See the Apps Script setup guide in your deployment package for step-by-step instructions.
          </div>
        </div>

        <PerplexityAttribution />
      </div>
    </div>
  );
}


