#!/usr/bin/env node

import storage from 'node-persist';
import {Command} from 'commander/esm.mjs';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {writeFile, readFileSync} from 'fs';

//It is here that I shall express my unrelenting hatred of weird tooling quirks. Why doesn't pkg support top-level awaits?
storage.init().then(() => {
    const cli = new Command();
    cli
        .version('1.0.0');
    cli
        .command('token [token]')
        .description('Views the current saved bot token or sets a new token')
        .action(async (token) => {
            if(!token) {
                console.log((await storage.getItem('token')) ?? 'N/A');
            } else {
                const rest = new REST({version: '9'}).setToken(token);
                try {
                    await rest.get(
                        Routes.user('@me')
                    );
                } catch (e) {
                    console.log('Invalid token.');
                    return;
                }
                await storage.setItem('token', token);
                console.log(`New token set to ${token}`);
            }
        });
    cli
        .command('export <guildId> [outputFile]')
        .description('Exports banned User IDs to the outputFile specified, or to stdout')
        .action(async (guildId, outputFile) => {
            const rest = new REST({version: '9'}).setToken(await storage.getItem('token'));
            if(!(await checkToken(rest))) {
                console.log('Please use `dbans token` to set a valid bot token first.');
                return;
            }
            console.log(`Fetching bans for guild ${guildId}...`);
            let bans = await rest.get(
                Routes.guildBans(guildId)
            );
            console.log(`Found ${bans.length} bans. Exporting...`);
            let results = [];
            bans.forEach((v) => {
                results.push(v.user.id);
            })
            results = JSON.stringify(results);
            if(!outputFile) {
                console.log(`Bans for guild ${guildId}:`)
                console.log(results);
            } else {
                writeFile(outputFile, results, (err) => {
                    if (err) throw err;
                    console.log(`Bans for guild ${guildId} saved to ${outputFile}.`);
                })
            }
        });
    cli
        .command('transfer <fromGuildId> <toGuildId>')
        .description('Transfer all bans from one guild to another')
        .action(async (fromGuildId, toGuildId) => {
            const rest = new REST({version: '9'}).setToken(await storage.getItem('token'));
            if(!(await checkToken(rest))) {
                console.log('Please use `dbans token` to set a valid bot token first.');
                return;
            }
            console.log(`Fetching bans for guild ${fromGuildId}...`);
            let bans = await rest.get(
                Routes.guildBans(fromGuildId)
            );
            console.log(`Found ${bans.length} bans.`);
            console.log(`Applying bans to guild ${toGuildId}...`);
            for (const v of bans) {
                console.log(`Banning user ${v.user.username}#${v.user.discriminator}...`)
                await rest.put(
                    Routes.guildBan(toGuildId, v.user.id),
                    {reason: v.reason}
                )
            }
            console.log(`Successfully transferred all bans from ${fromGuildId} to ${toGuildId}.`);
        });
    cli
        .command('import <guildId> <bansOrFile>')
        .description('Imports a list of bans exported by this utility. Input a JSON array of bans or a file path.')
        .action(async (guildId, bansOrFile) => {
            const rest = new REST({version: '9'}).setToken(await storage.getItem('token'));
            if(!(await checkToken(rest))) {
                console.log('Please use `dbans token` to set a valid bot token first.');
                return;
            }
            let bans;
            try {
                bans = JSON.parse(bansOrFile);
            } catch (e) {
                try {
                    bans = JSON.parse(readFileSync(bansOrFile));
                } catch (e) {
                    console.log('Input argument is not a JSON array or valid file path.');
                    return;
                }
            }
            for(const v of bans) {
                console.log(`Banning user ID ${v}...`)
                await rest.put(
                    Routes.guildBan(guildId, v),
                    {reason: 'DBans importer'}
                )
            }
            console.log(`Successfully imported ${bans.length} bans for guild ${guildId}.`);
        });

    const checkToken = async (rest) => {
        if(!(await storage.getItem('token'))) {
            return false
        }
        try {
            await rest.get(
                Routes.user('@me')
            );
        } catch (e) {
            return false;
        }
        return true;
    }

    cli.parse(process.argv);
});