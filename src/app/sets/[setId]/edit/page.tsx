import { SetEditor } from "@/features/flashcards/editor/SetEditor";
import { loadSetOrNotFound } from "../load-set";

export default async function EditSetPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  const set = await loadSetOrNotFound(setId);
  return <SetEditor initialSet={set} />;
}
