import { SubwayData, QuizQuestion } from '../types/subway';

/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Escolhe um elemento aleatório de um array
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gera uma questão de quiz
 */
export function generateQuizQuestion(
  subwayData: SubwayData,
  numberOfOptions: number = 4
): QuizQuestion {
  const lines = Object.keys(subwayData);
  const randomLine = randomChoice(lines);
  const stations = subwayData[randomLine];
  const correctStation = randomChoice(stations);

  // Pegar estações de outras linhas para as opções incorretas
  const incorrectStations: string[] = [];
  const otherLines = lines.filter((line) => line !== randomLine);

  // Criar lista de todas as estações que NÃO pertencem à linha em questão
  const availableIncorrectStations: string[] = [];
  otherLines.forEach((line) => {
    subwayData[line].forEach((station) => {
      // Só adicionar se NÃO estiver na linha atual (evita baldeações)
      if (!stations.includes(station) && !availableIncorrectStations.includes(station)) {
        availableIncorrectStations.push(station);
      }
    });
  });

  // Selecionar estações incorretas aleatoriamente
  const shuffledIncorrect = shuffleArray(availableIncorrectStations);
  for (let i = 0; i < Math.min(numberOfOptions - 1, shuffledIncorrect.length); i++) {
    incorrectStations.push(shuffledIncorrect[i]);
  }

  // Combinar e embaralhar
  const allOptions = shuffleArray([correctStation, ...incorrectStations]);

  return {
    line: randomLine,
    correctStation,
    options: allOptions,
  };
}
