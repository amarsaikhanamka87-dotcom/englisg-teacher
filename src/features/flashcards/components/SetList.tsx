import Link from "next/link";
import type { FlashcardSetSummary } from "../flashcard-set.types";

type SetListProps = {
  sets: FlashcardSetSummary[];
};

export function SetList({ sets }: SetListProps) {
  if (sets.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm dark:bg-slate-800">
        <p className="mb-4 text-slate-500">You don&apos;t have any flashcard sets yet.</p>
        <Link href="/sets/new" className="font-semibold text-indigo-600 hover:underline">
          Create your first set →
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sets.map((set) => (
        <li key={set.id}>
          <Link
            href={`/sets/${set.id}`}
            className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md dark:bg-slate-800"
          >
            <div className="flex h-36 items-center justify-center bg-slate-100 dark:bg-slate-700">
              {set.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={set.coverImageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl">🃏</span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <h2 className="font-semibold">{set.title}</h2>
              <p className="text-sm text-slate-500">{set.cardCount} cards</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
