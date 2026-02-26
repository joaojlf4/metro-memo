'use client';

import { useState } from 'react';
import { SubwayData, Route } from '@/core/types';
import { findBestRoutes, getAllStations } from '@/core/helpers';
import { LINE_COLORS } from '@/core/constants/subway';
import { BackButton } from '../BackButton';
import { Wrapper } from '../Wrapper';
import { StationSearch } from '../StationSearch';

type RouteFinderGameProps = {
  subwayData: SubwayData;
  onExit: () => void;
};

type SelectedStation = {
  station: string;
  line: string;
} | null;

export function RouteFinderGame({ subwayData, onExit }: RouteFinderGameProps) {
  const [fromStation, setFromStation] = useState<string | null>(null);
  const [toStation, setToStation] = useState<string | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState(0);

  const allStations = getAllStations(subwayData);

  const handleFromSelect = (station: string) => {
    setFromStation(station);
    setToStation(null);
    setRoutes([]);
  };

  const handleToSelect = (station: string) => {
    if (!fromStation || station === fromStation) {
      return;
    }

    setToStation(station);
    const foundRoutes = findBestRoutes(subwayData, fromStation, station);
    setRoutes(foundRoutes);
    setSelectedRoute(0);
  };

  const handleReset = () => {
    setFromStation(null);
    setToStation(null);
    setRoutes([]);
    setSelectedRoute(0);
  };

  const renderRoute = (route: Route) => {
    const segmentsByLine: { line: string; stations: string[]; startIndex: number }[] = [];
    let currentLine = route.segments[0]?.line;
    let currentStations: string[] = [];
    let startIndex = 0;

    route.segments.forEach((segment, index) => {
      if (segment.line !== currentLine) {
        segmentsByLine.push({
          line: currentLine,
          stations: [...currentStations],
          startIndex,
        });
        currentLine = segment.line;
        currentStations = [segment.station];
        startIndex = index;
      } else {
        currentStations.push(segment.station);
      }
    });

    if (currentStations.length > 0) {
      segmentsByLine.push({
        line: currentLine,
        stations: currentStations,
        startIndex,
      });
    }

    return (
      <div className="flex flex-col gap-6">
        {segmentsByLine.map((lineSegment, segmentIndex) => {
          const lineColor = LINE_COLORS[lineSegment.line];

          return (
            <div key={segmentIndex} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 border-2 border-gray-800"
                  style={{ backgroundColor: lineColor?.color }}
                />
                <span className="text-sm font-medium">{lineSegment.line}</span>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="relative inline-flex items-center gap-1">
                  {/* Linha contínua de fundo */}
                  <div 
                    className="absolute left-0 right-0 h-1"
                    style={{ 
                      backgroundColor: lineColor?.color,
                      zIndex: 0,
                      top: '0.6875rem',
                    }}
                  />
                  
                  {lineSegment.stations.map((station, stationIndex) => {
                  const globalIndex = lineSegment.startIndex + stationIndex;
                  const segment = route.segments[globalIndex];
                  const isTransfer = segment.isTransfer;
                  const isFirst = globalIndex === 0;
                  const isLast = globalIndex === route.segments.length - 1;

                  // Se for transfer, pegar a cor da linha de origem (anterior)
                  const transferFromLine = isTransfer && globalIndex > 0 
                    ? route.segments[globalIndex - 1].line 
                    : null;
                  const transferFromColor = transferFromLine 
                    ? LINE_COLORS[transferFromLine]?.color 
                    : null;

                  return (
                    <div key={stationIndex} className="flex items-center relative" style={{ zIndex: 1 }}>
                      <div className="flex flex-col items-center gap-1 min-w-max px-2">
                        <div
                          className="rounded-full border-4 w-6 h-6"
                          style={{
                            backgroundColor: lineColor?.color,
                            borderColor: isTransfer && transferFromColor
                              ? transferFromColor
                              : lineColor?.color,
                          }}
                        />
                        <span
                          className={`text-xs text-center ${
                            isFirst || isLast ? 'font-medium' : ''
                          }`}
                        >
                          {station}
                        </span>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          );
        })}


        <div className="border-2 border-gray-800 p-4">
          <p className="text-sm">
            <span className="font-medium">Total:</span> {route.totalStations} estações
          </p>
          <p className="text-sm">
            <span className="font-medium">Baldeações:</span>{' '}
            {route.segments.filter((s) => s.isTransfer).length}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Wrapper>
      <div className="flex justify-between items-center w-full max-w-4xl">
        <BackButton onClick={onExit} />
        <h2 className="text-2xl font-medium">Melhor Rota</h2>
        <div className="w-24"></div>
      </div>

      <div className="w-full max-w-4xl border-2 border-gray-300 p-4">
        <p className="text-sm text-gray-300">
          <span className="font-medium">Como usar:</span> Selecione a estação de origem e
          depois a estação de destino para calcular a melhor rota.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Estação de Origem (A)</label>
          <StationSearch
            key={`from-${fromStation || 'empty'}`}
            stations={allStations}
            onSelect={handleFromSelect}
            placeholder="Digite a estação de origem..."
          />
          {fromStation && (
            <p className="text-sm text-green-500">✓ Origem: {fromStation}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Estação de Destino (B)</label>
          <StationSearch
            key={`to-${toStation || fromStation || 'empty'}`}
            stations={allStations.filter((s) => s !== fromStation)}
            onSelect={handleToSelect}
            placeholder="Digite a estação de destino..."
          />
          {toStation && (
            <p className="text-sm text-red-500">✓ Destino: {toStation}</p>
          )}
        </div>
      </div>

      {routes.length > 0 && (
        <div className="flex flex-col gap-4 w-full max-w-4xl">
          {routes.length > 1 && (
            <div className="border-2 border-gray-800 p-4">
              <p className="text-sm mb-2 font-medium">
                Encontradas {routes.length} rotas com o mesmo tamanho:
              </p>
              <div className="flex gap-2 flex-wrap">
                {routes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRoute(index)}
                    className={`cursor-pointer px-4 py-2 border-2 transition-colors ${
                      selectedRoute === index
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Rota {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-2 border-gray-800 p-6">
            {renderRoute(routes[selectedRoute])}
          </div>

          <button
            onClick={handleReset}
            className="cursor-pointer px-6 py-3 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors font-medium"
          >
            Nova Busca
          </button>
        </div>
      )}

      {fromStation && toStation && routes.length === 0 && (
        <div className="w-full max-w-4xl border-2 border-red-800 p-4">
          <p className="text-red-800">Nenhuma rota encontrada entre essas estações.</p>
        </div>
      )}
    </Wrapper>
  );
}
