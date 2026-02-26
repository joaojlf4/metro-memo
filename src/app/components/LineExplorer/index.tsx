'use client';

import { useState } from 'react';
import { SubwayData } from '@/core/types';
import { LINE_COLORS } from '@/core/constants/subway';
import { BackButton } from '../BackButton';
import { Wrapper } from '../Wrapper';

type LineExplorerProps = {
  subwayData: SubwayData;
  onExit: () => void;
};

export function LineExplorer({ subwayData, onExit }: LineExplorerProps) {
  const [expandedLine, setExpandedLine] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // Encontrar todas as estações que aparecem em mais de uma linha (baldeações)
  const transferStations = new Set<string>();
  const stationCount: Record<string, number> = {};

  Object.values(subwayData).forEach((stations) => {
    stations.forEach((station) => {
      stationCount[station] = (stationCount[station] || 0) + 1;
    });
  });

  Object.entries(stationCount).forEach(([station, count]) => {
    if (count > 1) {
      transferStations.add(station);
    }
  });

  const toggleLine = (lineName: string) => {
    setExpandedLine(expandedLine === lineName ? null : lineName);
  };

  const getLinesForStation = (station: string): string[] => {
    const lines: string[] = [];
    Object.entries(subwayData).forEach(([lineName, stations]) => {
      if (stations.includes(station)) {
        lines.push(lineName);
      }
    });
    return lines;
  };

  const handleStationClick = (station: string, isTransfer: boolean) => {
    if (isTransfer) {
      setSelectedStation(selectedStation === station ? null : station);
    }
  };

  return (
    <Wrapper>
      <div className="flex gap-3 items-center w-full">
        <BackButton onClick={onExit} />
        <h2 className="text-lg font-medium">Explorar Linhas</h2>
      </div>

      <div className="w-full border-2 border-gray-300 p-4">
        <p className="text-sm text-gray-300">
          <span className="font-medium">Legenda:</span> Estações em{' '}
          <span className="font-bold">negrito</span> são baldeações (conexão entre linhas)
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {Object.entries(subwayData).map(([lineName, stations]) => {
          const isExpanded = expandedLine === lineName;
          const lineColor = LINE_COLORS[lineName];

          return (
            <div key={lineName} className="border-2 border-gray-800 w-full">
              {/* Cabeçalho da linha */}
              <button
                onClick={() => toggleLine(lineName)}
                className="w-full px-4 py-3 flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-800"
                style={{
                  borderLeft: `8px solid ${lineColor?.color || '#000'}`,
                }}
              >
                <span className="font-medium">{lineName}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">
                    {stations.length} estações
                  </span>
                  <span className="text-xl">{isExpanded ? '−' : '+'}</span>
                </div>
              </button>

              {/* Lista de estações expandida */}
              {isExpanded && (
                <div className="border-t-2 border-gray-300 bg-neutral-900">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 p-4">
                    {stations.map((station, index) => {
                      const isTransfer = transferStations.has(station);
                      const isSelected = selectedStation === station;
                      
                      return (
                        <div
                          key={`${station}-${index}`}
                          className="text-sm py-1 relative"
                        >
                          <span className="text-gray-500 mr-2">{index + 1}.</span>
                          <span 
                            className={`${isTransfer ? 'font-bold underline cursor-pointer hover:text-gray-300' : ''}`}
                            onClick={() => handleStationClick(station, isTransfer)}
                          >
                            {station}
                          </span>
                          
                          {/* Popup de baldeações */}
                          {isTransfer && isSelected && (
                            <div className="absolute left-0 top-full mt-1 z-10 bg-white border-2 border-gray-800 p-3 shadow-lg min-w-50">
                              <p className="text-xs font-medium mb-2 text-gray-800">Conexões:</p>
                              <div className="flex flex-col gap-1">
                                {getLinesForStation(station).map((line) => {
                                  const color = LINE_COLORS[line];
                                  return (
                                    <div 
                                      key={line}
                                      className="flex items-center gap-2 text-gray-800"
                                    >
                                      <div 
                                        className="w-3 h-3 border border-gray-800"
                                        style={{ backgroundColor: color?.color }}
                                      />
                                      <span className="text-xs">{line}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
}
