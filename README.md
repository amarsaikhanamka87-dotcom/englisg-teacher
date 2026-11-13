# English Teacher — picture flashcards

Create flashcard sets (image + English word), study them with flip cards, and quiz yourself.

- **Frontend:** Next.js (App Router) + Tailwind
- **Database:** Cloudflare D1 via Prisma (`@prisma/adapter-d1`)
- **Images:** Cloudflare R2 (served by the app at `/images/...`)
- **Hosting:** Cloudflare Workers via OpenNext

## Run locally

No keys needed — `next dev` uses a local D1 database and local R2 bucket (stored in `.wrangler/`).

```bash
npm install
npm run db:migrate:local
npm run dev
```

## Deploy to Cloudflare (first time)

```bash
npx wrangler login
npx wrangler d1 create english-teacher   # copy the database_id into wrangler.jsonc
npm run db:migrate:remote
npm run deploy
```

R2 bucket `words-images` must exist (it is bound as `IMAGES_BUCKET` in `wrangler.jsonc`).

## Changing the database

1. Edit `prisma/schema.prisma`
2. Create a migration file:
   `npx wrangler d1 migrations create DB <name>` then fill it with
   `npx prisma migrate diff --from-local-d1 --to-schema-datamodel prisma/schema.prisma --script`
3. `npm run db:migrate:local` (and `db:migrate:remote` before deploying), then `npx prisma generate`

## Code layout

```
prisma/schema.prisma                     database models
src/lib/                                 Prisma (D1) client, R2 bucket binding
migrations/                              D1 SQL migrations
wrangler.jsonc                           Cloudflare bindings (DB, IMAGES_BUCKET)
src/features/image-upload/               image validation + R2 upload/delete
src/features/flashcards/
  flashcard-set.schema.ts                validation (zod)
  flashcard-set.repository.ts            database access
  flashcard-set.service.ts               business logic
  flashcard-set.actions.ts               server actions
  quiz.logic.ts                          quiz building / answer checking
  editor/                                create & edit set UI (Quizlet-style)
  study/                                 flip cards + learn/quiz UI
  components/                            set list, delete button
src/app/                                 routes (pages, POST /api/images, GET /images/...)
```
