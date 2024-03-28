// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";

import {Movable, Player, Position} from "../codegen/index.sol";
import {Direction} from "../codegen/common.sol";
import {addressToEntityKey} from "../addressToEntityKey.sol";

contract MapSystem is System {
    error ALREADY_SPAWNED(address player);
    error NOT_MOVABLE(address player);

    function spawn(int32 x, int32 y) public {
        bytes32 player = addressToEntityKey(address(_msgSender()));
        if (Player.get(player)) {
            revert ALREADY_SPAWNED(address(_msgSender()));
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

        Position.set(player, x, y);
    }
}
