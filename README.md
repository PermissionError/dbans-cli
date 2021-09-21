# DBans - Discord Bans Utilities

## Prerequisites
[Node.js & NPM](https://nodejs.org/en/download/)  
A [Discord Bot Token](https://discord.dev)

## Installation
### ~~Using the Release Convenience Binaries~~
~~Download the appropriate executable for your platform from [GitHub Releases](https://github.com/PermissionError/dbans-cli/releases).~~ **The convenience binaries are unable to be produced due to tooling issues.**
### With Node Package Managers
`npm i dbans-cli -g` or `yarn global add dbans-cli`  
Note: Yarn may require you to `chmod +x` the executable file. Therefore, it is recommended to install DBans with NPM ~~or use the convenience binaries provided with releases~~.

## Usage
First, use `dbans token [token]` to set the bot token. It must have the `BAN_MEMBERS` permission on all guilds that you wish to access with DBans.  

This token will be persisted in your local storage. You can view it at any time with `dbans token` or replace it.

### Exporting: `dbans export <guildId> [outputFile]`
Exports all bans from the given guild to a JSON array. If `outputFile` is not specified, the array will be printed to stdout.  
Sample output: `["00000000000000000", "00000000000000001"]`

### Importing: `dbans import <guildId> [bansOrFile]`
Imports bans into the given guild from the given input.  `bansOrFile` can be a JSON array of bans from stdin as exported by `dbans export` or a file path to an exported bans file.

### Transfer: `dbans transfer <fromGuildId> <toGuildId>`
Transfers **all bans** from one guild to another.