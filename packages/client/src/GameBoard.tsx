import { useComponentValue } from '@latticexyz/react';
import { Entity } from '@latticexyz/recs';
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

  const playerPosition = useComponentValue(Position, playerEntity);
  const player =
    playerEntity && playerPosition
      ? {
          x: playerPosition.x,
          y: playerPosition.y,
          emoji: '👾',
          entity: playerEntity,
        }
      : null;

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
      players={player ? [player] : []}
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
