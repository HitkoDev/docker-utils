#!/usr/bin/env node
import cliui from 'cliui'
import { readdir, readFile, stat } from 'fs/promises'
import { load } from 'js-yaml'
import * as path from 'path'
import { titleCase } from 'title-case'
import * as windowSize from 'window-size'
import yargs from 'yargs'

function resolveDotted(obj: Object, dotted: string) {
    const parts = dotted
        .split('.')
        .map(p => p.trim())
        .map(p => p.match(/^\d+$/) && parseInt(p, 10) || p)

    let v = obj
    parts.forEach(p => v = v && v[p] || undefined)
    return v
}

yargs(process.argv, process.cwd())
    .command('*', 'List resource limits per service', (yargs) => yargs
        .option('dir', {
            alias: 'd',
            default: '.'
        }), async (argv) => {
            const dir = path.normalize(path.resolve(argv.dir))
            const folders = await readdir(dir)
            const composeFiles = await Promise.all(folders
                .map(folder => path.join(dir, folder, 'docker-compose.yml'))
                .map(composeFile => stat(composeFile)
                    .then(stats => stats.isFile && readFile(composeFile, 'utf8') || null)
                    .then(content => [composeFile, content])
                    .catch(() => null as string[])
                )
            )

            const resources = [].concat(...composeFiles
                .filter(file => !!file)
                .map(([file, content]) => [file, load(content) as any])
                .map(([file, config]) => {
                    const services = config && config.services || {}
                    return Object.keys(services)
                        .map(name => ({
                            file,
                            name,
                            cpuLimit: resolveDotted(services[name], 'deploy.resources.limits.cpus') || 0,
                            cpuReservation: resolveDotted(services[name], 'deploy.resources.reservations.cpus') || 0,
                            memLimit: resolveDotted(services[name], 'deploy.resources.limits.memory') || 0,
                            memReservation: resolveDotted(services[name], 'deploy.resources.reservations.memory') || 0
                        }))
                })
            )

            if (resources.length < 1)
                return console.log('No compose files found')

            const columns = Object.keys(resources[0])
            const out = [
                columns.map(c => titleCase(c)).join(' \t'),
                ...resources.map(resource => columns.map(k => resource[k] === undefined ? null : resource[k]).join('    \t'))
            ].join('\n')
            // @ts-ignore
            const ui = cliui({ width: windowSize.get().width })
            ui.div(out)

            console.log(ui.toString())
        })
    .argv
