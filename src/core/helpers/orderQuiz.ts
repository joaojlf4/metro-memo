import { SubwayData, OrderQuizQuestion } from '../types/subway';
import { shuffleArray } from './quiz';

/**
 * Gera uma questão de quiz de ordem
 */
export function generateOrderQuizQuestion(
  subwayData: SubwayData,
  lineName: string,
  currentPosition: number,
  numberOfOptions: number = 4
): OrderQuizQuestion {
  const stations = subwayData[lineName];
  const correctStation = stations[currentPosition];

  // Pegar estações incorretas da MESMA linha (mas não na posição correta e não anteriores)
  const incorrectStations: string[] = [];
  const availableStations = stations.filter((_, index) => 
    index !== currentPosition && index > currentPosition
  );

  // Embaralhar e pegar as primeiras N-1 estações
  const shuffled = shuffleArray(availableStations);
  for (let i = 0; i < Math.min(numberOfOptions - 1, shuffled.length); i++) {
    incorrectStations.push(shuffled[i]);
  }

  // Combinar e embaralhar
  const allOptions = shuffleArray([correctStation, ...incorrectStations]);

  return {
    line: lineName,
    correctStation,
    options: allOptions,
    currentPosition,
  };
}
