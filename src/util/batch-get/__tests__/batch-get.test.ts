import { Subject } from 'rxjs'
import { id, wait } from '~/src/util/testing'
import { addToBatch } from '../batch-get'

describe('addToBatch', () => {
  it('sets a ref to be a subject if ref is currently null', () => {
    let ref = { current: null }
    addToBatch((_ids) => {}, 100, 1, ref, "id")
    expect(ref).not.toBeNull()
  })

  it('uses existing subject ref if it exists', () => {
    let ref = { current: new Subject<string>() }

    const observer = jest.fn()
    ref.current.subscribe(observer)

    const _id = id()

    addToBatch((_ids) => {}, 100, 1, ref, _id)
    expect(observer).toHaveBeenCalledWith(_id)
  })

  it('creates a new subject if existing subject-ref has already been completed', () => {
    let ref = { current: new Subject<string>() }
    ref.current.complete()
    const refCopy = ref.current

    addToBatch((_ids) => {}, 100, 1, ref, "id")
    expect(refCopy).not.toEqual(ref.current) // ref reassigned to refer to a new Subject
  })

  it('batches calls, then calls func once with array of arguments from calls', async () => {
    expect.assertions(1)

    let ref = { current: null }

    const func = jest.fn()
    const ids = new Array(5).fill(0).map(() => id())

    ids.forEach(id => addToBatch(func, 100, 10, ref, id))
    await wait(101)

    expect(func).toHaveBeenCalledWith(ids)
  })
})
