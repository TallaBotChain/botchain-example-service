export function normalizeProducts(products) {
  let result = { byAddress: {}, allIds: []}
  products.map((product) => {
    result.allIds.push(product.eth_address)
    result.byAddress[product.eth_address] = product
  })
  return result
}
