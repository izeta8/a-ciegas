# A Ciegas - Project Architecture

## Original Project Vision

"A Ciegas" is a Spanish "Higher or Lower" card game using the traditional 40-card Fournier deck. Players predict whether the next card will be higher, lower, or equal to the current card. The game tests intuition and risk assessment, with the goal of completing the full 40-card deck with minimum misses.

**Core Mechanics:**
- Full deck play-through (40 cards: 1-7, 10-12 in four suits: Oros, Copas, Espadas, Bastos)
- User predicts: "Mayor" (Higher), "Menor" (Lower), or "Igual" (Equal)
- "Igual" prediction is the only way to avoid a miss when cards match
- Game ends when deck is empty
- Score = Total count of "Misses" (fewer is better)

## Tech Stack & Conventions

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Animations | Framer Motion |
| Backend | Supabase (Auth + PostgreSQL) |
| Auth Provider | Google OAuth |

**Design Philosophy: Mobile-First**
- **Primary target:** Mobile devices (375px+ width)
- **Secondary:** Desktop/tablet (optimized but not prioritized)
- Always design and implement for mobile first, then scale up
- Use responsive utilities (`sm:`, `md:`, `lg:`) to enhance for larger screens
- Test mobile experience before desktop enhancements

**Naming Conventions:**
- Components: PascalCase (CardTable.tsx)
- Hooks: camelCase with use prefix (useGame.ts)
- Utilities: camelCase (shuffleDeck.ts)
- CSS classes: Tailwind utility classes
- File paths: kebab-case for folders, PascalCase for React files

## Database Schema (Supabase)

### profiles
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY, references auth.users |
| username | text | NOT NULL |
| avatar_url | text | NULLABLE |
| created_at | timestamptz | DEFAULT now() |

### games
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() |
| user_id | uuid | REFERENCES profiles(id), RLS policy |
| misses | integer | NOT NULL, CHECK >= 0 |
| total_cards | integer | NOT NULL, DEFAULT 40 |
| created_at | timestamptz | DEFAULT now() |

### Row Level Security
- profiles: Users can only read/update their own profile
- games: Users can only read/write their own games, public can read top scores

## Current Roadmap

### TODO
- [ ] Phase 4: Supabase integration (Auth + Database)
- [ ] Phase 5: Sound effects and haptic feedback

### DOING
- [ ] 

### DONE
- [x] Phase 1: Setup Next.js, Shadcn, and AGENTS.md
- [x] Phase 2: Core game engine (deck, shuffling, comparison logic)
- [x] Phase 3: Visual polish (Framer Motion card animations, mobile-first responsive design)
- [ ] Phase 4: Supabase auth and scoreboard
- [ ] Phase 5: Polish (sound effects, desktop optimizations)

## Card Asset Mapping

**File Naming Convention:** `{value}_{suit}.png`

**Values:**
| Value | Display | Notes |
|-------|---------|-------|
| 1 | As | Lowest card |
| 2-7 | 2-7 | Numerical cards |
| 10 | Sota | Face card |
| 11 | Caballo | Face card |
| 12 | Rey | Highest card |

**Suits:**
| Suit | Spanish | Directory |
|------|---------|-----------|
| oros | Coins | gold accent |
| copas | Cups | red accent |
| espadas | Swords | black |
| bastos | Clubs | black |

**Expected Location:** `/public/cards/[value]_[suit].png`

Example: `/public/cards/1_oros.png`, `/public/cards/12_bastos.png`

## Project Structure

```
a-ciegas/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Home)
│   │   ├── game/page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   └── progress.tsx
│   │   ├── Card.tsx
│   │   ├── CardTable.tsx
│   │   ├── PredictionButtons.tsx
│   │   └── ScoreDisplay.tsx
│   ├── hooks/
│   │   └── useGame.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── deck.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── server.ts
│   └── types/
│       └── index.ts
├── public/
│   └── cards/
│       └── [value]_[suit].png
├── components.json
├── AGENTS.md
└── package.json
```

## Supabase Setup (Phase 4 - Pending)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  misses INTEGER NOT NULL CHECK (misses >= 0),
  total_cards INTEGER NOT NULL DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Games: users can CRUD their own games, public can read top scores
CREATE POLICY "Users can CRUD own games" ON games FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can read top scores" ON games FOR SELECT USING (true);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Player' || substring(new.id::text, 1, 4)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```