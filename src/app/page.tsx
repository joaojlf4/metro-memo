"use client";

import { useState } from "react";
import { MainMenu, QuizSetup, QuizGame, LineExplorer, LineSelect, OrderQuizGame } from "./components";
import { QuizSettings } from "@/core/types";
import subwayData from "../../subway.json";

type AppMode = 'menu' | 'quiz-setup' | 'quiz' | 'explorer' | 'order-quiz-setup' | 'order-quiz';

export default function Home() {
  const [mode, setMode] = useState<AppMode>('menu');
  const [settings, setSettings] = useState<QuizSettings>({
    numberOfOptions: 4,
  });
  const [selectedLine, setSelectedLine] = useState<string>('');

  const handleSelectMode = (selectedMode: 'quiz' | 'explorer' | 'order-quiz') => {
    if (selectedMode === 'quiz') {
      setMode('quiz-setup');
    } else if (selectedMode === 'explorer') {
      setMode('explorer');
    } else if (selectedMode === 'order-quiz') {
      setMode('order-quiz-setup');
    }
  };

  const handleSelectLine = (lineName: string) => {
    setSelectedLine(lineName);
    setMode('order-quiz');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-7xl">
        {mode === 'menu' && (
          <MainMenu onSelectMode={handleSelectMode} />
        )}

        {mode === 'quiz-setup' && (
          <QuizSetup
            settings={settings}
            onSettingsChange={setSettings}
            onStart={() => setMode('quiz')}
          />
        )}

        {mode === 'quiz' && (
          <QuizGame
            subwayData={subwayData}
            numberOfOptions={settings.numberOfOptions}
            onExit={() => setMode('menu')}
          />
        )}

        {mode === 'explorer' && (
          <LineExplorer
            subwayData={subwayData}
            onExit={() => setMode('menu')}
          />
        )}

        {mode === 'order-quiz-setup' && (
          <LineSelect
            subwayData={subwayData}
            onSelectLine={handleSelectLine}
            onExit={() => setMode('menu')}
          />
        )}

        {mode === 'order-quiz' && (
          <OrderQuizGame
            subwayData={subwayData}
            lineName={selectedLine}
            numberOfOptions={settings.numberOfOptions}
            onExit={() => setMode('menu')}
          />
        )}
      </div>
    </div>
  );
}