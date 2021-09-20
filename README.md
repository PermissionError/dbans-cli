# DBans - Discord Bans Utilities

## Installation
### Using the Release Convenience Binaries
Download the appropriate executable for your platform from [GitHub Releases](https://github.com/PermissionError/dbans-cli/releases).
### With Node Package Managers
`npm i dbans-cli -g` or `yarn global add dbans-cli`
Note: Yarn may require you to `chmod +x` the executable file. Therefore, it is recommended to install DBans with NPM or use the convenience binaries provided with releases.

## Setup
First, use `dbans token [token]` to set the bot token. It must have the `BAN_MEMBERS` permission on all guilds that you wish to access with DBans.  

This token will be persisted in your local storage. You can view it at any time with `dbans token` and replace it.