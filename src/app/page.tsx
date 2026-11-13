import { SetList } from "@/features/flashcards/components/SetList";
import { listFlashcardSets } from "@/features/flashcards/flashcard-set.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sets = await listFlashcardSets();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Your flashcard sets</h1>
      <SetList sets={sets} />
    </div>
  );
}
