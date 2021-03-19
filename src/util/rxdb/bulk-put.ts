import { RxCollection } from 'rxdb'
import map from 'ramda/src/map'
import partition from 'ramda/src/partition'
import pipe from 'ramda/src/pipe'
import { stripGqlFields } from '~/src/util/gql'

export async function bulkPut(collection: RxCollection<any>, items: {id: string}[]) {
  const ids = items.map((j: any) => j.id)
  const itemsAlreadyInCollById: Map<string, any> = await collection.findByIds(ids)
  const [itemsToUpsert, itemsToInsert] = pipe(
    map(stripGqlFields),
    partition(j => itemsAlreadyInCollById.has(j.id))
  )(items)

  await Promise.all([
    // https://rxdb.info/rx-collection.html#atomicupsert; sadly no batch
    // operation available
    ...itemsToUpsert.map((items) => collection.atomicUpsert(items)),
    // https://rxdb.info/rx-collection.html#bulkinsert
    collection.bulkInsert(itemsToInsert)
  ])
}
