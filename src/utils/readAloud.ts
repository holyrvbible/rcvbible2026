/**
 * Detects if a string contains Chinese characters.
 */
function isChinese(text: string): boolean {
  // Chinese character ranges: CJK Unified Ideographs
  const chineseRegex =
    /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\u{2ceb0}-\u{2ebef}]/u;
  return chineseRegex.test(text);
}

/**
 * Gets the appropriate voice for the language.
 */
function getVoiceForLanguage(
  lang: "en" | "zh",
): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();

  let voice: SpeechSynthesisVoice | undefined;

  // For some reason only one voice for Chinese doesn't sound terrible.
  if (lang === "zh") {
    voice ??= voices.find((v) => v.name === "Tingting");
  }

  if (lang === "en") {
    // Chrome.
    voice ??= voices.find((v) => v.name === "Google US English");
    // Firefox.
    voice ??= voices.find((v) => v.name === "Samantha");
  }

  // Try to find an exact match first.
  voice ??= voices.find((v) => v.lang.startsWith(lang));

  // If no exact match, try to find a voice that supports the language.
  voice ??= voices.find((v) => v.lang.includes(lang));

  console.log(`Found voice for ${lang}:`, voice);

  return voice;
}

export type TextOrAction = string | (() => void);

const currentSpeaking = {
  cancel: null as (() => void) | null,
  queue: [] as TextOrAction[],
};

function resetCurrentSpeaking() {
  currentSpeaking.cancel = null;
  currentSpeaking.queue = [];
}

function sanitizeText(s: string): string {
  // Cannot read HTML entities.
  return s
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
}

/**
 * Speaks a single string with language detection.
 */
export function speakText(text: string): Promise<void> {
  text = sanitizeText(text);

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Detect language and set appropriate voice
    const isChineseText = isChinese(text);
    const lang = isChineseText ? "zh" : "en";

    utterance.lang = isChineseText ? "zh-CN" : "en-US";

    // Get appropriate voice
    const voice = getVoiceForLanguage(lang);
    if (voice) {
      utterance.voice = voice;
    }

    // Set up event handlers
    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    // Speak the text
    speechSynthesis.speak(utterance);
  });
}

/**
 * Reads all strings in the array sequentially.
 */
export async function speakLines(
  textOrActions: TextOrAction[],
  onCancel?: () => void,
): Promise<void> {
  stopSpeaking();

  const canceled = [false];

  currentSpeaking.cancel = () => {
    canceled[0] = true;
    onCancel?.();
  };
  currentSpeaking.queue = [...textOrActions];

  try {
    // Read each line sequentially
    for (let i = 0; i < currentSpeaking.queue.length; i++) {
      const text = currentSpeaking.queue[i];

      // If given an action, execute without any delays.
      if (typeof text === "function") {
        text();
        continue;
      }

      // Skip empty strings.
      if (!text || text.trim() === "") {
        continue;
      }

      if (canceled[0]) break;

      console.log(
        `Reading line ${String(i + 1)}/${String(currentSpeaking.queue.length)}: "${text}"`,
      );

      await speakText(text);

      if (canceled[0]) break;

      // Small pause between lines.
      if (i < currentSpeaking.queue.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  } finally {
    resetCurrentSpeaking();
  }
}

export function stopSpeaking() {
  speechSynthesis.cancel();
  currentSpeaking.cancel?.();
  resetCurrentSpeaking();
}
