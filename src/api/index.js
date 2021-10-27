export function fetchItem (id) {
  const Items = [
    { name: 'item1', id: 1 },
    { name: 'item2', id: 2 },
    { name: 'item3', id: 3 },
  ]
  const item = Items.find(item => item.id === +id) || {}
  return Promise.resolve(item)
}