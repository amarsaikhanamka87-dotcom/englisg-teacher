import Link from "next/link";
import { FlipCardsStudy } from "@/features/flashcards/study/FlipCardsStudy";
import { loadSetOrNotFound } from "../load-set";

export default async function FlashcardsPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  const set = await loadSetOrNotFound(setId);
  return (
    <div className="flex flex-col gap-6">
      <Link href={`/sets/${set.id}`} className="text-sm text-indigo-600 hover:underline">← {set.title}</Link>
      <FlipCardsStudy cards={set.cards} />
    </div>
  );
}
