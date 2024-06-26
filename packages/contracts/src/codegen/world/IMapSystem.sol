// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

import { Direction } from "./../common.sol";

/**
 * @title IMapSystem
 * @author MUD (https://mud.dev) by Lattice (https://lattice.xyz)
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IMapSystem {
  error ALREADY_SPAWNED(address player);
  error NOT_MOVABLE(address player);
  error OBSTRUCTED(int32 x, int32 y);
  error CANNOT_MOVE_DURING_ENCOUNTER();

  function spawn(int32 x, int32 y) external;

  function move(Direction direction) external;
}
