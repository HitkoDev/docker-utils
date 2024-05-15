#!/usr/bin/env node
import { readFile, writeFile } from 'fs'
import { globby } from 'globby'
import { promisify } from 'util'
import yargs from 'yargs'

const readFileP = promisify(readFile)
const writeFileP = promisify(writeFile)

yargs(process.argv, process.cwd())
    .command('*', 'Disable wp cron in files', (yargs) => yargs
        .option('glob', {
            alias: 'g',
            default: ''
        }), async (argv) => {
            const files = await globby(argv.glob)
            await Promise.all(files.map(async file => {
                const content = await readFileP(file, 'utf8')
                const lines = content.split('\n')
                const line = lines.findIndex(l => l.match(/if\s*\(\s*!\s*defined\s*\(\s*["']ABSPATH/i))
                if (line)
                    lines.splice(line, lines.length - line, `if ( ! defined( 'ABSPATH' ) )
        define( 'ABSPATH', dirname( __FILE__ ) . '/' );

define('DISABLE_WP_CRON', true);

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');`)

                await writeFileP(file, Buffer.from(lines.join('\n'), 'utf8'))
            }))
        })
    .argv
