import { useState, useEffect } from "react";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const C = {
  bg: "#07111f", surface: "#0f1e33", card: "#152540",
  gold: "#d4af37", goldLight: "#e8cc6a",
  border: "rgba(212,175,55,0.2)", goldDim: "rgba(212,175,55,0.12)",
  text: "#e8f0f8", muted: "#7a90a8",
  green: "#4caf82", yellow: "#e8b84b", red: "#e05c5c", blue: "#5b8dd9",
};

const questions = [
  {
    id: "q1",
    text: "How large is your active leadership team?",
    sub: "People who serve consistently and carry real responsibility",
    options: [
      { label: "25+ active leaders", score: 4 },
      { label: "10–24 active leaders", score: 3 },
      { label: "5–9 active leaders", score: 2 },
      { label: "1–4 active leaders", score: 1 },
    ]
  },
  {
    id: "q2",
    text: "What does your current discipleship pipeline look like?",
    sub: "How are you developing people from new believer to leader?",
    options: [
      { label: "We have a clear, documented multi-tier pipeline", score: 4 },
      { label: "We have some structure but it's not fully documented", score: 3 },
      { label: "We disciple informally — relationship-based only", score: 2 },
      { label: "We don't have an intentional discipleship process yet", score: 1 },
    ]
  },
  {
    id: "q3",
    text: "What is your biggest leadership bottleneck right now?",
    sub: "Be honest — this tells us where the system needs to start",
    options: [
      { label: "We have leaders but no pipeline to develop them further", score: 4 },
      { label: "We struggle to identify who is ready for the next level", score: 3 },
      { label: "We have potential leaders but no system to track them", score: 2 },
      { label: "We need help finding and developing leaders from scratch", score: 1 },
    ]
  },
  {
    id: "q4",
    text: "How tech-ready is your congregation for a digital portal?",
    sub: "This determines which onboarding tier fits best",
    options: [
      { label: "Most members use smartphones and are comfortable with apps", score: 4 },
      { label: "Mixed — some are comfortable, others need guidance", score: 3 },
      { label: "Most prefer face-to-face or paper-based processes", score: 2 },
      { label: "We haven't thought about digital church tools yet", score: 1 },
    ]
  },
  {
    id: "q5",
    text: "How committed is your senior pastor to a leadership development system?",
    sub: "Implementation success depends heavily on pastoral buy-in",
    options: [
      { label: "Fully committed — this is a top-3 priority for our church", score: 4 },
      { label: "Very interested — willing to invest time and resources", score: 3 },
      { label: "Open to it — needs to see more before fully committing", score: 2 },
      { label: "Still exploring — not yet convinced of the ROI", score: 1 },
    ]
  }
];

type Tier = {
  name: string;
  color: string;
  badge: string;
  description: string;
  offer: string;
  price: string;
  next: string;
};

function getResult(score: number): Tier {
  if (score >= 17) return {
    name: "Growth Partner",
    color: C.gold,
    badge: "GREEN — READY TO LAUNCH",
    description: "Your church is positioned for a fully managed 242Go Growth Hub. You have the leadership base, the pastoral vision, and the digital readiness to go live immediately.",
    offer: "Full 242Go Leadership Portal + Bishop Oversight Dashboard + National Hub Sync + Monthly AI Pastoral Report + Quarterly Pipeline Review",
    price: "$3,500 setup + $499/month",
    next: "Let's schedule your launch call this week. Your system can be live within 30 days."
  };
  if (score >= 12) return {
    name: "Church Starter",
    color: C.yellow,
    badge: "YELLOW — BUILD FOUNDATION FIRST",
    description: "Your church has real potential and good pastoral vision. We recommend starting with the Starter Package to establish your pipeline foundation before scaling.",
    offer: "242Go Member Portal + 90-Day Onboarding + Monthly AI Pastoral Report + WATER Assessment for your core team",
    price: "$2,500 setup + $149/month",
    next: "Let's map your 90-day foundation plan. We'll assess your core 10-15 leaders first and build from there."
  };
  return {
    name: "Blueprint Session",
    color: C.blue,
    badge: "BLUE — START WITH CLARITY",
    description: "Your church would benefit most from a Blueprint Strategy Session before implementing any system. Let's map your current state, your vision, and the right pathway forward.",
    offer: "2-Hour Strategy Session + Custom Pipeline Map + Leadership Health Report + 90-Day Roadmap",
    price: "$497 one-time",
    next: "Book a Blueprint Session to get your personalized roadmap. No pressure — just clarity."
  };
}

export default function ChurchHealthPage() {
  const [screen, setScreen] = useState<"intro" | "questions" | "results">("intro");
  const [name, setName] = useState("");
  const [church, setChurch] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const question = questions[current];
  const answered = Object.keys(answers).length;
  const progress = (answered / questions.length) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        setScreen("results");
      }
    }, 300);
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const result = getResult(totalScore);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "Georgia, serif",
      opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease",
    }}>

      {/* INTRO */}
      {screen === "intro" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 560, width: "100%", animation: "fade-in-up 0.6s ease", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏛️</div>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
              GGI Solutions · 242Go
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.gold, marginBottom: 8 }}>
              Church Health Score
            </div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>
              5 questions · 3 minutes · Immediate results
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 28, textAlign: "left" }}>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
                We build your church a secure member portal. Your people connect through it. Your leaders develop through it. You see everything through a simple dashboard.
                <br /><br />
                <span style={{ color: C.gold, fontWeight: 700 }}>This 5-question assessment tells us which tier of service fits your church best.</span>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <input
                data-testid="input-pastor-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (Pastor / Leader)"
                style={{
                  width: "100%", padding: "14px 16px", background: C.card,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text, fontFamily: "inherit", fontSize: 14,
                  marginBottom: 12, boxSizing: "border-box",
                }}
              />
              <input
                data-testid="input-church-name"
                value={church}
                onChange={e => setChurch(e.target.value)}
                placeholder="Church name"
                style={{
                  width: "100%", padding: "14px 16px", background: C.card,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text, fontFamily: "inherit", fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              data-testid="button-start-qualify"
              onClick={() => { if (name && church) setScreen("questions"); }}
              style={{
                width: "100%", padding: "16px",
                background: name && church ? C.gold : C.muted,
                color: C.bg, border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: 16, cursor: name && church ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}>Get My Church Health Score →</button>
            <div style={{ marginTop: 20 }}>
              <a href="/#/" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
                ← Back to Member Assessment
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      {screen === "questions" && question && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 24 }}>
          <div style={{ maxWidth: 600, width: "100%", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 28, paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: C.muted }}>Church Health Score · Q{current + 1}/{questions.length}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{Math.round(progress)}% complete</div>
              </div>
              <div style={{ height: 4, background: C.surface, borderRadius: 2 }}>
                <div style={{ width: `${progress}%`, height: "100%", background: C.gold, borderRadius: 2, transition: "width 0.3s ease" }} />
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", animation: "slide-in-right 0.3s ease" }}>
              <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                Question {current + 1}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, lineHeight: 1.5, marginBottom: 8 }}>
                {question.text}
              </div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 28, fontStyle: "italic" }}>
                {question.sub}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    data-testid={`qualify-option-${idx}`}
                    className="option-btn"
                    onClick={() => handleAnswer(opt.score)}
                    style={{
                      background: C.card, border: `1px solid ${C.border}`,
                      borderRadius: 10, padding: "16px 20px",
                      color: C.text, textAlign: "left", cursor: "pointer",
                      fontFamily: "inherit", fontSize: 14, lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: C.muted, fontSize: 11, marginRight: 8 }}>○</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {screen === "results" && (
        <div style={{ padding: 24, maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", padding: "40px 0 28px", animation: "fade-in-up 0.6s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.gold, marginBottom: 8 }}>
              {church ? `${church}'s Church Health Score` : "Your Church Health Score"}
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>Powered by 242Go · GGI Solutions</div>
          </div>

          {/* Score Card */}
          <div style={{
            background: C.card, border: `2px solid ${result.color}`,
            borderRadius: 16, padding: 28, marginBottom: 20, textAlign: "center",
            animation: "fade-in-up 0.5s ease 0.1s both",
          }}>
            <div style={{ fontSize: 12, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Recommended Package</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: result.color, lineHeight: 1, marginBottom: 8 }}>
              {totalScore}<span style={{ fontSize: 20, color: C.muted }}>/20</span>
            </div>
            <div style={{
              display: "inline-block", fontSize: 11, color: result.color,
              background: result.color + "22", padding: "4px 14px",
              borderRadius: 4, letterSpacing: 2, fontWeight: 700,
              textTransform: "uppercase", marginBottom: 16,
            }}>{result.badge}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12 }}>{result.name}</div>
            <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>{result.description}</div>
          </div>

          {/* What's Included */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: 24, marginBottom: 20,
            animation: "fade-in-up 0.5s ease 0.2s both",
          }}>
            <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
              What's Included
            </div>
            <div style={{ color: C.text, fontSize: 14, lineHeight: 1.8 }}>{result.offer}</div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: result.color }}>{result.price}</div>
            </div>
          </div>

          {/* Next Step */}
          <div style={{
            background: result.color + "15", border: `1px solid ${result.color}44`,
            borderRadius: 12, padding: 24, marginBottom: 24,
            animation: "fade-in-up 0.5s ease 0.3s both",
          }}>
            <div style={{ fontSize: 12, color: result.color, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              Your Next Step
            </div>
            <div style={{ color: C.text, fontSize: 15, lineHeight: 1.7 }}>{result.next}</div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <a
              href="https://t.me/coachreno"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-cta-telegram"
              style={{
                display: "inline-block", background: result.color, color: C.bg,
                padding: "16px 40px", borderRadius: 8, fontWeight: 700, fontSize: 16,
                textDecoration: "none", marginBottom: 16,
              }}>Book a Strategy Call →</a>
            <br />
            <a href="/#/" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
              ← Take the Member Assessment
            </a>
          </div>

          <PerplexityAttribution />
        </div>
      )}
    </div>
  );
}
