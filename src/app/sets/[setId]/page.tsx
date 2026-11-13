import Link from "next/link";
import { DeleteSetButton } from "@/features/flashcards/components/DeleteSetButton";
import { loadSetOrNotFound } from "./load-set";

export default async function SetOverviewPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  const set = await loadSetOrNotFound(setId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{set.title}</h1>
        {set.description && <p className="mt-2 text-slate-500">{set.description}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StudyModeLink href={`/sets/${set.id}/flashcards`} emoji="🃏" title="Flashcards" subtitle="Flip and review" />
        <StudyModeLink href={`/sets/${set.id}/learn`} emoji="🧠" title="Learn" subtitle="Quiz yourself" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Terms in this set ({set.cards.length})</h2>
        <div className="flex gap-2">
          <Link href={`/sets/${set.id}/edit`} className="rounded-lg px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950">
            ✏️ Edit
          </Link>
          <DeleteSetButton setId={set.id} />
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {set.cards.map((card) => (
          <li key={card.id} className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.imageUrl} alt="" className="h-20 w-20 rounded-lg object-cover" />
            <span className="text-lg font-medium">{card.word}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StudyModeLink({ href, emoji, title, subtitle }: { href: string; emoji: string; title: string; subtitle: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-slate-800">
      <span className="text-3xl">{emoji}</span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="text-sm text-slate-500">{subtitle}</span>
      </span>
    </Link>
  );
}
