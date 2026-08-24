/**
 * 🧠 TripShot Adaptive Personal Memory & Preference Learning Engine
 * Continuously learns each user's unique facial attributes, preferred lighting, expressions,
 * framing, accessories, and historical refinement keywords to deliver hyper-personalized portraits.
 */

export interface UserPreferences {
  version: number;
  totalGenerations: number;
  totalRefinements: number;
  learningLevel: number; // 1 to 5+
  preferredLighting?: string[];
  preferredExpressions?: string[];
  preferredFraming?: string[];
  preferredAccessories?: string[];
  preferredAttire?: string[];
  learnedKeywords: Record<string, number>; // keyword -> frequency
  lastUpdated: string;
}

const STORAGE_KEY = "tripshot_user_ai_memory";

const DEFAULT_PREFERENCES: UserPreferences = {
  version: 1,
  totalGenerations: 0,
  totalRefinements: 0,
  learningLevel: 1,
  preferredLighting: [],
  preferredExpressions: [],
  preferredFraming: [],
  preferredAccessories: [],
  preferredAttire: [],
  learnedKeywords: {},
  lastUpdated: new Date().toISOString(),
};

/** Load user preferences from persistent localStorage */
export function loadUserPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
}

/** Save user preferences to persistent localStorage */
export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn("Could not save AI user preferences:", e);
  }
}

/** Record a new generation event and level up learning */
export function recordGenerationEvent(styleId: string): UserPreferences {
  const prefs = loadUserPreferences();
  prefs.totalGenerations += 1;
  prefs.lastUpdated = new Date().toISOString();

  // Calculate learning level based on cumulative usage
  const totalActivity = prefs.totalGenerations + prefs.totalRefinements * 2;
  if (totalActivity >= 15) prefs.learningLevel = 5;
  else if (totalActivity >= 8) prefs.learningLevel = 4;
  else if (totalActivity >= 4) prefs.learningLevel = 3;
  else if (totalActivity >= 2) prefs.learningLevel = 2;
  else prefs.learningLevel = 1;

  saveUserPreferences(prefs);
  return prefs;
}

/** Learn from user refinement text / prompts */
export function learnFromUserFixPrompt(rawFixText: string): UserPreferences {
  if (!rawFixText || !rawFixText.trim()) return loadUserPreferences();

  const prefs = loadUserPreferences();
  prefs.totalRefinements += 1;
  const text = rawFixText.toLowerCase().trim();

  // Helper to add unique preference item
  const addPref = (list: string[] | undefined, item: string) => {
    if (!list) list = [];
    if (!list.includes(item)) list.push(item);
    return list;
  };

  // 1. Learn Expressions (미소, 웃음, 시크, 자연스러움)
  if (text.includes("웃") || text.includes("미소") || text.includes("smile") || text.includes("happy") || text.includes("laugh")) {
    prefs.preferredExpressions = addPref(prefs.preferredExpressions, "warm cheerful natural smile with gently visible teeth");
    prefs.learnedKeywords["smile"] = (prefs.learnedKeywords["smile"] || 0) + 1;
  } else if (text.includes("시크") || text.includes("진지") || text.includes("serious") || text.includes("confident") || text.includes("chic")) {
    prefs.preferredExpressions = addPref(prefs.preferredExpressions, "confident calm charismatic gaze looking at the camera");
    prefs.learnedKeywords["chic"] = (prefs.learnedKeywords["chic"] || 0) + 1;
  }

  // 2. Learn Lighting (노을, 석양, 화사, 밝게, 자연광)
  if (text.includes("노을") || text.includes("석양") || text.includes("황금") || text.includes("sunset") || text.includes("golden hour")) {
    prefs.preferredLighting = addPref(prefs.preferredLighting, "golden hour warm sunset illumination with rich glowing amber rim lighting");
    prefs.learnedKeywords["sunset"] = (prefs.learnedKeywords["sunset"] || 0) + 1;
  } else if (text.includes("밝게") || text.includes("화사") || text.includes("bright") || text.includes("sunny") || text.includes("daylight")) {
    prefs.preferredLighting = addPref(prefs.preferredLighting, "bright clean luminous daylight with soft flattering natural highlights");
    prefs.learnedKeywords["bright"] = (prefs.learnedKeywords["bright"] || 0) + 1;
  }

  // 3. Learn Framing (전신, 상반신, 포즈)
  if (text.includes("전신") || text.includes("발") || text.includes("신발") || text.includes("다리") || text.includes("full body")) {
    prefs.preferredFraming = addPref(prefs.preferredFraming, "full-body environmental portrait showing head to toe with natural footwear");
    prefs.learnedKeywords["full_body"] = (prefs.learnedKeywords["full_body"] || 0) + 1;
  } else if (text.includes("상반신") || text.includes("가까이") || text.includes("medium shot") || text.includes("waist up")) {
    prefs.preferredFraming = addPref(prefs.preferredFraming, "medium shot waist-up composition with clear facial details");
    prefs.learnedKeywords["medium_shot"] = (prefs.learnedKeywords["medium_shot"] || 0) + 1;
  }

  // 4. Learn Accessories (선글라스, 안경, 모자, 가방)
  if (text.includes("선글라스") || text.includes("sunglasses")) {
    prefs.preferredAccessories = addPref(prefs.preferredAccessories, "stylish sunglasses");
    prefs.learnedKeywords["sunglasses"] = (prefs.learnedKeywords["sunglasses"] || 0) + 1;
  } else if (text.includes("안경") || text.includes("glasses")) {
    prefs.preferredAccessories = addPref(prefs.preferredAccessories, "stylish eyeglasses matching original facial appearance");
    prefs.learnedKeywords["glasses"] = (prefs.learnedKeywords["glasses"] || 0) + 1;
  }
  if (text.includes("모자") || text.includes("hat") || text.includes("cap")) {
    prefs.preferredAccessories = addPref(prefs.preferredAccessories, "stylish travel hat / cap");
    prefs.learnedKeywords["hat"] = (prefs.learnedKeywords["hat"] || 0) + 1;
  }

  // 5. Learn Attire (정장, 원피스, 셔츠, 아웃도어)
  if (text.includes("정장") || text.includes("수트") || text.includes("suit")) {
    prefs.preferredAttire = addPref(prefs.preferredAttire, "sharp tailored navy/dark business suit");
    prefs.learnedKeywords["suit"] = (prefs.learnedKeywords["suit"] || 0) + 1;
  } else if (text.includes("원피스") || text.includes("드레스") || text.includes("dress")) {
    prefs.preferredAttire = addPref(prefs.preferredAttire, "elegant resort dress");
    prefs.learnedKeywords["dress"] = (prefs.learnedKeywords["dress"] || 0) + 1;
  } else if (text.includes("아웃도어") || text.includes("자켓") || text.includes("jacket") || text.includes("outdoor")) {
    prefs.preferredAttire = addPref(prefs.preferredAttire, "stylish modern outdoor travel jacket");
    prefs.learnedKeywords["outdoor"] = (prefs.learnedKeywords["outdoor"] || 0) + 1;
  }

  // Calculate new learning level
  const totalActivity = prefs.totalGenerations + prefs.totalRefinements * 2;
  if (totalActivity >= 15) prefs.learningLevel = 5;
  else if (totalActivity >= 8) prefs.learningLevel = 4;
  else if (totalActivity >= 4) prefs.learningLevel = 3;
  else if (totalActivity >= 2) prefs.learningLevel = 2;
  else prefs.learningLevel = 1;

  prefs.lastUpdated = new Date().toISOString();
  saveUserPreferences(prefs);
  return prefs;
}

/** Build a personalized prompt enhancement snippet from learned memory */
export function buildPersonalizedLearningPrompt(prefs: UserPreferences): string {
  if (!prefs || (prefs.learningLevel <= 1 && (!prefs.preferredExpressions?.length && !prefs.preferredLighting?.length))) {
    return "";
  }

  const directives: string[] = [];

  if (prefs.preferredExpressions && prefs.preferredExpressions.length > 0) {
    directives.push(`EXPRESSION PREFERENCE: ${prefs.preferredExpressions.slice(-2).join(", ")}`);
  }
  if (prefs.preferredLighting && prefs.preferredLighting.length > 0) {
    directives.push(`LIGHTING PREFERENCE: ${prefs.preferredLighting.slice(-2).join(", ")}`);
  }
  if (prefs.preferredFraming && prefs.preferredFraming.length > 0) {
    directives.push(`COMPOSITION PREFERENCE: ${prefs.preferredFraming.slice(-1).join(", ")}`);
  }
  if (prefs.preferredAccessories && prefs.preferredAccessories.length > 0) {
    directives.push(`ACCESSORY SYNERGY: When appropriate, complement with ${prefs.preferredAccessories.slice(-2).join(", ")}`);
  }

  if (directives.length === 0) return "";

  return `\n🧠 USER PERSONALIZED ADAPTIVE MEMORY (Learned from User History Lv.${prefs.learningLevel}):
${directives.map((d, i) => `${i + 1}. ${d}`).join("\n")}
Apply these learned personalized aesthetic preferences seamlessly while preserving 100% authentic facial fidelity.`;
}
