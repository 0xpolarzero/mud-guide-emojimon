import { useComponentValue, useEntityQuery } from '@latticexyz/react';
import { Entity, Has, getComponentValueStrict } from '@latticexyz/recs';
import { singletonEntity } from '@latticexyz/store-sync/recs';
import { hexToArray } from '@latticexyz/utils';
import { GameMap } from './GameMap';
import { EncounterScreen } from './EncounterScreen';
import { TerrainType, terrainTypes } from './terrainTypes';
import { MonsterType, monsterTypes } from './monsterTypes';
import { useMUD } from './MUDContext';
import { useKeyboardMovement } from './useKeyboardMovement';

export const GameBoard = () => {
  useKeyboardMovement();

  const {
    components: { Encounter, MapConfig, Monster, Player, Position },
    network: { playerEntity },
    systemCalls: { spawn },
  } = useMUD();

  const encounter = useComponentValue(Encounter, playerEntity);
  const monsterType = useComponentValue(
    Monster,
    encounter ? (encounter.monster as Entity) : undefined
  )?.value;
  const monster =
    monsterType != null && monsterType in MonsterType
      ? monsterTypes[monsterType as MonsterType]
      : null;

  /* --------------------------------- PLAYER --------------------------------- */
  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;

  const players = useEntityQuery([Has(Player), Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    return {
      entity,
      x: position.x,
      y: position.y,
      emoji: entity === playerEntity ? '👾' : '🥸',
    };
  });

  /* --------------------------------- TERRAIN -------------------------------- */
  const mapConfig = useComponentValue(MapConfig, singletonEntity);
  if (mapConfig == null) {
    throw new Error(
      'map config not set or not ready, only use this hook after loading state === LIVE'
    );
  }

  const { width, height, terrain: terrainData } = mapConfig;
  const terrain = Array.from(hexToArray(terrainData)).map((value, index) => {
    const { emoji } =
      value in TerrainType ? terrainTypes[value as TerrainType] : { emoji: '' };
    return {
      x: index % width,
      y: Math.floor(index / width),
      emoji,
    };
  });

  return (
    <GameMap
      width={width}
      height={height}
      terrain={terrain}
      onTileClick={canSpawn ? spawn : undefined}
      players={players}
      encounter={
        encounter ? (
          <EncounterScreen
            monsterName={monster?.name ?? 'MissingNo'}
            monsterEmoji={monster?.emoji ?? '💱'}
          />
        ) : undefined
      }
    />
  );
};
