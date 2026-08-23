/**
 * Phonics Engine v1
 *
 * Manages:
 * - Alphabet sounds (26 letters, upper/lower case)
 * - Common phonics rules
 * - Syllable patterns
 * - Pronunciation practice data
 *
 * Target: Chinese beginner can move from letters → sounds → words
 */

// ============================================================
// Types
// ============================================================

export interface AlphabetLetter {
  letter: string;
  uppercase: string;
  lowercase: string;
  name: string;        // Letter name
  nameIPA: string;     // IPA for letter name
  sound: string;       // Primary sound
  soundIPA: string;    // IPA for primary sound
  chineseHint: string; // Chinese pronunciation hint
  example: string;     // Example word
  exampleMeaning: string; // Chinese meaning of example
}

export interface PhonicsRule {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  chineseDescription: string;
  pattern: string;      // e.g., "ee", "ea", "igh"
  sound: string;        // e.g., /iː/
  soundIPA: string;
  chineseHint: string;
  examples: PhonicsExample[];
  difficulty: number;   // 0-1
  order: number;        // Learning order
}

export interface PhonicsExample {
  word: string;
  ipa: string;
  chineseMeaning: string;
}

export interface SyllablePattern {
  id: string;
  name: string;
  chineseName: string;
  pattern: string;      // e.g., "CVC", "CV"
  description: string;
  chineseDescription: string;
  examples: PhonicsExample[];
  difficulty: number;
  order: number;
}

export interface PronunciationPractice {
  id: string;
  type: "minimal_pair" | "word_position" | "consonant_cluster" | "vowel_sound";
  description: string;
  chineseDescription: string;
  items: PracticeItem[];
}

export interface PracticeItem {
  word1: string;
  word2: string;
  difference: string;     // What's different
  chineseDifference: string;
  ipa1: string;
  ipa2: string;
}

// ============================================================
// Phonics Engine
// ============================================================

export class PhonicsEngine {
  private alphabet: AlphabetLetter[];
  private rules: PhonicsRule[];
  private syllablePatterns: SyllablePattern[];

  constructor() {
    this.alphabet = this.initAlphabet();
    this.rules = this.initPhonicsRules();
    this.syllablePatterns = this.initSyllablePatterns();
  }

  // ============================================================
  // Alphabet Operations
  // ============================================================

  /**
   * Get all alphabet letters
   */
  getAlphabet(): AlphabetLetter[] {
    return this.alphabet;
  }

  /**
   * Get a specific letter
   */
  getLetter(letter: string): AlphabetLetter | undefined {
    return this.alphabet.find(
      l => l.uppercase === letter.toUpperCase() || l.lowercase === letter.toLowerCase()
    );
  }

  /**
   * Get alphabet letters by difficulty (for learning order)
   */
  getLettersByDifficulty(maxDifficulty: number): AlphabetLetter[] {
    // Sort by difficulty (common letters first)
    return this.alphabet.filter(l => this.getLetterDifficulty(l) <= maxDifficulty);
  }

  /**
   * Get letter sounds
   */
  getLetterSounds(letter: string): string[] {
    const l = this.getLetter(letter);
    if (!l) return [];
    return [l.soundIPA];
  }

  // ============================================================
  // Phonics Rules Operations
  // ============================================================

  /**
   * Get all phonics rules
   */
  getRules(): PhonicsRule[] {
    return this.rules;
  }

  /**
   * Get phonics rules by difficulty
   */
  getRulesByDifficulty(maxDifficulty: number): PhonicsRule[] {
    return this.rules.filter(r => r.difficulty <= maxDifficulty);
  }

  /**
   * Get phonics rules by learning order
   */
  getRulesByOrder(): PhonicsRule[] {
    return [...this.rules].sort((a, b) => a.order - b.order);
  }

  /**
   * Find rules that apply to a word
   */
  findApplicableRules(word: string): PhonicsRule[] {
    const lower = word.toLowerCase();
    return this.rules.filter(rule => lower.includes(rule.pattern));
  }

  /**
   * Get rule by ID
   */
  getRuleById(id: string): PhonicsRule | undefined {
    return this.rules.find(r => r.id === id);
  }

  // ============================================================
  // Syllable Pattern Operations
  // ============================================================

  /**
   * Get all syllable patterns
   */
  getSyllablePatterns(): SyllablePattern[] {
    return this.syllablePatterns;
  }

  /**
   * Get syllable patterns by difficulty
   */
  getSyllablePatternsByDifficulty(maxDifficulty: number): SyllablePattern[] {
    return this.syllablePatterns.filter(p => p.difficulty <= maxDifficulty);
  }

  /**
   * Analyze a word's syllable structure
   */
  analyzeWordSyllables(word: string): {
    syllables: string[];
    pattern: string;
    stress: number[];
  } {
    const lower = word.toLowerCase();
    const syllables: string[] = [];
    const stress: number[] = [];

    // Simple syllable splitting (for demonstration)
    // In production, use a proper syllable parser
    let current = "";
    const vowels = "aeiou";

    for (let i = 0; i < lower.length; i++) {
      const char = lower[i];
      current += char;

      if (vowels.includes(char) && i < lower.length - 1) {
        const nextChar = lower[i + 1];
        if (vowels.includes(nextChar)) {
          // Keep current vowel with next
          continue;
        }
        syllables.push(current);
        stress.push(syllables.length === 1 ? 1 : 0); // Primary stress on first syllable
        current = "";
      }
    }

    if (current) {
      syllables.push(current);
      stress.push(0);
    }

    // Determine pattern
    let pattern = "";
    for (const syllable of syllables) {
      const hasVowel = /[aeiou]/.test(syllable);
      const startsWithConsonant = /^[^aeiou]/.test(syllable);
      const endsWithConsonant = /[^aeiou]$/.test(syllable);

      if (startsWithConsonant && hasVowel && endsWithConsonant) {
        pattern += "CVC ";
      } else if (startsWithConsonant && hasVowel) {
        pattern += "CV ";
      } else if (hasVowel && endsWithConsonant) {
        pattern += "VC ";
      } else if (hasVowel) {
        pattern += "V ";
      } else {
        pattern += "C ";
      }
    }

    return {
      syllables,
      pattern: pattern.trim(),
      stress,
    };
  }

  // ============================================================
  // Pronunciation Practice
  // ============================================================

  /**
   * Get pronunciation practice exercises
   */
  getPronunciationExercises(): PronunciationPractice[] {
    return [
      {
        id: "minimal_pairs_vowels",
        type: "minimal_pair",
        description: "Practice distinguishing similar vowel sounds",
        chineseDescription: "练习区分相似的元音",
        items: [
          {
            word1: "sheep",
            word2: "ship",
            difference: "long /iː/ vs short /ɪ/",
            chineseDifference: "长元音 vs 短元音",
            ipa1: "/ʃiːp/",
            ipa2: "/ʃɪp/",
          },
          {
            word1: "beat",
            word2: "bit",
            difference: "long /iː/ vs short /ɪ/",
            chineseDifference: "长元音 vs 短元音",
            ipa1: "/biːt/",
            ipa2: "/bɪt/",
          },
          {
            word1: "bed",
            word2: "bad",
            difference: "/ɛ/ vs /æ/",
            chineseDifference: "短元音 /ɛ/ vs /æ/",
            ipa1: "/bɛd/",
            ipa2: "/bæd/",
          },
          {
            word1: "cap",
            word2: "cup",
            difference: "/æ/ vs /ʌ/",
            chineseDifference: "短元音 /æ/ vs /ʌ/",
            ipa1: "/kæp/",
            ipa2: "/kʌp/",
          },
          {
            word1: "hot",
            word2: "hat",
            difference: "/ɒ/ vs /æ/",
            chineseDifference: "短元音 /ɒ/ vs /æ/",
            ipa1: "/hɒt/",
            ipa2: "/hæt/",
          },
        ],
      },
      {
        id: "minimal_pairs_consonants",
        type: "minimal_pair",
        description: "Practice distinguishing similar consonant sounds",
        chineseDescription: "练习区分相似的辅音",
        items: [
          {
            word1: "think",
            word2: "sink",
            difference: "/θ/ vs /s/",
            chineseDifference: "齿间音 vs 齿龈音",
            ipa1: "/θɪŋk/",
            ipa2: "/sɪŋk/",
          },
          {
            word1: "three",
            word2: "free",
            difference: "/θ/ vs /f/",
            chineseDifference: "齿间音 vs 唇齿音",
            ipa1: "/θriː/",
            ipa2: "/friː/",
          },
          {
            word1: "very",
            word2: "wery",
            difference: "/v/ vs /w/",
            chineseDifference: "唇齿摩擦 vs 唇圆",
            ipa1: "/ˈvɛri/",
            ipa2: "/ˈwɛri/",
          },
          {
            word1: "light",
            word2: "right",
            difference: "/l/ vs /r/",
            chineseDifference: "舌侧音 vs 卷舌音",
            ipa1: "/laɪt/",
            ipa2: "/raɪt/",
          },
          {
            word1: "think",
            word2: "sink",
            difference: "/θ/ vs /s/",
            chineseDifference: "齿间音 vs 齿龈音",
            ipa1: "/θɪŋk/",
            ipa2: "/sɪŋk/",
          },
        ],
      },
      {
        id: "vowel_sounds",
        type: "vowel_sound",
        description: "Practice English vowel sounds",
        chineseDescription: "练习英语元音",
        items: [
          {
            word1: "cat",
            word2: "car",
            difference: "/æ/ vs /ɑː/",
            chineseDifference: "短元音 vs 长元音",
            ipa1: "/kæt/",
            ipa2: "/kɑːr/",
          },
          {
            word1: "bed",
            word2: "bird",
            difference: "/ɛ/ vs /ɜːr/",
            chineseDifference: "短元音 vs 卷舌长元音",
            ipa1: "/bɛd/",
            ipa2: "/bɜːrd/",
          },
          {
            word1: "bit",
            word2: "beat",
            difference: "/ɪ/ vs /iː/",
            chineseDifference: "短元音 vs 长元音",
            ipa1: "/bɪt/",
            ipa2: "/biːt/",
          },
          {
            word1: "bus",
            word2: "boss",
            difference: "/ʌ/ vs /ɒ/",
            chineseDifference: "短元音 /ʌ/ vs /ɒ/",
            ipa1: "/bʌs/",
            ipa2: "/bɒs/",
          },
          {
            word1: "cut",
            word2: "coat",
            difference: "/ʌ/ vs /oʊ/",
            chineseDifference: "短元音 vs 双元音",
            ipa1: "/kʌt/",
            ipa2: "/koʊt/",
          },
        ],
      },
    ];
  }

  /**
   * Get Chinese-specific pronunciation challenges
   */
  getChineseChallenges(): {
    description: string;
    chineseDescription: string;
    challenges: {
      sound: string;
      ipa: string;
      chineseHint: string;
      tips: string[];
      practice: string[];
    }[];
  } {
    return {
      description: "Common pronunciation challenges for Chinese speakers",
      chineseDescription: "中文母语者常见的发音难点",
      challenges: [
        {
          sound: "/θ/",
          ipa: "/θ/",
          chineseHint: "类似\"斯\"但舌尖要放在上下齿之间",
          tips: [
            "舌尖轻触上齿",
            "气流从舌齿间挤出",
            "不要发成/s/或/f/",
          ],
          practice: ["think", "three", "thank", "bath", "tooth"],
        },
        {
          sound: "/ð/",
          ipa: "/ð/",
          chineseHint: "类似\"泽\"但舌尖要放在上下齿之间",
          tips: [
            "舌尖轻触上齿",
            "声带振动",
            "不要发成/d/",
          ],
          practice: ["this", "that", "the", "mother", "father"],
        },
        {
          sound: "/v/",
          ipa: "/v/",
          chineseHint: "上齿轻咬下唇，声带振动",
          tips: [
            "上齿轻触下唇",
            "声带振动",
            "不要发成/w/",
          ],
          practice: ["very", "have", "love", "drive", "give"],
        },
        {
          sound: "/r/",
          ipa: "/r/",
          chineseHint: "舌尖卷起，不接触上颚",
          tips: [
            "舌尖向后卷起",
            "不接触上颚",
            "嘴唇略微圆起",
          ],
          practice: ["red", "run", "right", "try", "free"],
        },
        {
          sound: "/l/",
          ipa: "/l/",
          chineseHint: "舌尖接触上齿龈",
          tips: [
            "舌尖接触上齿龈",
            "气流从舌两侧通过",
            "不要发成/n/",
          ],
          practice: ["light", "love", "like", "long", "girl"],
        },
        {
          sound: "/ɪ/",
          ipa: "/ɪ/",
          chineseHint: "短促的\"衣\"音",
          tips: [
            "嘴巴微开",
            "舌位比/iː/低",
            "发音短促",
          ],
          practice: ["sit", "big", "is", "this", "give"],
        },
        {
          sound: "/æ/",
          ipa: "/æ/",
          chineseHint: "介于\"啊\"和\"诶\"之间",
          tips: [
            "嘴巴张开较大",
            "嘴角向两边拉",
            "舌位较低",
          ],
          practice: ["cat", "bad", "hat", "man", "and"],
        },
        {
          sound: "/ʌ/",
          ipa: "/ʌ/",
          chineseHint: "类似短促的\"阿\"",
          tips: [
            "嘴巴半开",
            "舌位居中",
            "发音短促",
          ],
          practice: ["cup", "bus", "but", "run", "fun"],
        },
      ],
    };
  }

  // ============================================================
  // Learning Path
  // ============================================================

  /**
   * Get the recommended learning path for phonics
   */
  getLearningPath(): {
    stage: string;
    chineseStage: string;
    description: string;
    chineseDescription: string;
    items: string[];
  }[] {
    return [
      {
        stage: "Stage 1: Letter Names",
        chineseStage: "阶段一：字母名称",
        description: "Learn the names of all 26 letters",
        chineseDescription: "学习26个字母的名称",
        items: this.alphabet.map(l => l.uppercase),
      },
      {
        stage: "Stage 2: Short Vowels",
        chineseStage: "阶段二：短元音",
        description: "Master the 5 short vowel sounds",
        chineseDescription: "掌握5个短元音",
        items: ["a", "e", "i", "o", "u"].map(v => `/short ${v}/`),
      },
      {
        stage: "Stage 3: Consonants",
        chineseStage: "阶段三：辅音",
        description: "Learn common consonant sounds",
        chineseDescription: "学习常见辅音",
        items: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "y", "z"],
      },
      {
        stage: "Stage 4: Long Vowels",
        chineseStage: "阶段四：长元音",
        description: "Master long vowel sounds",
        chineseDescription: "掌握长元音",
        items: ["a_e", "e_e", "i_e", "o_e", "u_e"],
      },
      {
        stage: "Stage 5: Common Patterns",
        chineseStage: "阶段五：常见组合",
        description: "Learn common letter combinations",
        chineseDescription: "学习常见字母组合",
        items: ["ee", "ea", "ai", "ay", "oa", "ow", "ou", "oi"],
      },
      {
        stage: "Stage 6: Blends",
        chineseStage: "阶段六：辅音连缀",
        description: "Master consonant blends",
        chineseDescription: "掌握辅音连缀",
        items: ["bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "sl", "sm", "sn", "sp", "st", "sw", "tr"],
      },
      {
        stage: "Stage 7: Digraphs",
        chineseStage: "阶段七：双字母组合",
        description: "Learn consonant digraphs",
        chineseDescription: "学习双字母组合",
        items: ["ch", "sh", "th", "wh", "ph", "ng", "ck"],
      },
    ];
  }

  // ============================================================
  // Private Methods
  // ============================================================

  private getLetterDifficulty(letter: AlphabetLetter): number {
    // Common letters first
    const common = "EAOITNSRHLD";
    const index = common.indexOf(letter.uppercase);
    return index >= 0 ? index / common.length : 0.5 + Math.random() * 0.5;
  }

  private initAlphabet(): AlphabetLetter[] {
    const letters: [string, string, string, string, string, string, string][] = [
      ["A", "a", "ey", "/eɪ/", "诶", "apple", "苹果"],
      ["B", "b", "bee", "/biː/", "比", "banana", "香蕉"],
      ["C", "c", "see", "/siː/", "西", "cat", "猫"],
      ["D", "d", "dee", "/diː/", "迪", "dog", "狗"],
      ["E", "e", "ee", "/iː/", "伊", "egg", "鸡蛋"],
      ["F", "f", "ef", "/ɛf/", "艾夫", "fish", "鱼"],
      ["G", "g", "gee", "/dʒiː/", "吉", "go", "去"],
      ["H", "h", "aitch", "/eɪtʃ/", "诶吃", "hat", "帽子"],
      ["I", "i", "eye", "/aɪ/", "爱", "ice", "冰"],
      ["J", "j", "jay", "/dʒeɪ/", "杰", "juice", "果汁"],
      ["K", "k", "kay", "/keɪ/", "克诶", "key", "钥匙"],
      ["L", "l", "el", "/ɛl/", "艾欧", "love", "爱"],
      ["M", "m", "em", "/ɛm/", "艾姆", "milk", "牛奶"],
      ["N", "n", "en", "/ɛn/", "艾恩", "no", "不"],
      ["O", "o", "oh", "/oʊ/", "哦", "orange", "橙子"],
      ["P", "p", "pee", "/piː/", "匹", "pen", "笔"],
      ["Q", "q", "cue", "/kjuː/", "克优", "queen", "女王"],
      ["R", "r", "ar", "/ɑːr/", "阿", "rice", "米饭"],
      ["S", "s", "ess", "/ɛs/", "艾斯", "sun", "太阳"],
      ["T", "t", "tee", "/tiː/", "提", "tree", "树"],
      ["U", "u", "you", "/juː/", "优", "umbrella", "雨伞"],
      ["V", "v", "vee", "/viː/", "维", "vegetable", "蔬菜"],
      ["W", "w", "double-u", "/ˈdʌbəljuː/", "达不溜", "water", "水"],
      ["X", "x", "ex", "/ɛks/", "艾克斯", "box", "盒子"],
      ["Y", "y", "why", "/waɪ/", "歪", "yellow", "黄色"],
      ["Z", "z", "zee", "/ziː/", "滋", "zoo", "动物园"],
    ];

    return letters.map(([letter, lower, name, ipa, chinese, example, meaning]) => ({
      letter,
      uppercase: letter,
      lowercase: lower,
      name,
      nameIPA: ipa,
      sound: letter,
      soundIPA: ipa,
      chineseHint: chinese,
      example,
      exampleMeaning: meaning,
    }));
  }

  private initPhonicsRules(): PhonicsRule[] {
    return [
      {
        id: "short_a",
        name: "Short A",
        chineseName: "短元音A",
        description: "The short /æ/ sound as in 'cat'",
        chineseDescription: "短元音/æ/，如cat中的a",
        pattern: "a",
        sound: "æ",
        soundIPA: "/æ/",
        chineseHint: "介于\"啊\"和\"诶\"之间",
        examples: [
          { word: "cat", ipa: "/kæt/", chineseMeaning: "猫" },
          { word: "hat", ipa: "/hæt/", chineseMeaning: "帽子" },
          { word: "bat", ipa: "/bæt/", chineseMeaning: "蝙蝠" },
          { word: "mat", ipa: "/mæt/", chineseMeaning: "垫子" },
        ],
        difficulty: 0.2,
        order: 1,
      },
      {
        id: "short_e",
        name: "Short E",
        chineseName: "短元音E",
        description: "The short /ɛ/ sound as in 'bed'",
        chineseDescription: "短元音/ɛ/，如bed中的e",
        pattern: "e",
        sound: "ɛ",
        soundIPA: "/ɛ/",
        chineseHint: "类似\"诶\"但更短",
        examples: [
          { word: "bed", ipa: "/bɛd/", chineseMeaning: "床" },
          { word: "red", ipa: "/rɛd/", chineseMeaning: "红色" },
          { word: "pen", ipa: "/pɛn/", chineseMeaning: "笔" },
          { word: "ten", ipa: "/tɛn/", chineseMeaning: "十" },
        ],
        difficulty: 0.2,
        order: 2,
      },
      {
        id: "short_i",
        name: "Short I",
        chineseName: "短元音I",
        description: "The short /ɪ/ sound as in 'sit'",
        chineseDescription: "短元音/ɪ/，如sit中的i",
        pattern: "i",
        sound: "ɪ",
        soundIPA: "/ɪ/",
        chineseHint: "短促的\"衣\"音",
        examples: [
          { word: "sit", ipa: "/sɪt/", chineseMeaning: "坐" },
          { word: "big", ipa: "/bɪɡ/", chineseMeaning: "大" },
          { word: "pig", ipa: "/pɪɡ/", chineseMeaning: "猪" },
          { word: "win", ipa: "/wɪn/", chineseMeaning: "赢" },
        ],
        difficulty: 0.2,
        order: 3,
      },
      {
        id: "short_o",
        name: "Short O",
        chineseName: "短元音O",
        description: "The short /ɒ/ sound as in 'hot'",
        chineseDescription: "短元音/ɒ/，如hot中的o",
        pattern: "o",
        sound: "ɒ",
        soundIPA: "/ɒ/",
        chineseHint: "类似\"哦\"但更短",
        examples: [
          { word: "hot", ipa: "/hɒt/", chineseMeaning: "热" },
          { word: "dog", ipa: "/dɒɡ/", chineseMeaning: "狗" },
          { word: "not", ipa: "/nɒt/", chineseMeaning: "不" },
          { word: "box", ipa: "/bɒks/", chineseMeaning: "盒子" },
        ],
        difficulty: 0.2,
        order: 4,
      },
      {
        id: "short_u",
        name: "Short U",
        chineseName: "短元音U",
        description: "The short /ʌ/ sound as in 'cup'",
        chineseDescription: "短元音/ʌ/，如cup中的u",
        pattern: "u",
        sound: "ʌ",
        soundIPA: "/ʌ/",
        chineseHint: "类似短促的\"阿\"",
        examples: [
          { word: "cup", ipa: "/kʌp/", chineseMeaning: "杯子" },
          { word: "bus", ipa: "/bʌs/", chineseMeaning: "公共汽车" },
          { word: "run", ipa: "/rʌn/", chineseMeaning: "跑" },
          { word: "fun", ipa: "/fʌn/", chineseMeaning: "乐趣" },
        ],
        difficulty: 0.2,
        order: 5,
      },
      {
        id: "long_a",
        name: "Long A",
        chineseName: "长元音A",
        description: "The long /eɪ/ sound as in 'cake'",
        chineseDescription: "长元音/eɪ/，如cake中的a",
        pattern: "a_e",
        sound: "eɪ",
        soundIPA: "/eɪ/",
        chineseHint: "类似\"诶\"但更长",
        examples: [
          { word: "cake", ipa: "/keɪk/", chineseMeaning: "蛋糕" },
          { word: "make", ipa: "/meɪk/", chineseMeaning: "制作" },
          { word: "name", ipa: "/neɪm/", chineseMeaning: "名字" },
          { word: "game", ipa: "/ɡeɪm/", chineseMeaning: "游戏" },
        ],
        difficulty: 0.4,
        order: 6,
      },
      {
        id: "long_e",
        name: "Long E",
        chineseName: "长元音E",
        description: "The long /iː/ sound as in 'tree'",
        chineseDescription: "长元音/iː/，如tree中的ee",
        pattern: "ee",
        sound: "iː",
        soundIPA: "/iː/",
        chineseHint: "类似\"伊\"但更长",
        examples: [
          { word: "tree", ipa: "/triː/", chineseMeaning: "树" },
          { word: "bee", ipa: "/biː/", chineseMeaning: "蜜蜂" },
          { word: "see", ipa: "/siː/", chineseMeaning: "看" },
          { word: "free", ipa: "/friː/", chineseMeaning: "自由" },
        ],
        difficulty: 0.3,
        order: 7,
      },
      {
        id: "long_i",
        name: "Long I",
        chineseName: "长元音I",
        description: "The long /aɪ/ sound as in 'bike'",
        chineseDescription: "长元音/aɪ/，如bike中的i",
        pattern: "i_e",
        sound: "aɪ",
        soundIPA: "/aɪ/",
        chineseHint: "类似\"爱\"但更长",
        examples: [
          { word: "bike", ipa: "/baɪk/", chineseMeaning: "自行车" },
          { word: "like", ipa: "/laɪk/", chineseMeaning: "喜欢" },
          { word: "time", ipa: "/taɪm/", chineseMeaning: "时间" },
          { word: "ride", ipa: "/raɪd/", chineseMeaning: "骑" },
        ],
        difficulty: 0.3,
        order: 8,
      },
      {
        id: "long_o",
        name: "Long O",
        chineseName: "长元音O",
        description: "The long /oʊ/ sound as in 'home'",
        chineseDescription: "长元音/oʊ/，如home中的o",
        pattern: "o_e",
        sound: "oʊ",
        soundIPA: "/oʊ/",
        chineseHint: "类似\"哦\"但更长",
        examples: [
          { word: "home", ipa: "/hoʊm/", chineseMeaning: "家" },
          { word: "nose", ipa: "/noʊz/", chineseMeaning: "鼻子" },
          { word: "rose", ipa: "/roʊz/", chineseMeaning: "玫瑰" },
          { word: "hope", ipa: "/hoʊp/", chineseMeaning: "希望" },
        ],
        difficulty: 0.3,
        order: 9,
      },
      {
        id: "long_u",
        name: "Long U",
        chineseName: "长元音U",
        description: "The long /juː/ sound as in 'cute'",
        chineseDescription: "长元音/juː/，如cute中的u",
        pattern: "u_e",
        sound: "juː",
        soundIPA: "/juː/",
        chineseHint: "类似\"优\"但更长",
        examples: [
          { word: "cute", ipa: "/kjuːt/", chineseMeaning: "可爱" },
          { word: "huge", ipa: "/hjuːdʒ/", chineseMeaning: "巨大" },
          { word: "fuse", ipa: "/fjuːz/", chineseMeaning: "保险丝" },
          { word: "mule", ipa: "/mjuːl/", chineseMeaning: "骡子" },
        ],
        difficulty: 0.4,
        order: 10,
      },
      {
        id: "ch",
        name: "CH Sound",
        chineseName: "CH音",
        description: "The /tʃ/ sound as in 'chair'",
        chineseDescription: "辅音/tʃ/，如chair中的ch",
        pattern: "ch",
        sound: "tʃ",
        soundIPA: "/tʃ/",
        chineseHint: "类似\"去\"但舌尖上翘",
        examples: [
          { word: "chair", ipa: "/tʃɛr/", chineseMeaning: "椅子" },
          { word: "child", ipa: "/tʃaɪld/", chineseMeaning: "孩子" },
          { word: "cheese", ipa: "/tʃiːz/", chineseMeaning: "奶酪" },
          { word: "church", ipa: "/tʃɜːrtʃ/", chineseMeaning: "教堂" },
        ],
        difficulty: 0.3,
        order: 11,
      },
      {
        id: "sh",
        name: "SH Sound",
        chineseName: "SH音",
        description: "The /ʃ/ sound as in 'ship'",
        chineseDescription: "辅音/ʃ/，如ship中的sh",
        pattern: "sh",
        sound: "ʃ",
        soundIPA: "/ʃ/",
        chineseHint: "类似\"嘘\"的声音",
        examples: [
          { word: "ship", ipa: "/ʃɪp/", chineseMeaning: "船" },
          { word: "shop", ipa: "/ʃɒp/", chineseMeaning: "商店" },
          { word: "she", ipa: "/ʃiː/", chineseMeaning: "她" },
          { word: "fish", ipa: "/fɪʃ/", chineseMeaning: "鱼" },
        ],
        difficulty: 0.3,
        order: 12,
      },
      {
        id: "th_voiceless",
        name: "TH Sound (voiceless)",
        chineseName: "TH音（清音）",
        description: "The /θ/ sound as in 'think'",
        chineseDescription: "辅音/θ/，如think中的th",
        pattern: "th",
        sound: "θ",
        soundIPA: "/θ/",
        chineseHint: "舌尖放在上下齿之间",
        examples: [
          { word: "think", ipa: "/θɪŋk/", chineseMeaning: "想" },
          { word: "three", ipa: "/θriː/", chineseMeaning: "三" },
          { word: "thank", ipa: "/θæŋk/", chineseMeaning: "谢谢" },
          { word: "tooth", ipa: "/tuːθ/", chineseMeaning: "牙齿" },
        ],
        difficulty: 0.5,
        order: 13,
      },
      {
        id: "th_voiced",
        name: "TH Sound (voiced)",
        chineseName: "TH音（浊音）",
        description: "The /ð/ sound as in 'this'",
        chineseDescription: "辅音/ð/，如this中的th",
        pattern: "th",
        sound: "ð",
        soundIPA: "/ð/",
        chineseHint: "类似\"泽\"但舌尖在齿间",
        examples: [
          { word: "this", ipa: "/ðɪs/", chineseMeaning: "这个" },
          { word: "that", ipa: "/ðæt/", chineseMeaning: "那个" },
          { word: "the", ipa: "/ðə/", chineseMeaning: "定冠词" },
          { word: "mother", ipa: "/ˈmʌðər/", chineseMeaning: "母亲" },
        ],
        difficulty: 0.5,
        order: 14,
      },
      {
        id: "ng",
        name: "NG Sound",
        chineseName: "NG音",
        description: "The /ŋ/ sound as in 'sing'",
        chineseDescription: "辅音/ŋ/，如sing中的ng",
        pattern: "ng",
        sound: "ŋ",
        soundIPA: "/ŋ/",
        chineseHint: "舌根抬起接触软腭",
        examples: [
          { word: "sing", ipa: "/sɪŋ/", chineseMeaning: "唱歌" },
          { word: "ring", ipa: "/rɪŋ/", chineseMeaning: "戒指" },
          { word: "long", ipa: "/lɒŋ/", chineseMeaning: "长" },
          { word: "king", ipa: "/kɪŋ/", chineseMeaning: "国王" },
        ],
        difficulty: 0.4,
        order: 15,
      },
    ];
  }

  private initSyllablePatterns(): SyllablePattern[] {
    return [
      {
        id: "cv",
        name: "CV Pattern",
        chineseName: "CV结构",
        pattern: "CV",
        description: "Consonant + Vowel",
        chineseDescription: "辅音 + 元音",
        examples: [
          { word: "me", ipa: "/miː/", chineseMeaning: "我" },
          { word: "go", ipa: "/ɡoʊ/", chineseMeaning: "去" },
          { word: "no", ipa: "/noʊ/", chineseMeaning: "不" },
          { word: "hi", ipa: "/haɪ/", chineseMeaning: "嗨" },
        ],
        difficulty: 0.1,
        order: 1,
      },
      {
        id: "vc",
        name: "VC Pattern",
        chineseName: "VC结构",
        pattern: "VC",
        description: "Vowel + Consonant",
        chineseDescription: "元音 + 辅音",
        examples: [
          { word: "up", ipa: "/ʌp/", chineseMeaning: "上" },
          { word: "in", ipa: "/ɪn/", chineseMeaning: "在...里" },
          { word: "on", ipa: "/ɒn/", chineseMeaning: "在...上" },
          { word: "at", ipa: "/æt/", chineseMeaning: "在" },
        ],
        difficulty: 0.1,
        order: 2,
      },
      {
        id: "cvc",
        name: "CVC Pattern",
        chineseName: "CVC结构",
        pattern: "CVC",
        description: "Consonant + Vowel + Consonant",
        chineseDescription: "辅音 + 元音 + 辅音",
        examples: [
          { word: "cat", ipa: "/kæt/", chineseMeaning: "猫" },
          { word: "dog", ipa: "/dɒɡ/", chineseMeaning: "狗" },
          { word: "pen", ipa: "/pɛn/", chineseMeaning: "笔" },
          { word: "run", ipa: "/rʌn/", chineseMeaning: "跑" },
        ],
        difficulty: 0.2,
        order: 3,
      },
      {
        id: "cvcc",
        name: "CVCC Pattern",
        chineseName: "CVCC结构",
        pattern: "CVCC",
        description: "Consonant + Vowel + Consonant Cluster",
        chineseDescription: "辅音 + 元音 + 辅音连缀",
        examples: [
          { word: "test", ipa: "/tɛst/", chineseMeaning: "测试" },
          { word: "jump", ipa: "/dʒʌmp/", chineseMeaning: "跳" },
          { word: "fast", ipa: "/fæst/", chineseMeaning: "快" },
          { word: "hand", ipa: "/hænd/", chineseMeaning: "手" },
        ],
        difficulty: 0.4,
        order: 4,
      },
      {
        id: "ccvc",
        name: "CCVC Pattern",
        chineseName: "CCVC结构",
        pattern: "CCVC",
        description: "Consonant Cluster + Vowel + Consonant",
        chineseDescription: "辅音连缀 + 元音 + 辅音",
        examples: [
          { word: "stop", ipa: "/stɒp/", chineseMeaning: "停止" },
          { word: "trap", ipa: "/træp/", chineseMeaning: "陷阱" },
          { word: "frog", ipa: "/frɒɡ/", chineseMeaning: "青蛙" },
          { word: "slip", ipa: "/slɪp/", chineseMeaning: "滑倒" },
        ],
        difficulty: 0.5,
        order: 5,
      },
      {
        id: "cv_cvc",
        name: "CV-CVC Pattern",
        chineseName: "CV-CVC结构",
        pattern: "CV CVC",
        description: "Two syllables: CV + CVC",
        chineseDescription: "双音节：CV + CVC",
        examples: [
          { word: "happy", ipa: "/ˈhæpi/", chineseMeaning: "快乐" },
          { word: "puppy", ipa: "/ˈpʌpi/", chineseMeaning: "小狗" },
          { word: "baby", ipa: "/ˈbeɪbi/", chineseMeaning: "婴儿" },
          { word: "city", ipa: "/ˈsɪti/", chineseMeaning: "城市" },
        ],
        difficulty: 0.3,
        order: 6,
      },
      {
        id: "cvc_cv",
        name: "CVC-CV Pattern",
        chineseName: "CVC-CV结构",
        pattern: "CVC CV",
        description: "Two syllables: CVC + CV",
        chineseDescription: "双音节：CVC + CV",
        examples: [
          { word: "water", ipa: "/ˈwɔːtər/", chineseMeaning: "水" },
          { word: "mother", ipa: "/ˈmʌðər/", chineseMeaning: "母亲" },
          { word: "father", ipa: "/ˈfɑːðər/", chineseMeaning: "父亲" },
          { word: "brother", ipa: "/ˈbrʌðər/", chineseMeaning: "兄弟" },
        ],
        difficulty: 0.3,
        order: 7,
      },
      {
        id: "cvc_cvc",
        name: "CVC-CVC Pattern",
        chineseName: "CVC-CVC结构",
        pattern: "CVC CVC",
        description: "Two syllables: CVC + CVC",
        chineseDescription: "双音节：CVC + CVC",
        examples: [
          { word: "sister", ipa: "/ˈsɪstər/", chineseMeaning: "姐妹" },
          { word: "mister", ipa: "/ˈmɪstər/", chineseMeaning: "先生" },
          { word: "teacher", ipa: "/ˈtiːtʃər/", chineseMeaning: "老师" },
          { word: "student", ipa: "/ˈstjuːdənt/", chineseMeaning: "学生" },
        ],
        difficulty: 0.4,
        order: 8,
      },
    ];
  }
}
