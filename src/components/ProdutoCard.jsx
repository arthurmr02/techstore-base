import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { temPrecoValido, valorParaFreteGratis } from '../utils/carrinho'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = Number(produto.estoque ?? 0) === 0
  const semPreco = !temPrecoValido(produto)
  const indisponivel = esgotado || semPreco
  const restanteParaFrete = valorParaFreteGratis(produto.price)
  const temFreteGratis = restanteParaFrete === 0 && temPrecoValido(produto)

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">
          {semPreco ? 'Preço indisponível' : formatarPreco(produto.price)}
        </span>
      </div>

      <div className="card-selos">
        {temPrecoValido(produto) && temFreteGratis && <span className="selo selo-frete">Frete grátis</span>}
        {temPrecoValido(produto) && !temFreteGratis && (
          <span className="selo selo-alerta">Falta {formatarPreco(restanteParaFrete)} para frete grátis</span>
        )}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
        {semPreco && <span className="selo selo-alerta">Sem preço</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={indisponivel}>
        {semPreco ? 'Indisponível' : 'Adicionar ao carrinho'}
      </button>
    </article>
  )
}
