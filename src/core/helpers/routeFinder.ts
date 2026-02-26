import { SubwayData, Route, RouteSegment } from '../types/subway';

type GraphNode = {
  station: string;
  line: string;
};

type GraphEdge = {
  from: GraphNode;
  to: GraphNode;
  isTransfer: boolean;
};

/**
 * Constrói o grafo de conexões do metrô
 */
function buildGraph(subwayData: SubwayData): Map<string, GraphEdge[]> {
  const graph = new Map<string, GraphEdge[]>();
  
  // Adicionar conexões sequenciais dentro de cada linha
  Object.entries(subwayData).forEach(([lineName, stations]) => {
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      const nodeKey = `${station}|${lineName}`;
      
      if (!graph.has(nodeKey)) {
        graph.set(nodeKey, []);
      }
      
      // Conectar com estação anterior
      if (i > 0) {
        const prevStation = stations[i - 1];
        const prevNodeKey = `${prevStation}|${lineName}`;
        
        graph.get(nodeKey)!.push({
          from: { station, line: lineName },
          to: { station: prevStation, line: lineName },
          isTransfer: false,
        });
      }
      
      // Conectar com próxima estação
      if (i < stations.length - 1) {
        const nextStation = stations[i + 1];
        const nextNodeKey = `${nextStation}|${lineName}`;
        
        graph.get(nodeKey)!.push({
          from: { station, line: lineName },
          to: { station: nextStation, line: lineName },
          isTransfer: false,
        });
      }
    }
  });
  
  // Adicionar conexões de baldeação (mesmo nome de estação em linhas diferentes)
  const stationsByName = new Map<string, string[]>();
  
  Object.entries(subwayData).forEach(([lineName, stations]) => {
    stations.forEach((station) => {
      if (!stationsByName.has(station)) {
        stationsByName.set(station, []);
      }
      stationsByName.get(station)!.push(lineName);
    });
  });
  
  stationsByName.forEach((lines, station) => {
    if (lines.length > 1) {
      // Esta estação tem baldeação
      for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines.length; j++) {
          if (i !== j) {
            const fromKey = `${station}|${lines[i]}`;
            const toKey = `${station}|${lines[j]}`;
            
            if (!graph.has(fromKey)) {
              graph.set(fromKey, []);
            }
            
            graph.get(fromKey)!.push({
              from: { station, line: lines[i] },
              to: { station, line: lines[j] },
              isTransfer: true,
            });
          }
        }
      }
    }
  });
  
  return graph;
}

/**
 * Encontra todas as rotas mais curtas entre duas estações usando BFS
 * PENALIZAÇÃO: Cada baldeação conta como 3 estações (peso = 3)
 * Estações na mesma linha contam como 1 estação (peso = 1)
 */
export function findBestRoutes(
  subwayData: SubwayData,
  fromStation: string,
  toStation: string
): Route[] {
  const graph = buildGraph(subwayData);
  
  // PESO DA BALDEAÇÃO: Cada troca de linha = 3 estações
  const TRANSFER_WEIGHT = 3;
  const STATION_WEIGHT = 1;
  
  // Encontrar todas as linhas que contêm a estação de origem
  const fromLines: string[] = [];
  Object.entries(subwayData).forEach(([lineName, stations]) => {
    if (stations.includes(fromStation)) {
      fromLines.push(lineName);
    }
  });
  
  // Encontrar todas as linhas que contêm a estação de destino
  const toLines: string[] = [];
  Object.entries(subwayData).forEach(([lineName, stations]) => {
    if (stations.includes(toStation)) {
      toLines.push(lineName);
    }
  });
  
  if (fromLines.length === 0 || toLines.length === 0) {
    return [];
  }
  
  // BFS para encontrar todos os caminhos mais curtos (considerando peso de baldeações)
  const queue: { node: GraphNode; path: GraphNode[]; cost: number }[] = [];
  const visited = new Map<string, number>(); // nodeKey -> custo mínimo
  let shortestCost = Infinity;
  const allPaths: GraphNode[][] = [];
  
  // Inicializar a fila com todos os nós de origem
  fromLines.forEach((line) => {
    const startNode = { station: fromStation, line };
    const startKey = `${fromStation}|${line}`;
    queue.push({ node: startNode, path: [startNode], cost: 0 });
    visited.set(startKey, 0);
  });
  
  while (queue.length > 0) {
    const { node, path, cost } = queue.shift()!;
    const nodeKey = `${node.station}|${node.line}`;
    
    // Se já encontramos caminhos com custo menor, não precisamos continuar explorando este
    if (cost > shortestCost) {
      continue;
    }
    
    // Verificar se chegamos ao destino
    if (node.station === toStation) {
      if (cost < shortestCost) {
        shortestCost = cost;
        allPaths.length = 0; // Limpar caminhos mais caros
        allPaths.push([...path]);
      } else if (cost === shortestCost) {
        allPaths.push([...path]);
      }
      continue;
    }
    
    // Explorar vizinhos
    const edges = graph.get(nodeKey) || [];
    
    for (const edge of edges) {
      const nextKey = `${edge.to.station}|${edge.to.line}`;
      
      // Calcular custo: baldeação = 3, estação normal = 1
      const edgeCost = edge.isTransfer ? TRANSFER_WEIGHT : STATION_WEIGHT;
      const nextCost = cost + edgeCost;
      
      // Só visitar se não visitamos ainda ou se encontramos um caminho de mesmo custo
      if (!visited.has(nextKey) || visited.get(nextKey)! >= nextCost) {
        visited.set(nextKey, nextCost);
        queue.push({
          node: edge.to,
          path: [...path, edge.to],
          cost: nextCost,
        });
      }
    }
  }
  
  // Converter caminhos para rotas
  const routes: Route[] = allPaths.map((path) => {
    const segments: RouteSegment[] = path.map((node, index) => {
      let isTransfer = false;
      
      // Verificar se há mudança de linha
      if (index > 0 && path[index - 1].line !== node.line) {
        isTransfer = true;
      }
      
      return {
        station: node.station,
        line: node.line,
        isTransfer,
      };
    });
    
    return {
      segments,
      totalStations: path.length,
    };
  });
  
  return routes;
}

/**
 * Obtém todas as estações únicas do sistema
 */
export function getAllStations(subwayData: SubwayData): string[] {
  const allStations = new Set<string>();
  
  Object.values(subwayData).forEach((stations) => {
    stations.forEach((station) => allStations.add(station));
  });
  
  return Array.from(allStations).sort();
}
