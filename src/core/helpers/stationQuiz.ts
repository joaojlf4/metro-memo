import { SubwayData, StationQuizQuestion } from '../types/subway';

/**
 * Embaralha um array usando Fisher-Yates
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Encontra todas as linhas que passam por uma estação
 */
function getLinesForStation(subwayData: SubwayData, station: string): string[] {
  const lines: string[] = [];
  Object.entries(subwayData).forEach(([lineName, stations]) => {
    if (stations.includes(station)) {
      lines.push(lineName);
    }
  });
  return lines;
}

/**
 * Encontra todas as estações que aparecem em mais de uma linha (baldeações)
 */
function getTransferStations(subwayData: SubwayData): Set<string> {
  const stationCount: Record<string, number> = {};
  
  Object.values(subwayData).forEach((stations) => {
    stations.forEach((station) => {
      stationCount[station] = (stationCount[station] || 0) + 1;
    });
  });

  const transferStations = new Set<string>();
  Object.entries(stationCount).forEach(([station, count]) => {
    if (count > 1) {
      transferStations.add(station);
    }
  });

  return transferStations;
}

/**
 * Gera uma questão de quiz de estação
 */
export function generateStationQuizQuestion(
  subwayData: SubwayData,
  numberOfOptions: number = 4
): StationQuizQuestion {
  // Pegar apenas estações de baldeação (que aparecem em mais de uma linha)
  const transferStations = Array.from(getTransferStations(subwayData));

  // Selecionar uma estação aleatória
  const station = transferStations[Math.floor(Math.random() * transferStations.length)];
  
  // Encontrar as linhas corretas
  const correctLines = getLinesForStation(subwayData, station);
  
  // Pegar linhas incorretas
  const allLines = Object.keys(subwayData);
  const incorrectLines = allLines.filter((line) => !correctLines.includes(line));
  
  // Embaralhar e pegar linhas incorretas suficientes
  const shuffledIncorrect = shuffleArray(incorrectLines);
  const neededIncorrect = Math.max(0, numberOfOptions - correctLines.length);
  const selectedIncorrect = shuffledIncorrect.slice(0, neededIncorrect);
  
  // Combinar e embaralhar
  const allOptions = shuffleArray([...correctLines, ...selectedIncorrect]);

  return {
    station,
    correctLines,
    options: allOptions,
  };
}
