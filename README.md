# Emojimon

> Create a Pokémon-inspired on-chain game with [MUD](https://mud.dev/)

### [Read the tutorial on mud.dev &rarr;](https://mud.dev/tutorials/emojimon/)

[![emojimon demo](https://github.com/latticexyz/mud/blob/3fdaa9880639a9546f80fbffdcc4a713178328c1/tutorials/emojimon/images/emojimon-intro.gif?raw=true)](https://mud.dev/tutorials/emojimon/)

## Notes

- Use `dataStruct: false` to return a tuple instead of struct (more ergonomic)

  - e.g. for `Position` return `(x, y)` instead of `Position` struct

- Use `type: "offchainTable"` to create an offchain table item, which will broadcast to the client without storing data onchain
