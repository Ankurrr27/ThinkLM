const TYPO_MAP: Record<string, string> = {
  hii: "hi",
  helo: "hello",
  helllo: "hello",
  hy: "hi",
  ankru: "ankur",
  ankr: "ankur",
  ankuru: "ankur",
  achievment: "achievement",
  achievments: "achievements",
  acheivement: "achievement",
  educaton: "education",
  experince: "experience",
  expereince: "experience",
  skils: "skills",
  projct: "project",
  projet: "project",
  projets: "projects",
  wrk: "work",
  porfolio: "portfolio",
  resum: "resume",
  cvv: "cv",
};

export function normalizeQuery(query: string) {
  let normalized = query.toLowerCase().trim();

  Object.entries(TYPO_MAP).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, "g");
    normalized = normalized.replace(regex, correct);
  });

  return normalized;
}

export function isGreeting(query: string) {
  const greetings = [
    "hi",
    "hello",
    "hey",
    "yo",
    "good morning",
    "good evening",
    "good afternoon",
  ];

  return greetings.includes(
    normalizeQuery(query)
  );
}