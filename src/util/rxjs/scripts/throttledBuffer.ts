import { interval } from 'rxjs'
import { take, tap } from 'rxjs/operators'
import { throttledBuffer } from '../operators'

require('debug').enable('*')
const log = require('~/src/logger').logger('thrb')

const src$ = interval(100).pipe(take(20))
src$.pipe(
  tap(x => log.info('in', x)),
  throttledBuffer(1500, 50)
)
  .subscribe((val) => {
    log.info('>', val)
  })
