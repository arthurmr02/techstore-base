// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function temPrecoValido(produto) {
  if (!produto || produto.price === null || produto.price === undefined) {
    return false
  }

  const preco = Number(produto.price)
  return String(produto.price).trim() !== '' && Number.isFinite(preco) && preco >= 0
}

export function produtoVendavel(produto) {
  return temPrecoValido(produto) && Number(produto.estoque ?? 0) > 0
}

export function valorParaFreteGratis(valor) {
  const total = Number(valor ?? 0)
  if (!Number.isFinite(total)) {
    return 0
  }

  return Math.max(0, 200 - total)
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    if (!temPrecoValido(produto)) {
      return total
    }

    return total + Number(produto.price)
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho
    .filter((produto) => temPrecoValido(produto))
    .forEach((produto) => {
      const existente = itens.find((item) => item.produto.id === produto.id)
      if (existente) {
        existente.quantidade += 1
      } else {
        itens.push({ produto, quantidade: 1 })
      }
    })
  return itens
}
