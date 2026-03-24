import { useState, useEffect } from "react";
import { saveAssessment, updateAiProfile, syncToSheets } from "@/lib/storage";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

// ─── Color System ────────────────────────────────────────────────────────────
const C = {
  bg: "#07111f",
  surface: "#0f1e33",
  card: "#152540",
  gold: "#d4af37",
  goldLight: "#e8cc6a",
  goldDim: "rgba(212,175,55,0.12)",
  border: "rgba(212,175,55,0.2)",
  text: "#e8f0f8",
  muted: "#7a90a8",
  green: "#4caf82",
  yellow: "#e8b84b",
  red: "#e05c5c",
  blue: "#5b8dd9",
  purple: "#c77dff",
};

// ─── Assessment Data ──────────────────────────────────────────────────────────
const sections = [
  {
    id: 1, key: "who",
    title: "Section 1 — Who Are You?",
    subtitle: "DISC Kingdom Profile",
    description: "These questions reveal how God wired you. There are no wrong answers. Be honest about how you naturally respond — not how you think you should respond.",
    scripture: "\"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.\" — Ephesians 2:10",
    color: C.blue,
    questions: [
      { id: "d1", text: "When a problem arises in your ministry or team, your first instinct is to:", options: ["Take charge and find a solution immediately", "Rally people together and encourage them", "Think it through carefully before acting", "Make sure you understand all the details before moving"] },
      { id: "d2", text: "In a group setting you are most comfortable:", options: ["Leading the direction of the conversation", "Making sure everyone feels included", "Listening and supporting where needed", "Ensuring things are done correctly"] },
      { id: "d3", text: "When God gives you a vision your first move is to:", options: ["Start building immediately", "Share it with everyone and get them excited", "Pray about it and wait for confirmation", "Create a detailed plan before taking action"] },
      { id: "d4", text: "People who know you best would describe you as:", options: ["Direct and results-driven", "Energetic and people-focused", "Loyal and dependable", "Thorough and precise"] },
      { id: "d5", text: "When someone challenges your idea you typically:", options: ["Stand firm and defend your position", "Try to find common ground and keep the peace", "Step back and consider their perspective quietly", "Ask for evidence and examine the facts"] },
      { id: "d6", text: "Your greatest strength in the body of Christ is:", options: ["Getting things done and moving the vision forward", "Inspiring and motivating others to believe", "Being a steady and reliable presence", "Bringing order, excellence and accuracy"] },
      { id: "d7", text: "When serving in ministry you are most energized by:", options: ["Leading a project or initiative", "Being around and connecting with people", "Supporting others behind the scenes", "Organizing systems and ensuring quality"] },
      { id: "d8", text: "Under pressure you tend to:", options: ["Become more decisive and push harder", "Become more talkative and seek encouragement", "Become quieter and more internal", "Become more analytical and detail focused"] },
      { id: "d9", text: "Your greatest area of growth is:", options: ["Slowing down and listening more", "Following through on details", "Stepping up and taking initiative", "Expressing yourself more openly"] },
      { id: "d10", text: "The role you naturally gravitate toward is:", options: ["The visionary who sets direction", "The connector who builds relationships", "The supporter who holds things together", "The analyst who ensures excellence"] },
    ]
  },
  {
    id: 2, key: "where",
    title: "Section 2 — Where Are You?",
    subtitle: "FAT Screen — Faithful, Available, Teachable",
    description: "This section measures your current posture toward growth and commitment. Answer based on where you actually are right now — not where you want to be.",
    scripture: "\"His master replied, 'Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things.'\" — Matthew 25:23",
    color: C.green,
    questions: [
      { id: "f1", text: "When I make a commitment to serve or show up I:", options: ["Always follow through no matter what", "Usually follow through unless something important comes up", "Sometimes struggle to follow through", "Often find reasons why I couldn't make it"] },
      { id: "f2", text: "My track record of consistency in my current ministry role over the last 90 days is:", options: ["Excellent — I have shown up faithfully", "Good — I have been consistent most of the time", "Developing — I have been inconsistent", "Concerning — I have struggled to show up"] },
      { id: "f3", text: "When my pastor or leader asks me to do something I:", options: ["Do it immediately and follow up", "Do it but sometimes need reminders", "Intend to do it but often delay", "Struggle to complete what is asked"] },
      { id: "f4", text: "My current availability for kingdom work is:", options: ["I have dedicated time set aside for ministry", "I serve when opportunities arise", "I want to serve more but haven't structured my time", "Life is too busy right now to commit fully"] },
      { id: "f5", text: "When I receive correction or feedback from a leader I:", options: ["Receive it with humility and apply it immediately", "Receive it but sometimes struggle to change", "Get defensive initially but come around", "Find it difficult to receive correction"] },
      { id: "f6", text: "My hunger for spiritual growth right now is:", options: ["Intense — I am actively pursuing growth daily", "Consistent — I am growing steadily", "Inconsistent — I grow in seasons", "Low — I am in a dry or comfortable season"] },
      { id: "f7", text: "When a leader invests time in developing me I:", options: ["Engage fully and implement what I learn", "Appreciate it and try to apply it", "Receive it but struggle to implement consistently", "Often miss or cancel development appointments"] },
      { id: "f8", text: "My attitude toward authority and spiritual covering is:", options: ["I am submitted and honoring to my leaders", "I respect authority but sometimes struggle with submission", "I have had difficulty with authority in the past", "I prefer to operate independently"] },
      { id: "f9", text: "When I am challenged to grow beyond my comfort zone I:", options: ["Embrace it as God's invitation", "Accept it cautiously but move forward", "Hesitate and need encouragement to step out", "Avoid discomfort and stay in familiar territory"] },
      { id: "f10", text: "My commitment to Jesus Generation right now is:", options: ["I am all in and building with this community", "I am committed but still finding my place", "I am connected but not fully planted", "I am still deciding if this is my home"] },
    ]
  },
  {
    id: 3, key: "carry",
    title: "Section 3 — What Do You Carry?",
    subtitle: "Three T's — Time, Talent, Treasure",
    description: "This section measures what you are actively investing into the Kingdom. Where your investment is shows where your heart is.",
    scripture: "\"For where your treasure is, there your heart will be also.\" — Matthew 6:21",
    color: C.gold,
    questions: [
      { id: "t1", text: "The amount of time I currently invest in ministry and kingdom work each week is:", options: ["10+ hours — it is a major priority", "5-10 hours — I am consistently engaged", "1-5 hours — I participate when I can", "Less than 1 hour — life is pulling me in other directions"] },
      { id: "t2", text: "When it comes to serving in my area of gifting I:", options: ["Serve consistently and look for ways to do more", "Serve regularly when asked", "Serve occasionally when convenient", "Have not yet found my place of service"] },
      { id: "t3", text: "I am currently using my primary gift to serve:", options: ["Yes — actively and consistently", "Partially — I serve but not fully in my gift area", "Rarely — I know my gifts but am not deploying them", "No — I have not yet connected my gifts to service"] },
      { id: "t4", text: "My financial giving to the Kingdom reflects:", options: ["A consistent lifestyle of generosity and tithing", "Regular giving though not always consistent", "Occasional giving when I feel moved", "This is an area I am still developing"] },
      { id: "t5", text: "When it comes to investing in my own development I:", options: ["Actively spend time, money and energy on growth", "Invest when opportunities come to me", "Want to invest more but haven't prioritized it", "Rarely invest in intentional development"] },
      { id: "t6", text: "The talents and skills I bring to the body of Christ are:", options: ["Fully deployed and being multiplied in others", "Active but only in limited areas", "Identified but not yet fully deployed", "Still being discovered"] },
      { id: "t7", text: "When the ministry needs something I don't have to be asked I:", options: ["Step up immediately and fill the gap", "Help when I notice the need", "Wait to be asked before stepping in", "Often miss needs around me"] },
      { id: "t8", text: "My stewardship of what God has given me — time, gifts, finances — is:", options: ["Intentional and increasing", "Consistent in some areas, developing in others", "Inconsistent across all three areas", "Something I know I need to work on"] },
      { id: "t9", text: "I am currently investing in someone else's development by:", options: ["Actively mentoring or discipling at least one person", "Informally pouring into people around me", "Wanting to but not yet doing it intentionally", "Not yet at a place where I feel equipped to invest in others"] },
      { id: "t10", text: "My overall kingdom investment level right now feels:", options: ["All in — I am giving everything I have", "Growing — I am increasing my investment", "Plateau — I have leveled off", "Low — I know I have more to give"] },
    ]
  },
  {
    id: 4, key: "mature",
    title: "Section 4 — How Mature Are You?",
    subtitle: "Three C's — Character, Competency, Consistency",
    description: "This is the most important section. Gifts get you noticed. Character determines how far you go. Answer with radical honesty — this is between you and God.",
    scripture: "\"But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.\" — Galatians 5:22-23",
    color: C.red,
    questions: [
      { id: "c1", text: "When no one is watching my behavior is:", options: ["The same as when people are watching", "Mostly the same with minor differences", "Sometimes different depending on the situation", "Honestly different in significant ways"] },
      { id: "c2", text: "When I make a mistake or fail I:", options: ["Own it immediately, apologize and correct course", "Eventually own it but sometimes deflect first", "Struggle to admit fault", "Find it very difficult to acknowledge when I am wrong"] },
      { id: "c3", text: "My integrity with my words — doing what I say I will do — is:", options: ["Strong — people can count on my word", "Generally reliable with occasional gaps", "Something I am working to strengthen", "An area where I know I need significant growth"] },
      { id: "c4", text: "When I am in conflict with someone in ministry I:", options: ["Go to them directly and resolve it biblically", "Address it but sometimes avoid the hard conversations", "Tend to withdraw or talk to others instead", "Struggle with conflict and often let things fester"] },
      { id: "c5", text: "My ability to execute in my area of ministry is:", options: ["Strong — I deliver excellent results consistently", "Good — I get things done though not always with excellence", "Developing — I have potential but need more training", "Early — I am just beginning to learn my area"] },
      { id: "c6", text: "When given a task or responsibility I:", options: ["Complete it with excellence and ahead of time", "Complete it adequately and on time", "Complete it but sometimes need follow up", "Struggle to complete assignments without significant support"] },
      { id: "c7", text: "My ability to lead others effectively is:", options: ["Proven — people follow me and grow under my leadership", "Emerging — I am developing my leadership capacity", "Beginning — I am learning what it means to lead", "Not yet — I am still being led and developed"] },
      { id: "c8", text: "Looking back over the last year my spiritual growth has been:", options: ["Significant and measurable", "Steady and consistent", "Inconsistent — good seasons and dry seasons", "Stagnant — I have not grown much"] },
      { id: "c9", text: "The people closest to me would say my character under pressure is:", options: ["Stable and Christ-like", "Generally good with some rough edges", "A work in progress", "Honestly needs significant development"] },
      { id: "c10", text: "My long-term fruit — the evidence of what God has done through me over time — is:", options: ["Clear and documented — lives have been changed", "Present but I could point to more", "Still developing — I am early in my journey", "Something I am believing God for"] },
    ]
  },
  {
    id: 5, key: "why",
    title: "Section 5 — Why Are You Here?",
    subtitle: "Kingdom WHY — Fan to Follower",
    description: "This is the heart of everything. Your WHY determines how far you go. This section reveals your kingdom mindset and helps identify your God-given assignment.",
    scripture: "\"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.\" — Ephesians 2:10",
    color: C.purple,
    questions: [
      { id: "w1", text: "When I think about church my primary thought is:", options: ["Where I go to worship and be fed", "A community I belong to and contribute to", "A mission base I operate from", "The body of Christ I am responsible to build"] },
      { id: "w2", text: "My understanding of the Kingdom of God is:", options: ["God's rule and reign expressed through His people everywhere", "The church and its programs and services", "Heaven — where we go when we die", "Still developing — I am learning what it means"] },
      { id: "w3", text: "I believe my primary purpose on earth is:", options: ["To know God and make Him known in every area of life", "To be a good person and help others", "To grow in my faith and support my church", "I am still discovering my purpose"] },
      { id: "w4", text: "When I encounter people outside the church I see them as:", options: ["People God has placed in my path for kingdom purpose", "People I hope will come to church someday", "People I care about personally but don't always know how to reach", "People outside my primary circle of concern"] },
      { id: "w5", text: "My knowledge and application of the Bible in daily decisions is:", options: ["Strong — Scripture shapes how I think and act daily", "Growing — I am learning to apply what I read", "Surface — I know stories but struggle with application", "Beginning — I am new to serious Bible study"] },
      { id: "w6", text: "When I think about what Jesus modeled as a leader I see:", options: ["A servant who washed feet and poured into a few", "A teacher who spoke to crowds", "A miracle worker who met needs", "A savior who died for sins"] },
      { id: "w7", text: "The difference between a fan and a follower of Jesus is:", options: ["A fan admires Jesus. A follower obeys and becomes like Him.", "A fan comes to church sometimes. A follower comes every week.", "A fan gives occasionally. A follower tithes.", "I am still working out what this means for me"] },
      { id: "w8", text: "My kingdom mindset shows up in my daily life through:", options: ["Intentional decisions that reflect kingdom values in every area", "Regular church attendance and service", "Prayer and personal devotion", "I am still learning what a kingdom lifestyle looks like"] },
      { id: "w9", text: "When I think about Acts 2:42-47 the part that most convicts me is:", options: ["The daily devotion to teaching, fellowship, prayer and breaking bread", "The radical generosity — selling possessions to meet needs", "The supernatural signs and wonders", "The fact that God added to their number daily"] },
      { id: "w10", text: "If I could describe my WHY — the reason God put me on earth — I would say:", options: ["I know my WHY clearly and I am living it out", "I have a sense of my WHY but need clarity", "I am still searching for my WHY", "I have never thought deeply about my WHY"] },
    ]
  }
];

// ─── Score Helpers ─────────────────────────────────────────────────────────────
const discMap: Record<number, string> = { 0: "Driver", 1: "Influencer", 2: "Steadfast", 3: "Craftsman" };

function getDiscProfile(answers: Record<string, number>): string {
  const counts = [0, 0, 0, 0];
  sections[0].questions.forEach(q => {
    const ans = answers[q.id];
    if (ans !== undefined) counts[ans]++;
  });
  const max = Math.max(...counts);
  return discMap[counts.indexOf(max)];
}

function getSectionScore(answers: Record<string, number>, section: typeof sections[0]): number {
  let total = 0, count = 0;
  section.questions.forEach(q => {
    const ans = answers[q.id];
    if (ans !== undefined) { total += (3 - ans); count++; }
  });
  return count > 0 ? (total / (count * 3)) * 100 : 0;
}

function getRisk(score: number) {
  if (score >= 70) return { label: "Green", color: C.green };
  if (score >= 45) return { label: "Yellow", color: C.yellow };
  return { label: "Red", color: C.red };
}

function getTier(scores: Record<string, number>) {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  if (avg >= 85) return { tier: 5, name: "Architect" };
  if (avg >= 72) return { tier: 4, name: "Multiplier" };
  if (avg >= 58) return { tier: 3, name: "Leader" };
  if (avg >= 42) return { tier: 2, name: "Servant" };
  if (avg >= 25) return { tier: 1, name: "Disciple" };
  return { tier: 0, name: "Seeker" };
}

function getMindset(score: number): string {
  if (score >= 80) return "Kingdom Architect";
  if (score >= 65) return "Kingdom Minded";
  if (score >= 50) return "Transitioning";
  if (score >= 35) return "Church Minded";
  return "Fan";
}

// ─── AI Profile Component ─────────────────────────────────────────────────────
function AIProfile({ answers, name, assessmentId }: { answers: Record<string, number>; name: string; assessmentId?: number }) {
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const scores: Record<string, number> = {};
  sections.forEach(s => { scores[s.key] = getSectionScore(answers, s); });
  const disc = getDiscProfile(answers);
  const tier = getTier(scores);
  const mindset = getMindset(scores.why);


  const generate = async () => {
    setLoading(true);
    setGenerated(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 800,
          system: `You are a kingdom purpose architect and pastoral developer for the 242Go Leadership Development Pipeline. You write personalized kingdom profiles that are prophetic, practical, and pastoral. You speak directly to the person. You combine biblical truth with practical development. You are warm but direct. You never use religious clichés. You speak like a wise mentor who sees the person's potential and their gaps with equal clarity. Always end with their kingdom WHY statement — one sentence that captures why God put them on earth.`,
          messages: [{
            role: "user",
            content: `Write a personalized 242Go Kingdom Profile for ${name || "this leader"}.

Assessment results:
- DISC Profile: ${disc}
- Current Tier: ${tier.tier} — ${tier.name}
- Kingdom Mindset: ${mindset}
- WHO Score (DISC): ${Math.round(scores.who)}%
- WHERE Score (FAT): ${Math.round(scores.where)}%
- CARRY Score (Three T's): ${Math.round(scores.carry)}%
- MATURE Score (Three C's): ${Math.round(scores.mature)}%
- WHY Score (Kingdom): ${Math.round(scores.why)}%

Write:
1. A 2-3 sentence KINGDOM IDENTITY statement that tells them who God made them to be
2. Their GREATEST STRENGTH in 1-2 sentences
3. Their GROWTH EDGE — the one thing holding them back — in 1-2 sentences
4. Their NEXT STEP — one concrete action they should take this week
5. Their KINGDOM WHY — one sentence: "God put you on earth to..."

Keep the total response under 250 words. Be prophetic but grounded. Be encouraging but honest.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Profile generation requires an API key configuration.";
      setProfile(text);
      if (assessmentId) updateAiProfile(assessmentId, text);
    } catch {
      setProfile("Profile generation is available when connected to your AI backend. Your assessment scores have been saved to the pastoral dashboard.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 22 }}>🧠</div>
        <div>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>AI Kingdom Profile</div>
          <div style={{ color: C.muted, fontSize: 12 }}>Powered by 242Go · WATER LDP</div>
        </div>
      </div>
      {!generated ? (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Generate your personalized kingdom identity profile.</div>
          <button onClick={generate} data-testid="button-generate-profile" style={{
            background: C.gold, color: C.bg, border: "none", borderRadius: 6,
            padding: "12px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          }}>Generate My Kingdom Profile</button>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "20px 0", color: C.gold, fontSize: 13 }}>
          Building your kingdom profile...
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: C.gold,
                animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: 20, color: C.text, fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap",
        }}>{profile}</div>
      )}
    </div>
  );
}

// ─── Main Assessment App ──────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [screen, setScreen] = useState<"welcome" | "section-intro" | "question" | "results">("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);
  const [assessmentId, setAssessmentId] = useState<number>();

  useEffect(() => { setMounted(true); }, []);

  const section = sections[currentSection];
  const question = section?.questions[currentQuestion];
  const totalQuestions = sections.reduce((a, s) => a + s.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const submitAssessment = (finalAnswers: Record<string, number>) => {
    const scores: Record<string, number> = {};
    sections.forEach(s => { scores[s.key] = getSectionScore(finalAnswers, s); });
    const disc = getDiscProfile(finalAnswers);
    const tier = getTier(scores);
    const composite = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    const risk = getRisk(composite);
    const record = saveAssessment({
      name, email,
      churchName: "Jesus Generation",
      discProfile: disc,
      tier: tier.tier,
      tierName: tier.name,
      whoScore: scores.who,
      whereScore: scores.where,
      carryScore: scores.carry,
      matureScore: scores.mature,
      whyScore: scores.why,
      compositeScore: composite,
      riskLevel: risk.label,
      submittedAt: new Date().toISOString(),
    });
    setAssessmentId(record.id);
    // Optional: sync to Google Sheets if URL is configured
    const sheetsUrl = (window as any).__242GO_SHEETS_URL__;
    if (sheetsUrl) syncToSheets(record, sheetsUrl);
  };

  const handleAnswer = (idx: number) => {
    const newAnswers = { ...answers, [question.id]: idx };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestion < section.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestion(0);
        setScreen("section-intro");
      } else {
        submitAssessment(newAnswers);
        setScreen("results");
      }
    }, 300);
  };

  const scores: Record<string, number> = {};
  sections.forEach(s => { scores[s.key] = getSectionScore(answers, s); });
  const disc = getDiscProfile(answers);
  const tier = getTier(scores);
  const mindset = getMindset(scores.why);

  const baseStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'Georgia', 'Times New Roman', serif",
    opacity: mounted ? 1 : 0,
    transition: "opacity 0.5s ease",
  };

  return (
    <div style={baseStyle}>
      {/* WELCOME */}
      {screen === "welcome" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 560, width: "100%", animation: "fade-in-up 0.6s ease", textAlign: "center" }}>
            {/* Logo */}
            <div style={{
              width: 80, height: 80, borderRadius: 16, margin: "0 auto 24px",
              background: `linear-gradient(135deg, ${C.gold}, #b8941f)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, fontWeight: 900, color: C.bg,
            }}>2</div>
            <div style={{ fontSize: 12, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Jesus Generation Movement</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.gold, marginBottom: 6 }}>242Go Assessment</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>WATER Leadership Development Pipeline</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 28, marginTop: 20 }}>
              <div style={{ fontSize: 13, color: C.gold, fontStyle: "italic", lineHeight: 1.7 }}>
                "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer... And the Lord added to their number daily."
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Acts 2:42, 47</div>
            </div>
            <div style={{ marginBottom: 24, textAlign: "left" }}>
              {[
                ["50 questions", "Five sections · Approx 20 minutes"],
                ["No wrong answers", "Be honest — this is between you and God"],
                ["AI-powered profile", "Your personalized kingdom identity report"],
                ["Confidential", "Shared only with your pastor"],
              ].map(([title, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ color: C.green, fontSize: 16 }}>✓</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <input
                data-testid="input-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                style={{
                  width: "100%", padding: "14px 16px", background: C.card,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text, fontFamily: "inherit", fontSize: 14,
                  marginBottom: 12, boxSizing: "border-box",
                }}
              />
              <input
                data-testid="input-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                type="email"
                style={{
                  width: "100%", padding: "14px 16px", background: C.card,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text, fontFamily: "inherit", fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              data-testid="button-begin"
              onClick={() => { if (name && email) setScreen("section-intro"); }}
              style={{
                width: "100%", padding: "16px",
                background: name && email ? C.gold : C.muted,
                color: C.bg, border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: 16, cursor: name && email ? "pointer" : "not-allowed",
                fontFamily: "inherit", letterSpacing: 0.5, transition: "all 0.2s",
              }}>Begin Assessment →</button>
            <div style={{ marginTop: 24 }}>
              <a href="/#/qualify" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
                Are you a pastor? → Take the Church Health Assessment
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SECTION INTRO */}
      {screen === "section-intro" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 560, width: "100%", animation: "fade-in-up 0.5s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                Section {section.id} of {sections.length}
              </div>
              <div style={{ height: 4, background: C.surface, borderRadius: 2, marginBottom: 20 }}>
                <div style={{ width: `${(currentSection / sections.length) * 100}%`, height: "100%", background: section.color, borderRadius: 2, transition: "width 0.5s ease" }} />
              </div>
            </div>
            <div style={{
              width: 60, height: 60, borderRadius: 12, marginBottom: 20,
              background: section.color + "22", border: `1px solid ${section.color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 900, color: section.color,
            }}>{section.id}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, marginBottom: 6 }}>{section.title}</div>
            <div style={{ fontSize: 13, color: section.color, marginBottom: 16, fontWeight: 600 }}>{section.subtitle}</div>
            <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{section.description}</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: C.gold, fontStyle: "italic", lineHeight: 1.7 }}>{section.scripture}</div>
            </div>
            <button
              data-testid={`button-begin-section-${section.id}`}
              onClick={() => setScreen("question")}
              style={{
                width: "100%", padding: "14px", background: section.color,
                color: C.bg, border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
              }}>Begin Section {section.id} →</button>
          </div>
        </div>
      )}

      {/* QUESTION */}
      {screen === "question" && question && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 24 }}>
          <div style={{ maxWidth: 600, width: "100%", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 28, paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: C.muted }}>
                  {section.title.split("—")[0].trim()} · Q{currentQuestion + 1}/{section.questions.length}
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>{Math.round(progress)}% complete</div>
              </div>
              <div style={{ height: 4, background: C.surface, borderRadius: 2 }}>
                <div style={{ width: `${progress}%`, height: "100%", background: section.color, borderRadius: 2, transition: "width 0.3s ease" }} />
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", animation: "slide-in-right 0.3s ease" }}>
              <div style={{ fontSize: 11, color: section.color, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                {section.subtitle}
              </div>
              <div style={{ fontSize: 19, fontWeight: 700, color: C.text, lineHeight: 1.5, marginBottom: 28 }}>
                {question.text}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    data-testid={`option-${idx}`}
                    className="option-btn"
                    onClick={() => handleAnswer(idx)}
                    style={{
                      background: answers[question.id] === idx ? section.color + "22" : C.card,
                      border: `1px solid ${answers[question.id] === idx ? section.color : C.border}`,
                      borderRadius: 10, padding: "16px 20px",
                      color: C.text, textAlign: "left", cursor: "pointer",
                      fontFamily: "inherit", fontSize: 14, lineHeight: 1.5,
                    }}
                  >
                    <span style={{
                      display: "inline-block", width: 22, height: 22, borderRadius: "50%",
                      border: `1px solid ${section.color}44`,
                      background: answers[question.id] === idx ? section.color : "transparent",
                      marginRight: 12, verticalAlign: "middle", flexShrink: 0,
                      fontSize: 11, textAlign: "center", lineHeight: "22px",
                      color: C.bg, fontWeight: 700,
                    }}>{answers[question.id] === idx ? "✓" : ""}</span>
                    {opt}
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
            <div style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px",
              background: `linear-gradient(135deg, ${C.gold}, #b8941f)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
            }}>✓</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.gold, marginBottom: 8 }}>
              {name ? `${name.split(" ")[0]}, your profile is ready.` : "Your profile is ready."}
            </div>
            <div style={{ color: C.muted, fontSize: 13 }}>242Go WATER LDP Assessment Complete</div>
          </div>

          {/* Tier Card */}
          <div style={{
            background: C.card, border: `2px solid ${C.gold}`,
            borderRadius: 16, padding: 28, marginBottom: 20, textAlign: "center",
            animation: "fade-in-up 0.5s ease 0.1s both",
          }}>
            <div style={{ fontSize: 12, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Current Tier</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: C.gold, lineHeight: 1 }}>{tier.tier}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>{tier.name}</div>
            <div style={{ fontSize: 13, color: C.muted }}>DISC Profile: <span style={{ color: C.gold, fontWeight: 700 }}>{disc}</span></div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Kingdom Mindset: <span style={{ color: C.gold, fontWeight: 700 }}>{mindset}</span></div>
          </div>

          {/* Section Scores */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: 24, marginBottom: 20,
            animation: "fade-in-up 0.5s ease 0.2s both",
          }}>
            <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
              Assessment Breakdown
            </div>
            {sections.map(s => {
              const score = Math.round(scores[s.key]);
              const risk = getRisk(score);
              return (
                <div key={s.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.text }}>{s.title.split("—")[1]?.trim()}</span>
                    <span style={{
                      fontSize: 11, color: risk.color, fontWeight: 700,
                      background: risk.color + "22", padding: "2px 10px",
                      borderRadius: 4, letterSpacing: 1, textTransform: "uppercase",
                    }}>{risk.label} · {score}%</span>
                  </div>
                  <div style={{ background: C.bg, borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{
                      width: `${score}%`, height: "100%",
                      background: risk.color, borderRadius: 4, transition: "width 1s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Profile */}
          <div style={{ animation: "fade-in-up 0.5s ease 0.3s both" }}>
            <AIProfile answers={answers} name={name} assessmentId={assessmentId} />
          </div>

          <div style={{
            marginTop: 24, padding: 20, background: C.card,
            border: `1px solid ${C.border}`, borderRadius: 12, textAlign: "center",
            animation: "fade-in-up 0.5s ease 0.4s both",
          }}>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>
              Your results have been recorded for pastoral review.
            </div>
            <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>
              "And the Lord added to their number daily." — Acts 2:47
            </div>
          </div>

          <div style={{ marginTop: 16, textAlign: "center", paddingBottom: 40 }}>
            <a href="/#/dashboard" style={{ color: C.muted, fontSize: 12 }}>
              Pastor Dashboard →
            </a>
          </div>
        </div>
      )}

      <PerplexityAttribution />
    </div>
  );
}
