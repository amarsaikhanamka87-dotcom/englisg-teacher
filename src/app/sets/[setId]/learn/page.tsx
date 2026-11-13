import Link from "next/link";
import { QuizStudy } from "@/features/flashcards/study/QuizStudy";
import { loadSetOrNotFound } from "../load-set";

export default async function LearnPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  const set = await loadSetOrNotFound(setId);
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link href={`/sets/${set.id}`} className="text-sm text-indigo-600 hover:underline">← {set.title}</Link>
      <QuizStudy cards={set.cards} />
    </div>
  );
}
