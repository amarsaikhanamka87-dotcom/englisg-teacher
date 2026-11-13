"use client";

import { useState } from "react";
import type { FlashcardView } from "../flashcard-set.types";
import { buildQuizQuestions, isSameWord, type QuizQuestion } from "../quiz.logic";

type QuizStudyProps = {
  cards: FlashcardView[];
};

type AnswerMode = "choice" | "typing";

type AnswerFeedback = { isCorrect: boolean; givenAnswer: string };

export function QuizStudy({ cards }: QuizStudyProps) {
  const [answerMode, setAnswerMode] = useState<AnswerMode>("choice");
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuizQuestions(cards, cards));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [missedCards, setMissedCards] = useState<FlashcardView[]>([]);
  const [typedAnswer, setTypedAnswer] = useState("");

  const currentQuestion = questions[questionIndex];
  const isFinished = questionIndex >= questions.length;

  function restart(cardsToAsk: FlashcardView[]) {
    setQuestions(buildQuizQuestions(cardsToAsk, cards));
    setQuestionIndex(0);
    setFeedback(null);
    setMissedCards([]);
    setTypedAnswer("");
  }

  function submitAnswer(answer: string) {
    if (feedback || !currentQuestion) return;
    const isCorrect = isSameWord(answer, currentQuestion.card.word);
    setFeedback({ isCorrect, givenAnswer: answer });
    if (!isCorrect) setMissedCards((missed) => [...missed, currentQuestion.card]);
  }

  function goToNextQuestion() {
    setFeedback(null);
    setTypedAnswer("");
    setQuestionIndex((index) => index + 1);
  }

  if (isFinished) {
    const correctCount = questions.length - missedCards.length;
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-800">
        <h2 className="text-3xl font-bold">
          {missedCards.length === 0 ? "🎉 Perfect!" : "Round finished"}
        </h2>
        <p className="text-xl">
          {correctCount} / {questions.length} correct
        </p>
        {missedCards.length > 0 && (
          <div className="w-full">
            <p className="mb-3 font-semibold">Words to practice:</p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {missedCards.map((card) => (
                <li key={card.id} className="flex flex-col items-center gap-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.imageUrl} alt="" className="h-20 w-20 rounded object-cover" />
                  <span className="text-sm font-medium">{card.word}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {missedCards.length > 0 && (
            <PrimaryButton onClick={() => restart(missedCards)}>Practice missed words</PrimaryButton>
          )}
          <SecondaryButton onClick={() => restart(cards)}>Start over</SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold">
          {questionIndex + 1} / {questions.length}
        </span>
        <div className="flex rounded-lg bg-slate-200 p-1 text-sm dark:bg-slate-700">
          <ModeTab isActive={answerMode === "choice"} onClick={() => setAnswerMode("choice")}>
            Multiple choice
          </ModeTab>
          <ModeTab isActive={answerMode === "typing"} onClick={() => setAnswerMode("typing")}>
            Type the word
          </ModeTab>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{ width: `${(questionIndex / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
        <p className="text-sm text-slate-500">What is this?</p>
        <div className="flex aspect-[4/3] max-h-80 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentQuestion.card.imageUrl} alt="Guess the word" className="max-h-full max-w-full object-contain" />
        </div>

        {answerMode === "choice" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {currentQuestion.choices.map((choice) => (
              <ChoiceButton
                key={choice}
                choice={choice}
                correctWord={currentQuestion.card.word}
                feedback={feedback}
                onClick={() => submitAnswer(choice)}
              />
            ))}
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (typedAnswer.trim()) submitAnswer(typedAnswer);
            }}
            className="flex gap-3"
          >
            <input
              autoFocus
              value={typedAnswer}
              onChange={(event) => setTypedAnswer(event.target.value)}
              disabled={feedback !== null}
              placeholder="Type the English word"
              className="flex-1 rounded-lg border-2 border-slate-300 bg-transparent px-4 py-3 text-lg outline-none focus:border-indigo-500 dark:border-slate-600"
            />
            {!feedback && <PrimaryButton type="submit">Check</PrimaryButton>}
          </form>
        )}

        {feedback && (
          <div
            className={`flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3 ${
              feedback.isCorrect
                ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
            }`}
          >
            <span>
              {feedback.isCorrect ? "✅ Correct!" : (
                <>
                  ❌ The answer is <strong>{currentQuestion.card.word}</strong>
                </>
              )}
            </span>
            <PrimaryButton autoFocus onClick={goToNextQuestion}>Continue</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

function ChoiceButton({
  choice,
  correctWord,
  feedback,
  onClick,
}: {
  choice: string;
  correctWord: string;
  feedback: AnswerFeedback | null;
  onClick: () => void;
}) {
  let stateClass = "border-slate-300 hover:border-indigo-500 dark:border-slate-600";
  if (feedback) {
    if (isSameWord(choice, correctWord)) stateClass = "border-green-500 bg-green-50 dark:bg-green-950";
    else if (choice === feedback.givenAnswer) stateClass = "border-red-500 bg-red-50 dark:bg-red-950";
    else stateClass = "border-slate-200 opacity-60 dark:border-slate-700";
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={feedback !== null}
      className={`rounded-lg border-2 px-4 py-3 text-left text-lg transition ${stateClass}`}
    >
      {choice}
    </button>
  );
}

function ModeTab({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1 ${isActive ? "bg-white font-semibold shadow dark:bg-slate-900" : ""}`}
    >
      {children}
    </button>
  );
}

function PrimaryButton({
  type = "button",
  autoFocus,
  onClick,
  children,
}: {
  type?: "button" | "submit";
  autoFocus?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      autoFocus={autoFocus}
      onClick={onClick}
      className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-slate-200 px-5 py-3 font-semibold hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
    >
      {children}
    </button>
  );
}
