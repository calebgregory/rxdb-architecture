import fs from 'fs'
import path from 'path'
import raw from 'raw.macro'
import YAML from 'yaml'
import mergeDeepRight from 'ramda/src/mergeDeepRight'

/**
 * @todo make the loading here of the yml files look better.
 *
 * the raw.macro only works in a browser environment (unless i'm mistaken about
 * this), so we need an alternative when this file is loaded in a node.js env.
 *
 * furthermore, there's a constraint with using raw.macro: they aren't
 * interpreting the filename string passed to them as a string literal,
 * unfortunately, and that is causing problems. i haven't added console logs to
 * the node_module (which is minified) to see what it thinks our filepath here
 * is. source code
 * [here](https://github.com/pveyes/raw.macro/blob/master/src/macro.js#L165-L166)
 */

function _load(filepath: string): string {
  return fs.readFileSync(path.resolve(__dirname, filepath), 'utf8')
}

const jobs = mergeDeepRight(
  require('./__generated__/jobs.rxschema.json').definitions.Job,
  YAML.parse(process.env.NODE_ENV === 'test'
    ? _load('./jobs.yml')
    : raw('./jobs.yml')
  ),
)

const content = mergeDeepRight(
  require('./__generated__/content.rxschema.json').definitions.Content,
  YAML.parse(process.env.NODE_ENV === 'test'
    ? _load('./content.yml')
    : raw('./content.yml')
  ),
)

export const schema = {
  jobs, content
}
