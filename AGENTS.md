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

## Authentication (Phase 4 - Complete)

### Implementation
- **Auth Provider:** `AuthProvider` context wrapper in `src/lib/auth.tsx`
- **Google OAuth:** Configured in Supabase Dashboard → Authentication → Providers → Google
- **Callback handling:** `src/app/auth/callback/route.ts`
- **Login page:** `src/app/auth/login/page.tsx`
- **Middleware:** `src/middleware.ts` for route protection

### Auth Flow
```
User clicks "Iniciar sesión" → signInWithOAuth() → Google → 
Callback at /auth/callback → Exchange code for session → Redirect to /game
```

### Protected Routes
- `/game` - Requires authentication (enforced by middleware)
- `/auth/login` - Public login page
- `/auth/callback` - OAuth callback handler

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://ipzkvwfoyzukglbsqoyl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

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
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| user_id | uuid | REFERENCES profiles(id), RLS policy |
| misses | integer | NOT NULL, CHECK >= 0 |
| total_cards | integer | NOT NULL, DEFAULT 40 |
| completed_at | timestamptz | NULLABLE |
| deck | jsonb | NOT NULL |
| current_card_index | integer | NOT NULL, DEFAULT 0 |
| game_status | text | NOT NULL, DEFAULT 'in_progress' (values: 'in_progress', 'completed', 'abandoned') |
| updated_at | timestamptz | DEFAULT now() |

**Game Status Values:**
- `in_progress`: Game is active and can be resumed
- `completed`: User finished the game (deck exhausted)
- `abandoned`: User voluntarily quit the game

### Row Level Security
- profiles: Users can only read/update their own profile
- games: Users can only read/write their own games, public can read top scores

## Game Flow & State Management

### Game Session Rules
1. **Anonymous users**: Game state is stored in localStorage. Leaving the page clears the session.
2. **Authenticated users**: Game state is persisted to Supabase. Users can resume from where they left off.
3. **Abandoning a game**: If a user clicks "Salir de la partida" (quit), the game is marked as `abandoned` and deleted. They start fresh next time.
4. **Completing a game**: When deck is exhausted, game is marked as `completed` and score is recorded.
5. **Only one active game**: Users can only have ONE game in `in_progress` status at a time.

### State Persistence Flow
```
User starts game → Create game in DB with deck + current_index → Play → Each move updates deck_index + misses
User quits → Game marked as abandoned → Deleted
User finishes → Game marked as completed → Score saved → New game available
User returns → Check for in_progress game → Resume or create new
```

### Game End UX Best Practices
When a game ends (deck exhausted):
1. **Celebration/Results overlay**: Modal or overlay showing final score
2. **Visual hierarchy**: Miss count prominently displayed
3. **Comparison**: Show how many misses vs. best score (if applicable)
4. **Actions available**:
   - "Nueva Partida" → Start fresh game
   - "Ver Clasificación" → Go to leaderboard (future feature)
5. **Emotional design**: Subtle animations (confetti for low misses, encouraging message)
6. **Clear exit**: User knows exactly what to do next

## Current Roadmap

### TODO
- [ ] Phase 6: Sound effects and haptic feedback

### DOING
- [ ]

### DONE
- [x] Phase 1: Setup Next.js, Shadcn, and AGENTS.md
- [x] Phase 2: Core game engine (deck, shuffling, comparison logic)
- [x] Phase 3: Visual polish (Framer Motion card animations, mobile-first responsive design, Fournier card back)
- [x] Phase 3.5: Game flow improvements (abandon button, game end UX)
- [x] Phase 4: Supabase auth (Google OAuth) and database schema
- [x] Phase 4.5: Game state persistence to Supabase (save/resume games)
- [x] Phase 5: Leaderboard / scoreboard
- [x] Phase 7: Players list and player profiles with game history

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

**Card Back Design:** `/public/cards/back.svg`
- Style: Fournier classic
- Color scheme: Dark burgundy with gold accents
- Design: Geometric pattern with hexagonal motifs and cross emblem

## Project Structure

```
a-ciegas/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Home)
│   │   ├── game/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── players/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── callback/route.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   └── progress.tsx
│   │   ├── Card.tsx
│   │   ├── CardTable.tsx
│   │   ├── PredictionButtons.tsx
│   │   ├── ScoreDisplay.tsx
│   │   ├── GameEndModal.tsx
│   │   └── QuitConfirmation.tsx
│   ├── hooks/
│   │   └── useGame.ts
│   ├── lib/
│   │   ├── auth.tsx (AuthProvider)
│   │   ├── utils.ts
│   │   ├── deck.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── server.ts
│   ├── middleware.ts
│   └── types/
│       └── index.ts
├── public/
│   └── cards/
│       ├── [value]_[suit].png
│       └── back.svg
├── components.json
├── AGENTS.md
└── package.json
```

## Supabase Setup

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

-- Games table with state persistence fields
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  misses INTEGER NOT NULL CHECK (misses >= 0),
  total_cards INTEGER NOT NULL DEFAULT 40,
  completed_at TIMESTAMPTZ NULLABLE,
  deck JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_card_index INTEGER NOT NULL DEFAULT 0,
  game_status TEXT NOT NULL DEFAULT 'in_progress' CHECK (game_status IN ('in_progress', 'completed', 'abandoned')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding active games quickly
CREATE INDEX idx_games_user_active ON games(user_id) WHERE game_status = 'in_progress';

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