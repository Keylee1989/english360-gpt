/**
 * Audio Manifest for Day 1-30
 *
 * Maps vocabulary words to audio file paths
 * Used by AudioEngine v3 for native audio playback
 */

import type { AudioManifestItem } from "@/engines/audio/v3";

// ============================================================
// Day 1-30 Audio Manifest
// ============================================================

export const AUDIO_MANIFEST: AudioManifestItem[] = [
  // Day 1: Hello, English!
  { word: "hello", audio: "/audio/vocabulary/hello.mp3", slowAudio: "/audio/vocabulary/hello_slow.mp3", type: "vocabulary" },
  { word: "hi", audio: "/audio/vocabulary/hi.mp3", slowAudio: "/audio/vocabulary/hi_slow.mp3", type: "vocabulary" },
  { word: "yes", audio: "/audio/vocabulary/yes.mp3", slowAudio: "/audio/vocabulary/yes_slow.mp3", type: "vocabulary" },
  { word: "no", audio: "/audio/vocabulary/no.mp3", slowAudio: "/audio/vocabulary/no_slow.mp3", type: "vocabulary" },
  { word: "name", audio: "/audio/vocabulary/name.mp3", slowAudio: "/audio/vocabulary/name_slow.mp3", type: "vocabulary" },
  { word: "my", audio: "/audio/vocabulary/my.mp3", slowAudio: "/audio/vocabulary/my_slow.mp3", type: "vocabulary" },
  { word: "is", audio: "/audio/vocabulary/is.mp3", slowAudio: "/audio/vocabulary/is_slow.mp3", type: "vocabulary" },
  { word: "goodbye", audio: "/audio/vocabulary/goodbye.mp3", slowAudio: "/audio/vocabulary/goodbye_slow.mp3", type: "vocabulary" },

  // Day 2: Numbers & Colors
  { word: "one", audio: "/audio/vocabulary/one.mp3", slowAudio: "/audio/vocabulary/one_slow.mp3", type: "vocabulary" },
  { word: "two", audio: "/audio/vocabulary/two.mp3", slowAudio: "/audio/vocabulary/two_slow.mp3", type: "vocabulary" },
  { word: "three", audio: "/audio/vocabulary/three.mp3", slowAudio: "/audio/vocabulary/three_slow.mp3", type: "vocabulary" },
  { word: "red", audio: "/audio/vocabulary/red.mp3", slowAudio: "/audio/vocabulary/red_slow.mp3", type: "vocabulary" },
  { word: "blue", audio: "/audio/vocabulary/blue.mp3", slowAudio: "/audio/vocabulary/blue_slow.mp3", type: "vocabulary" },
  { word: "green", audio: "/audio/vocabulary/green.mp3", slowAudio: "/audio/vocabulary/green_slow.mp3", type: "vocabulary" },
  { word: "what", audio: "/audio/vocabulary/what.mp3", slowAudio: "/audio/vocabulary/what_slow.mp3", type: "vocabulary" },
  { word: "this", audio: "/audio/vocabulary/this.mp3", slowAudio: "/audio/vocabulary/this_slow.mp3", type: "vocabulary" },

  // Day 9: Common Nouns
  { word: "cat", audio: "/audio/vocabulary/cat.mp3", slowAudio: "/audio/vocabulary/cat_slow.mp3", type: "vocabulary" },
  { word: "dog", audio: "/audio/vocabulary/dog.mp3", slowAudio: "/audio/vocabulary/dog_slow.mp3", type: "vocabulary" },
  { word: "bird", audio: "/audio/vocabulary/bird.mp3", slowAudio: "/audio/vocabulary/bird_slow.mp3", type: "vocabulary" },
  { word: "fish", audio: "/audio/vocabulary/fish.mp3", slowAudio: "/audio/vocabulary/fish_slow.mp3", type: "vocabulary" },
  { word: "house", audio: "/audio/vocabulary/house.mp3", slowAudio: "/audio/vocabulary/house_slow.mp3", type: "vocabulary" },
  { word: "car", audio: "/audio/vocabulary/car.mp3", slowAudio: "/audio/vocabulary/car_slow.mp3", type: "vocabulary" },
  { word: "book", audio: "/audio/vocabulary/book.mp3", slowAudio: "/audio/vocabulary/book_slow.mp3", type: "vocabulary" },
  { word: "pen", audio: "/audio/vocabulary/pen.mp3", slowAudio: "/audio/vocabulary/pen_slow.mp3", type: "vocabulary" },

  // Day 10: Basic Verbs
  { word: "go", audio: "/audio/vocabulary/go.mp3", slowAudio: "/audio/vocabulary/go_slow.mp3", type: "vocabulary" },
  { word: "come", audio: "/audio/vocabulary/come.mp3", slowAudio: "/audio/vocabulary/come_slow.mp3", type: "vocabulary" },
  { word: "see", audio: "/audio/vocabulary/see.mp3", slowAudio: "/audio/vocabulary/see_slow.mp3", type: "vocabulary" },
  { word: "eat", audio: "/audio/vocabulary/eat.mp3", slowAudio: "/audio/vocabulary/eat_slow.mp3", type: "vocabulary" },
  { word: "drink", audio: "/audio/vocabulary/drink.mp3", slowAudio: "/audio/vocabulary/drink_slow.mp3", type: "vocabulary" },
  { word: "sleep", audio: "/audio/vocabulary/sleep.mp3", slowAudio: "/audio/vocabulary/sleep_slow.mp3", type: "vocabulary" },
  { word: "work", audio: "/audio/vocabulary/work.mp3", slowAudio: "/audio/vocabulary/work_slow.mp3", type: "vocabulary" },
  { word: "play", audio: "/audio/vocabulary/play.mp3", slowAudio: "/audio/vocabulary/play_slow.mp3", type: "vocabulary" },

  // Day 11: Adjectives
  { word: "big", audio: "/audio/vocabulary/big.mp3", slowAudio: "/audio/vocabulary/big_slow.mp3", type: "vocabulary" },
  { word: "small", audio: "/audio/vocabulary/small.mp3", slowAudio: "/audio/vocabulary/small_slow.mp3", type: "vocabulary" },
  { word: "good", audio: "/audio/vocabulary/good.mp3", slowAudio: "/audio/vocabulary/good_slow.mp3", type: "vocabulary" },
  { word: "bad", audio: "/audio/vocabulary/bad.mp3", slowAudio: "/audio/vocabulary/bad_slow.mp3", type: "vocabulary" },
  { word: "happy", audio: "/audio/vocabulary/happy.mp3", slowAudio: "/audio/vocabulary/happy_slow.mp3", type: "vocabulary" },
  { word: "sad", audio: "/audio/vocabulary/sad.mp3", slowAudio: "/audio/vocabulary/sad_slow.mp3", type: "vocabulary" },
  { word: "hot", audio: "/audio/vocabulary/hot.mp3", slowAudio: "/audio/vocabulary/hot_slow.mp3", type: "vocabulary" },
  { word: "cold", audio: "/audio/vocabulary/cold.mp3", slowAudio: "/audio/vocabulary/cold_slow.mp3", type: "vocabulary" },

  // Day 12: Food & Drinks
  { word: "water", audio: "/audio/vocabulary/water.mp3", slowAudio: "/audio/vocabulary/water_slow.mp3", type: "vocabulary" },
  { word: "rice", audio: "/audio/vocabulary/rice.mp3", slowAudio: "/audio/vocabulary/rice_slow.mp3", type: "vocabulary" },
  { word: "bread", audio: "/audio/vocabulary/bread.mp3", slowAudio: "/audio/vocabulary/bread_slow.mp3", type: "vocabulary" },
  { word: "egg", audio: "/audio/vocabulary/egg.mp3", slowAudio: "/audio/vocabulary/egg_slow.mp3", type: "vocabulary" },
  { word: "milk", audio: "/audio/vocabulary/milk.mp3", slowAudio: "/audio/vocabulary/milk_slow.mp3", type: "vocabulary" },
  { word: "tea", audio: "/audio/vocabulary/tea.mp3", slowAudio: "/audio/vocabulary/tea_slow.mp3", type: "vocabulary" },
  { word: "coffee", audio: "/audio/vocabulary/coffee.mp3", slowAudio: "/audio/vocabulary/coffee_slow.mp3", type: "vocabulary" },
  { word: "apple", audio: "/audio/vocabulary/apple.mp3", slowAudio: "/audio/vocabulary/apple_slow.mp3", type: "vocabulary" },
  { word: "banana", audio: "/audio/vocabulary/banana.mp3", slowAudio: "/audio/vocabulary/banana_slow.mp3", type: "vocabulary" },
  { word: "orange", audio: "/audio/vocabulary/orange.mp3", slowAudio: "/audio/vocabulary/orange_slow.mp3", type: "vocabulary" },

  // Day 13: Body Parts
  { word: "head", audio: "/audio/vocabulary/head.mp3", slowAudio: "/audio/vocabulary/head_slow.mp3", type: "vocabulary" },
  { word: "eye", audio: "/audio/vocabulary/eye.mp3", slowAudio: "/audio/vocabulary/eye_slow.mp3", type: "vocabulary" },
  { word: "ear", audio: "/audio/vocabulary/ear.mp3", slowAudio: "/audio/vocabulary/ear_slow.mp3", type: "vocabulary" },
  { word: "nose", audio: "/audio/vocabulary/nose.mp3", slowAudio: "/audio/vocabulary/nose_slow.mp3", type: "vocabulary" },
  { word: "mouth", audio: "/audio/vocabulary/mouth.mp3", slowAudio: "/audio/vocabulary/mouth_slow.mp3", type: "vocabulary" },
  { word: "hand", audio: "/audio/vocabulary/hand.mp3", slowAudio: "/audio/vocabulary/hand_slow.mp3", type: "vocabulary" },
  { word: "arm", audio: "/audio/vocabulary/arm.mp3", slowAudio: "/audio/vocabulary/arm_slow.mp3", type: "vocabulary" },
  { word: "leg", audio: "/audio/vocabulary/leg.mp3", slowAudio: "/audio/vocabulary/leg_slow.mp3", type: "vocabulary" },
  { word: "foot", audio: "/audio/vocabulary/foot.mp3", slowAudio: "/audio/vocabulary/foot_slow.mp3", type: "vocabulary" },
  { word: "face", audio: "/audio/vocabulary/face.mp3", slowAudio: "/audio/vocabulary/face_slow.mp3", type: "vocabulary" },

  // Day 15: Question Words
  { word: "who", audio: "/audio/vocabulary/who.mp3", slowAudio: "/audio/vocabulary/who_slow.mp3", type: "vocabulary" },
  { word: "where", audio: "/audio/vocabulary/where.mp3", slowAudio: "/audio/vocabulary/where_slow.mp3", type: "vocabulary" },
  { word: "when", audio: "/audio/vocabulary/when.mp3", slowAudio: "/audio/vocabulary/when_slow.mp3", type: "vocabulary" },
  { word: "why", audio: "/audio/vocabulary/why.mp3", slowAudio: "/audio/vocabulary/why_slow.mp3", type: "vocabulary" },
  { word: "how", audio: "/audio/vocabulary/how.mp3", slowAudio: "/audio/vocabulary/how_slow.mp3", type: "vocabulary" },
  { word: "which", audio: "/audio/vocabulary/which.mp3", slowAudio: "/audio/vocabulary/which_slow.mp3", type: "vocabulary" },
  { word: "much", audio: "/audio/vocabulary/much.mp3", slowAudio: "/audio/vocabulary/much_slow.mp3", type: "vocabulary" },

  // Day 16: Prepositions
  { word: "in", audio: "/audio/vocabulary/in.mp3", slowAudio: "/audio/vocabulary/in_slow.mp3", type: "vocabulary" },
  { word: "on", audio: "/audio/vocabulary/on.mp3", slowAudio: "/audio/vocabulary/on_slow.mp3", type: "vocabulary" },
  { word: "under", audio: "/audio/vocabulary/under.mp3", slowAudio: "/audio/vocabulary/under_slow.mp3", type: "vocabulary" },
  { word: "with", audio: "/audio/vocabulary/with.mp3", slowAudio: "/audio/vocabulary/with_slow.mp3", type: "vocabulary" },
  { word: "for", audio: "/audio/vocabulary/for.mp3", slowAudio: "/audio/vocabulary/for_slow.mp3", type: "vocabulary" },
  { word: "to", audio: "/audio/vocabulary/to.mp3", slowAudio: "/audio/vocabulary/to_slow.mp3", type: "vocabulary" },
  { word: "from", audio: "/audio/vocabulary/from.mp3", slowAudio: "/audio/vocabulary/from_slow.mp3", type: "vocabulary" },
  { word: "at", audio: "/audio/vocabulary/at.mp3", slowAudio: "/audio/vocabulary/at_slow.mp3", type: "vocabulary" },

  // Day 18: Family Words
  { word: "mother", audio: "/audio/vocabulary/mother.mp3", slowAudio: "/audio/vocabulary/mother_slow.mp3", type: "vocabulary" },
  { word: "father", audio: "/audio/vocabulary/father.mp3", slowAudio: "/audio/vocabulary/father_slow.mp3", type: "vocabulary" },
  { word: "brother", audio: "/audio/vocabulary/brother.mp3", slowAudio: "/audio/vocabulary/brother_slow.mp3", type: "vocabulary" },
  { word: "sister", audio: "/audio/vocabulary/sister.mp3", slowAudio: "/audio/vocabulary/sister_slow.mp3", type: "vocabulary" },
  { word: "son", audio: "/audio/vocabulary/son.mp3", slowAudio: "/audio/vocabulary/son_slow.mp3", type: "vocabulary" },
  { word: "daughter", audio: "/audio/vocabulary/daughter.mp3", slowAudio: "/audio/vocabulary/daughter_slow.mp3", type: "vocabulary" },
  { word: "family", audio: "/audio/vocabulary/family.mp3", slowAudio: "/audio/vocabulary/family_slow.mp3", type: "vocabulary" },
  { word: "friend", audio: "/audio/vocabulary/friend.mp3", slowAudio: "/audio/vocabulary/friend_slow.mp3", type: "vocabulary" },

  // Day 19: Clothing
  { word: "shirt", audio: "/audio/vocabulary/shirt.mp3", slowAudio: "/audio/vocabulary/shirt_slow.mp3", type: "vocabulary" },
  { word: "pants", audio: "/audio/vocabulary/pants.mp3", slowAudio: "/audio/vocabulary/pants_slow.mp3", type: "vocabulary" },
  { word: "shoes", audio: "/audio/vocabulary/shoes.mp3", slowAudio: "/audio/vocabulary/shoes_slow.mp3", type: "vocabulary" },
  { word: "hat", audio: "/audio/vocabulary/hat.mp3", slowAudio: "/audio/vocabulary/hat_slow.mp3", type: "vocabulary" },
  { word: "dress", audio: "/audio/vocabulary/dress.mp3", slowAudio: "/audio/vocabulary/dress_slow.mp3", type: "vocabulary" },
  { word: "coat", audio: "/audio/vocabulary/coat.mp3", slowAudio: "/audio/vocabulary/coat_slow.mp3", type: "vocabulary" },
  { word: "sock", audio: "/audio/vocabulary/sock.mp3", slowAudio: "/audio/vocabulary/sock_slow.mp3", type: "vocabulary" },
  { word: "skirt", audio: "/audio/vocabulary/skirt.mp3", slowAudio: "/audio/vocabulary/skirt_slow.mp3", type: "vocabulary" },

  // Day 20: Weather
  { word: "weather", audio: "/audio/vocabulary/weather.mp3", slowAudio: "/audio/vocabulary/weather_slow.mp3", type: "vocabulary" },
  { word: "sun", audio: "/audio/vocabulary/sun.mp3", slowAudio: "/audio/vocabulary/sun_slow.mp3", type: "vocabulary" },
  { word: "rain", audio: "/audio/vocabulary/rain.mp3", slowAudio: "/audio/vocabulary/rain_slow.mp3", type: "vocabulary" },
  { word: "snow", audio: "/audio/vocabulary/snow.mp3", slowAudio: "/audio/vocabulary/snow_slow.mp3", type: "vocabulary" },
  { word: "wind", audio: "/audio/vocabulary/wind.mp3", slowAudio: "/audio/vocabulary/wind_slow.mp3", type: "vocabulary" },
  { word: "cloud", audio: "/audio/vocabulary/cloud.mp3", slowAudio: "/audio/vocabulary/cloud_slow.mp3", type: "vocabulary" },
  { word: "warm", audio: "/audio/vocabulary/warm.mp3", slowAudio: "/audio/vocabulary/warm_slow.mp3", type: "vocabulary" },
  { word: "cool", audio: "/audio/vocabulary/cool.mp3", slowAudio: "/audio/vocabulary/cool_slow.mp3", type: "vocabulary" },

  // Day 22: Places
  { word: "school", audio: "/audio/vocabulary/school.mp3", slowAudio: "/audio/vocabulary/school_slow.mp3", type: "vocabulary" },
  { word: "store", audio: "/audio/vocabulary/store.mp3", slowAudio: "/audio/vocabulary/store_slow.mp3", type: "vocabulary" },
  { word: "park", audio: "/audio/vocabulary/park.mp3", slowAudio: "/audio/vocabulary/park_slow.mp3", type: "vocabulary" },
  { word: "hospital", audio: "/audio/vocabulary/hospital.mp3", slowAudio: "/audio/vocabulary/hospital_slow.mp3", type: "vocabulary" },
  { word: "restaurant", audio: "/audio/vocabulary/restaurant.mp3", slowAudio: "/audio/vocabulary/restaurant_slow.mp3", type: "vocabulary" },
  { word: "office", audio: "/audio/vocabulary/office.mp3", slowAudio: "/audio/vocabulary/office_slow.mp3", type: "vocabulary" },
  { word: "home", audio: "/audio/vocabulary/home.mp3", slowAudio: "/audio/vocabulary/home_slow.mp3", type: "vocabulary" },
  { word: "market", audio: "/audio/vocabulary/market.mp3", slowAudio: "/audio/vocabulary/market_slow.mp3", type: "vocabulary" },

  // Day 23: Possessives
  { word: "my", audio: "/audio/vocabulary/my.mp3", slowAudio: "/audio/vocabulary/my_slow.mp3", type: "vocabulary" },
  { word: "your", audio: "/audio/vocabulary/your.mp3", slowAudio: "/audio/vocabulary/your_slow.mp3", type: "vocabulary" },
  { word: "his", audio: "/audio/vocabulary/his.mp3", slowAudio: "/audio/vocabulary/his_slow.mp3", type: "vocabulary" },
  { word: "her", audio: "/audio/vocabulary/her.mp3", slowAudio: "/audio/vocabulary/her_slow.mp3", type: "vocabulary" },
  { word: "its", audio: "/audio/vocabulary/its.mp3", slowAudio: "/audio/vocabulary/its_slow.mp3", type: "vocabulary" },
  { word: "our", audio: "/audio/vocabulary/our.mp3", slowAudio: "/audio/vocabulary/our_slow.mp3", type: "vocabulary" },
  { word: "their", audio: "/audio/vocabulary/their.mp3", slowAudio: "/audio/vocabulary/their_slow.mp3", type: "vocabulary" },
  { word: "mine", audio: "/audio/vocabulary/mine.mp3", slowAudio: "/audio/vocabulary/mine_slow.mp3", type: "vocabulary" },

  // Day 27: Numbers 21-100
  { word: "twenty", audio: "/audio/vocabulary/twenty.mp3", slowAudio: "/audio/vocabulary/twenty_slow.mp3", type: "vocabulary" },
  { word: "thirty", audio: "/audio/vocabulary/thirty.mp3", slowAudio: "/audio/vocabulary/thirty_slow.mp3", type: "vocabulary" },
  { word: "forty", audio: "/audio/vocabulary/forty.mp3", slowAudio: "/audio/vocabulary/forty_slow.mp3", type: "vocabulary" },
  { word: "fifty", audio: "/audio/vocabulary/fifty.mp3", slowAudio: "/audio/vocabulary/fifty_slow.mp3", type: "vocabulary" },
  { word: "sixty", audio: "/audio/vocabulary/sixty.mp3", slowAudio: "/audio/vocabulary/sixty_slow.mp3", type: "vocabulary" },
  { word: "seventy", audio: "/audio/vocabulary/seventy.mp3", slowAudio: "/audio/vocabulary/seventy_slow.mp3", type: "vocabulary" },
  { word: "eighty", audio: "/audio/vocabulary/eighty.mp3", slowAudio: "/audio/vocabulary/eighty_slow.mp3", type: "vocabulary" },
  { word: "ninety", audio: "/audio/vocabulary/ninety.mp3", slowAudio: "/audio/vocabulary/ninety_slow.mp3", type: "vocabulary" },
  { word: "hundred", audio: "/audio/vocabulary/hundred.mp3", slowAudio: "/audio/vocabulary/hundred_slow.mp3", type: "vocabulary" },
  { word: "zero", audio: "/audio/vocabulary/zero.mp3", slowAudio: "/audio/vocabulary/zero_slow.mp3", type: "vocabulary" },

  // Day 28: Days & Months
  { word: "Monday", audio: "/audio/vocabulary/monday.mp3", slowAudio: "/audio/vocabulary/monday_slow.mp3", type: "vocabulary" },
  { word: "Tuesday", audio: "/audio/vocabulary/tuesday.mp3", slowAudio: "/audio/vocabulary/tuesday_slow.mp3", type: "vocabulary" },
  { word: "Wednesday", audio: "/audio/vocabulary/wednesday.mp3", slowAudio: "/audio/vocabulary/wednesday_slow.mp3", type: "vocabulary" },
  { word: "Thursday", audio: "/audio/vocabulary/thursday.mp3", slowAudio: "/audio/vocabulary/thursday_slow.mp3", type: "vocabulary" },
  { word: "Friday", audio: "/audio/vocabulary/friday.mp3", slowAudio: "/audio/vocabulary/friday_slow.mp3", type: "vocabulary" },
  { word: "Saturday", audio: "/audio/vocabulary/saturday.mp3", slowAudio: "/audio/vocabulary/saturday_slow.mp3", type: "vocabulary" },
  { word: "Sunday", audio: "/audio/vocabulary/sunday.mp3", slowAudio: "/audio/vocabulary/sunday_slow.mp3", type: "vocabulary" },
  { word: "January", audio: "/audio/vocabulary/january.mp3", slowAudio: "/audio/vocabulary/january_slow.mp3", type: "vocabulary" },

  // Day 29: Hobbies
  { word: "hobby", audio: "/audio/vocabulary/hobby.mp3", slowAudio: "/audio/vocabulary/hobby_slow.mp3", type: "vocabulary" },
  { word: "music", audio: "/audio/vocabulary/music.mp3", slowAudio: "/audio/vocabulary/music_slow.mp3", type: "vocabulary" },
  { word: "dance", audio: "/audio/vocabulary/dance.mp3", slowAudio: "/audio/vocabulary/dance_slow.mp3", type: "vocabulary" },
  { word: "sing", audio: "/audio/vocabulary/sing.mp3", slowAudio: "/audio/vocabulary/sing_slow.mp3", type: "vocabulary" },
  { word: "draw", audio: "/audio/vocabulary/draw.mp3", slowAudio: "/audio/vocabulary/draw_slow.mp3", type: "vocabulary" },
  { word: "cook", audio: "/audio/vocabulary/cook.mp3", slowAudio: "/audio/vocabulary/cook_slow.mp3", type: "vocabulary" },
  { word: "travel", audio: "/audio/vocabulary/travel.mp3", slowAudio: "/audio/vocabulary/travel_slow.mp3", type: "vocabulary" },
  { word: "game", audio: "/audio/vocabulary/game.mp3", slowAudio: "/audio/vocabulary/game_slow.mp3", type: "vocabulary" },
];

// ============================================================
// Sentence Audio Manifest
// ============================================================

export const SENTENCE_MANIFEST: AudioManifestItem[] = [
  // Common sentences
  { word: "hello_my_name_is", audio: "/audio/sentences/hello_my_name_is.mp3", type: "sentences" },
  { word: "how_are_you", audio: "/audio/sentences/how_are_you.mp3", type: "sentences" },
  { word: "i_am_fine", audio: "/audio/sentences/i_am_fine.mp3", type: "sentences" },
  { word: "nice_to_meet_you", audio: "/audio/sentences/nice_to_meet_you.mp3", type: "sentences" },
  { word: "good_morning", audio: "/audio/sentences/good_morning.mp3", type: "sentences" },
  { word: "good_afternoon", audio: "/audio/sentences/good_afternoon.mp3", type: "sentences" },
  { word: "good_evening", audio: "/audio/sentences/good_evening.mp3", type: "sentences" },
  { word: "thank_you", audio: "/audio/sentences/thank_you.mp3", type: "sentences" },
  { word: "you_are_welcome", audio: "/audio/sentences/you_are_welcome.mp3", type: "sentences" },
  { word: "i_like_apples", audio: "/audio/sentences/i_like_apples.mp3", type: "sentences" },
  { word: "i_want_water", audio: "/audio/sentences/i_want_water.mp3", type: "sentences" },
  { word: "this_is_my_house", audio: "/audio/sentences/this_is_my_house.mp3", type: "sentences" },
  { word: "i_go_to_school", audio: "/audio/sentences/i_go_to_school.mp3", type: "sentences" },
  { word: "i_have_a_cat", audio: "/audio/sentences/i_have_a_cat.mp3", type: "sentences" },
  { word: "what_time_is_it", audio: "/audio/sentences/what_time_is_it.mp3", type: "sentences" },
];

// ============================================================
// Dialogue Audio Manifest
// ============================================================

export const DIALOGUE_MANIFEST: AudioManifestItem[] = [
  { word: "greeting_dialogue", audio: "/audio/dialogues/greeting.mp3", type: "dialogues" },
  { word: "introduction_dialogue", audio: "/audio/dialogues/introduction.mp3", type: "dialogues" },
  { word: "shopping_dialogue", audio: "/audio/dialogues/shopping.mp3", type: "dialogues" },
  { word: "restaurant_dialogue", audio: "/audio/dialogues/restaurant.mp3", type: "dialogues" },
  { word: "family_dialogue", audio: "/audio/dialogues/family.mp3", type: "dialogues" },
];

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get all vocabulary words from manifest
 */
export function getAllVocabularyWords(): string[] {
  return AUDIO_MANIFEST.filter(item => item.type === "vocabulary").map(item => item.word);
}

/**
 * Get words for a specific day
 */
export function getWordsForDay(day: number): string[] {
  // Approximate word counts per day
  const wordsPerDay = Math.ceil(AUDIO_MANIFEST.length / 30);
  const startIdx = (day - 1) * wordsPerDay;
  const endIdx = Math.min(startIdx + wordsPerDay, AUDIO_MANIFEST.length);
  return AUDIO_MANIFEST.slice(startIdx, endIdx).map(item => item.word);
}

/**
 * Get audio path for a word
 */
export function getAudioPath(word: string, speed: "slow" | "normal" = "normal"): string | null {
  const item = AUDIO_MANIFEST.find(i => i.word === word);
  if (!item) return null;
  return speed === "slow" ? (item.slowAudio || item.audio) : item.audio;
}

/**
 * Get total word count
 */
export function getTotalWordCount(): number {
  return AUDIO_MANIFEST.filter(item => item.type === "vocabulary").length;
}

export default AUDIO_MANIFEST;
