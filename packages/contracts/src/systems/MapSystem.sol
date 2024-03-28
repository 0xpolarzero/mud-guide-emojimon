// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";

import {MapConfig, Movable, Obstruction, Player, Position} from "../codegen/index.sol";
import {Direction} from "../codegen/common.sol";

import {addressToEntityKey} from "../addressToEntityKey.sol";
import {positionToEntityKey} from "../positionToEntityKey.sol";

contract MapSystem is System {
    error ALREADY_SPAWNED(address player);
    error NOT_MOVABLE(address player);
    error OBSTRUCTED(int32 x, int32 y);

    function spawn(int32 x, int32 y) public {
        bytes32 player = addressToEntityKey(address(_msgSender()));
        if (Player.get(player)) {
            revert ALREADY_SPAWNED(address(_msgSender()));
        }

        // Constrain position to map size, wrapping around if necessary
        (uint32 width, uint32 height,) = MapConfig.get();
        x = (x + int32(width)) % int32(width);
        y = (y + int32(height)) % int32(height);

        bytes32 position = positionToEntityKey(x, y);
        if (Obstruction.get(position)) {
            revert OBSTRUCTED(x, y);
        }

        Player.set(player, true);
        Position.set(player, x, y);
        Movable.set(player, true);
    }

    function move(Direction direction) public {
        bytes32 player = addressToEntityKey(_msgSender());
        if (!Movable.get(player)) {
            revert NOT_MOVABLE(_msgSender());
        }

        (int32 x, int32 y) = Position.get(player);
        if (direction == Direction.North) {
            y -= 1;
        } else if (direction == Direction.East) {
            x += 1;
        } else if (direction == Direction.South) {
            y += 1;
        } else if (direction == Direction.West) {
            x -= 1;
        }

        // Constrain position to map size, wrapping around if necessary
        (uint32 width, uint32 height,) = MapConfig.get();
        x = (x + int32(width)) % int32(width);
        y = (y + int32(height)) % int32(height);

        bytes32 position = positionToEntityKey(x, y);
        if (Obstruction.get(position)) {
            revert OBSTRUCTED(x, y);
        }

        Position.set(player, x, y);
    }
}
