// Client testimonials for the POWER CUT™ reviews page (peakstate.shop/reviews).
//
// Sources: real check-ins from the Peak State Labs community (Skool) and direct
// messages. Names are shown as first name + last initial for privacy; the
// original screenshots (with full-name rows cropped off) back each quote via the
// "View original" lightbox. To add new testimonials, append to `reviews` below —
// the page is fully data-driven.

export type ReviewSource = "community" | "message";

export type ReviewCategory =
  | "fat-loss"
  | "food-noise"
  | "energy"
  | "mindset"
  | "strength";

export interface Review {
  id: string;
  /** Display attribution, e.g. "Paige P." or "Verified client". */
  name: string;
  /** Single-letter avatar glyph. */
  initial: string;
  source: ReviewSource;
  /** Optional timeframe chip, e.g. "Week 6" or "10-week cycle". */
  timeframe?: string;
  /** The (lightly cleaned, faithful) testimonial text. */
  quote: string;
  /** Short result chips pulled from the testimonial. */
  stats?: string[];
  categories: ReviewCategory[];
  /** Path to the original screenshot (name row cropped) for the lightbox. */
  screenshot?: string;
  /** Larger, emphasized card — a full 10-week journey. */
  featured?: boolean;
  /** Transformation photos (added once the client screenshots are uploaded). */
  photos?: string[];
}

export const reviewCategories: { key: ReviewCategory; label: string }[] = [
  { key: "fat-loss", label: "Fat Loss" },
  { key: "food-noise", label: "Food Noise" },
  { key: "energy", label: "Energy & Sleep" },
  { key: "strength", label: "Strength" },
  { key: "mindset", label: "Mindset" },
];

// Standout numbers pulled straight from the testimonials below.
export const highlightStats: { value: string; label: string }[] = [
  { value: "20+ lbs", label: "down in a single 10-week cycle" },
  { value: "5.5%", label: "body fat reduction reported" },
  { value: "+4.2%", label: "lean muscle gained" },
  { value: "30+", label: "verified client check-ins" },
];

export const reviews: Review[] = [
  // ── Featured 10-week journeys (transformation photos to be added) ──
  {
    id: "paige-amazed",
    name: "Paige P.",
    initial: "P",
    source: "community",
    timeframe: "10-week cycle complete",
    featured: true,
    quote:
      "AMAZED. I am completely floored by my results on Power Cut. I finished my 10-week cycle and got a DEXA scan at the beginning and end — I lost about 20 lbs and my body fat dropped from 26% to a little less than 21%. My biggest takeaway is the importance of nutrition and fueling my body. But the most important detail to share is how incredible I feel in my body… it really amazes me.",
    stats: ["-20 lb (DEXA)", "26% → <21% BF"],
    categories: ["fat-loss", "mindset"],
    photos: [],
  },
  {
    id: "erin-journey",
    name: "Erin D.",
    initial: "E",
    source: "community",
    timeframe: "2 months in",
    featured: true,
    quote:
      "My journey… 2 months ago my body fat was 18.8% — today it's 13.4%. I went from 128.5 lbs to 119 lbs, AND the best thing is my skeletal muscle mass is now increasing! I have always been in shape, but now I feel strong and confident AF!",
    stats: ["18.8% → 13.4% BF", "128.5 → 119 lb", "+muscle"],
    categories: ["fat-loss", "strength"],
    photos: [],
  },
  {
    id: "erin-wow",
    name: "Erin D.",
    initial: "E",
    source: "community",
    timeframe: "Halfway (Week 5)",
    featured: true,
    quote:
      "WOW. First photo, June 7: 18.8% BF at 126 lbs. Second photo, July 10: 14% BF at 121.7 lbs. I've been an athlete my entire life but the past few years I saw no progress. A few weeks before my 10-week stack I increased protein, lifted more, and cut back on cardio. I've never felt stronger or more confident — and I'm only halfway through. I'm ADDICTED.",
    stats: ["18.8% → 14% BF", "126 → 121.7 lb"],
    categories: ["fat-loss", "strength"],
    photos: [],
  },
  {
    id: "diane-newyou",
    name: "Diane V.",
    initial: "D",
    source: "community",
    timeframe: "10-week program",
    featured: true,
    quote:
      "Believe it can be a “new” YOU! For all of you starting this journey — start and don't give up. I set goals and made plans, but I kept seeing the scale gain 2 lbs, drop 3, gain 2 more. The weight fluctuated constantly. The scale lied but the mirror and my clothes did not! My body was changing — more muscle, less fat.",
    stats: ["-19 lb", "-4.5% BF", "+4.2% muscle"],
    categories: ["fat-loss", "strength", "mindset"],
    photos: [],
  },

  // ── Community check-ins & direct messages ──
  {
    id: "anon-208",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "I'm down 20.8 lbs and 4.8% body fat… and I'm not slowing down! I feel so good!!! I am 100% on my journey to the 2.0 version of myself. The peptide combination along with your guidance is priceless.",
    stats: ["-20.8 lb", "-4.8% BF"],
    categories: ["fat-loss"],
    screenshot: "/reviews/anon-208.png",
  },
  {
    id: "stephanie-wk6",
    name: "Stephanie M.",
    initial: "S",
    source: "community",
    timeframe: "Week 6",
    quote:
      "I just completed week 6. I'm down 14.2 lbs, my BMI is down 1.9% and my body fat is down 3.1%. I feel fantastic! My mind is clearer, my sleep is better, I wake up refreshed. My posture and endurance are improving and I'm so much happier. This is really a life-changing experience — I'm grateful for it every day.",
    stats: ["-14.2 lb", "-3.1% BF"],
    categories: ["fat-loss", "energy", "mindset"],
    screenshot: "/reviews/stephanie-wk6.png",
  },
  {
    id: "paige-wk7",
    name: "Paige P.",
    initial: "P",
    source: "community",
    timeframe: "Week 7",
    quote:
      "Feeling amazing after week 7. Workouts are something I look forward to and I started making morning smoothies to help with my protein intake. So far I am down 19 lbs and about 5.5% bf. The results are blowing my mind! I feel so empowered doing something that prioritizes my overall health and wellbeing.",
    stats: ["-19 lb", "-5.5% BF"],
    categories: ["fat-loss", "mindset"],
    screenshot: "/reviews/paige-wk7.png",
  },
  {
    id: "paige-wk4",
    name: "Paige P.",
    initial: "P",
    source: "community",
    timeframe: "Week 4",
    quote:
      "Week 4 checking in! I don't think I have ever felt better in my body. I'm really noticing my body composition change — and this is the first week other people started noticing too. The scale isn't moving a ton (down about 11 lbs and 3% bf) but I don't care about the scale because I see and feel the changes. Recomposition! Not shrinking myself. Eating plenty of protein keeps getting easier.",
    stats: ["-11 lb", "-3% BF"],
    categories: ["fat-loss", "mindset"],
    screenshot: "/reviews/paige-wk4.png",
  },
  {
    id: "dougie-wk1",
    name: "Dougie M.",
    initial: "D",
    source: "community",
    timeframe: "Week 1",
    quote:
      "Just an update on the end of week 1. Honestly I've tried a lot of different programmes over the years but it's always felt like a chore. This week everything just seems easier — what was once a chore already feels like it should be part of my normal day-to-day living. I've lost 3 lb and 3% body fat this week and I'm excited to see what the rest of the programme brings.",
    stats: ["-3 lb", "-3% BF"],
    categories: ["fat-loss", "mindset"],
    screenshot: "/reviews/dougie-wk1.png",
  },
  {
    id: "paige-wk3b",
    name: "Paige P.",
    initial: "P",
    source: "community",
    timeframe: "Week 3",
    quote:
      "I just finished week 3 and feeling awesome — I'm down 9 lbs and 2% bf. I definitely notice increased mindfulness in what I eat. I'm still interested in the idea of a cinnamon roll but not interested in actually having one haha. I teach fitness for a living, and since I started this stack I'm excited to get my workouts in AND even considering adding a third day a week.",
    stats: ["-9 lb", "-2% BF"],
    categories: ["fat-loss", "food-noise", "strength"],
    screenshot: "/reviews/paige-wk3b.png",
  },
  {
    id: "alana-wk1",
    name: "Alana F.",
    initial: "A",
    source: "community",
    timeframe: "Week 1",
    quote:
      "First week down! Shifts I noticed: Sleep improved so much. Body weight down a pound (which I had no business dropping — my nutrition fell off with some chaos in the week). Feeling satisfied after a light, reasonable meal without the urge to eat more for hours. ZERO post-meal cravings for something sweet. Food noise was absent for much of the week.",
    stats: ["-1 lb", "Food noise gone"],
    categories: ["food-noise", "energy", "fat-loss"],
    screenshot: "/reviews/alana-wk1.png",
  },
  {
    id: "stephanie-wk1",
    name: "Stephanie M.",
    initial: "S",
    source: "community",
    timeframe: "Week 1",
    quote:
      "First week done and I feel fantastic! I'm sleeping better and waking up actually feeling rested. Before, I was always tired and had to force myself up. My joints are “popping” less and it's easier to move. I'm down 4 lbs in 8 days. My “food noise” has always been loud — each day I'm finding that voice less prominent and truly enjoying the peace.",
    stats: ["-4 lb / 8 days", "Food noise ↓"],
    categories: ["fat-loss", "food-noise", "energy", "mindset"],
    screenshot: "/reviews/stephanie-wk1.png",
  },
  {
    id: "paige-wk3a",
    name: "Paige P.",
    initial: "P",
    source: "community",
    timeframe: "Week 3",
    quote:
      "I am on week 3 and feeling awesome. So far I'm down 6 lbs and 1.5% BF. This morning was the first time I experienced waking up at 5:30am feeling RESTED. I usually wake up still feeling tired, so it's very cool to see a shift in my sleep and ability to rest. I'm also feeling more present and motivated overall.",
    stats: ["-6 lb", "-1.5% BF"],
    categories: ["fat-loss", "energy"],
    screenshot: "/reviews/paige-wk3a.png",
  },
  {
    id: "noelle-wk6",
    name: "Noelle L.",
    initial: "N",
    source: "community",
    timeframe: "Week 6",
    quote:
      "Starting week 6 today and feeling good. My last two weeks have been hectic but I went down 2.4 lbs. I've gone from 27.5% BF to 26.8%, and 24.1 BMI to 23.7!",
    stats: ["-2.4 lb", "27.5 → 26.8% BF", "BMI 24.1 → 23.7"],
    categories: ["fat-loss"],
    screenshot: "/reviews/noelle-wk6.png",
  },
  {
    id: "dougie-wk3",
    name: "Dougie M.",
    initial: "D",
    source: "community",
    timeframe: "Week 3",
    quote:
      "Week 3 done. It's been a hectic week work-wise, which would usually make me justify skipping — but not this week! Workouts done, cardio done, diet on point. I've lost 2 lb and nearly 1% body fat, but where I'm really noticing changes is in my photos. Gut fat is just disappearing. I didn't like doing so many jabs at first but now I honestly look forward to them. This feels different — it feels long term.",
    stats: ["-2 lb", "-1% BF"],
    categories: ["fat-loss", "mindset"],
    screenshot: "/reviews/dougie-wk3.png",
  },
  {
    id: "anon-mind",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "The biggest thing for me is the growing motivation to make the huge changes I've made — and how easy it feels to actually do it. Mon–Wed felt difficult but since then it feels normal and I'm focused on keeping going. I've lost 3 lb and 3% body fat this week. I'm hoping to convert excess body fat to muscle as we go on.",
    stats: ["-3 lb", "-3% BF"],
    categories: ["fat-loss", "mindset"],
    screenshot: "/reviews/anon-mind.png",
  },
  {
    id: "anon-8lbs",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "I'm great!!! Down another 8 lbs and 1.8% body fat. I have to imagine it's going to take my body longer to respond because it's been in such chaos for too long.",
    stats: ["-8 lb", "-1.8% BF"],
    categories: ["fat-loss"],
    screenshot: "/reviews/anon-8lbs.png",
  },
  {
    id: "noelle-wk1",
    name: "Noelle L.",
    initial: "N",
    source: "community",
    timeframe: "Week 1",
    quote:
      "I just got a body composition scale from Amazon and my HSA card paid for it. I just finished my first week and I've already lost 3% body fat and one pound.",
    stats: ["-1 lb", "-3% BF"],
    categories: ["fat-loss"],
    screenshot: "/reviews/noelle-wk1.png",
  },
  {
    id: "anon-42",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "It's been great! I'm down another 4.2 lbs, 0.5 BMI and 0.9% body fat since last week. I'm still fine-tuning my habits but getting better every day. I hope you're doing amazing!",
    stats: ["-4.2 lb", "-0.9% BF"],
    categories: ["fat-loss"],
    screenshot: "/reviews/anon-42.png",
  },
  {
    id: "anon-great",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "I feel great! I'm sleeping better, it's helping with hunger and letting me focus on my diet, and my joints are “popping” less. I just bought a proper body composition scale to really track what's going on. This whole process is exactly what I needed — thank you for all of your hard work creating something like this.",
    categories: ["energy", "food-noise"],
    screenshot: "/reviews/anon-great.png",
  },
  {
    id: "anon-wk2",
    name: "Verified client",
    initial: "★",
    source: "community",
    timeframe: "Week 2",
    quote:
      "This week I worked out 5 days and felt great. I recovered well — I hadn't been working out before because every time I tried I felt a cortisol buzz all night and wouldn't sleep. But last week I felt great and slept even better. I was surprised when I ate a homemade cookie, felt it was too sweet, and didn't want any more. That has NEVER happened before.",
    categories: ["food-noise", "energy"],
    screenshot: "/reviews/anon-wk2.png",
  },
  {
    id: "greg-wk1",
    name: "Greg S.",
    initial: "G",
    source: "community",
    timeframe: "Week 1",
    quote:
      "After one week, my brain is already focusing on protein foods rather than something quick and easy. My craving for sweets is already gone after one week.",
    categories: ["food-noise"],
    screenshot: "/reviews/greg-wk1.png",
  },
  {
    id: "anon-noise",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "It seems like this protocol is taking the edge off all the dysfunction I was experiencing in my mind and body around food and health — so I can remember more of the truth, and believe in possibility. Maybe it's all related to the quieting of the “noise.”",
    categories: ["food-noise", "mindset"],
    screenshot: "/reviews/anon-noise.png",
  },
  {
    id: "anon-7lbs-b",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "I'm down 7 pounds from the start. And the foods I desire have changed significantly — I'm not deep into sugar and sweet treats and don't want them.",
    stats: ["-7 lb"],
    categories: ["fat-loss", "food-noise"],
    screenshot: "/reviews/anon-7lbs-b.png",
  },
  {
    id: "paige-wk5",
    name: "Paige P.",
    initial: "P",
    source: "community",
    timeframe: "Week 5",
    quote:
      "Week 5 done! I'm working the hardest I have in my life and yet it feels effortless. It's not shame or guilt pushing me through this — it's love and alignment. My excitement to lift weights grows every week. In fact I went to my hometown this weekend and prioritized getting a lift in, which I have never done!",
    categories: ["mindset", "strength"],
    screenshot: "/reviews/paige-wk5.png",
  },
  {
    id: "dieter-wk5",
    name: "Dieter T.",
    initial: "D",
    source: "community",
    timeframe: "Week 5",
    quote:
      "In the middle of week 5 and I'm starting to really feel more energy and endurance. Still getting used to the lower appetite, and I've started losing a few pounds. I can definitely tell I'm getting leaner, which feels great.",
    categories: ["energy", "fat-loss"],
    screenshot: "/reviews/dieter-wk5.png",
  },
  {
    id: "anon-dropped8",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "How's the body feeling? — Oh definitely noticing shifts. Dropped 8 and feeling a ton better.",
    stats: ["-8 lb"],
    categories: ["fat-loss"],
    screenshot: "/reviews/anon-dropped8.png",
  },
  {
    id: "anon-7lbs-dm",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "How's the body responding? — Everything is working out so far. Down 7 pounds since I started.",
    stats: ["-7 lb"],
    categories: ["fat-loss"],
    screenshot: "/reviews/anon-7lbs-dm.png",
  },
  {
    id: "anon-jacked",
    name: "Verified client",
    initial: "★",
    source: "message",
    quote:
      "My arms and back are jacked. I was looking at myself in the mirror doing lat pull-downs today like — damn, look at all those back muscles.",
    categories: ["strength"],
    screenshot: "/reviews/anon-jacked.png",
  },
  {
    id: "dougie-painkillers",
    name: "Dougie M.",
    initial: "D",
    source: "message",
    quote: "I'm off my painkillers too, btw!",
    categories: ["energy"],
    screenshot: "/reviews/dougie-painkillers.png",
  },
  {
    id: "dougie-mindset",
    name: "Dougie M.",
    initial: "D",
    source: "message",
    quote:
      "I'm surprised by the change of mindset within a week. It always felt like a chore, but suddenly it seems essential and I'm wanting to do this!",
    categories: ["mindset"],
    screenshot: "/reviews/dougie-mindset.png",
  },
];
