import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { produtoVendavel, temPrecoValido, valorParaFreteGratis } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({
  produtos,
  clienteAtual,
  listaEspera = [],
  onAdicionar,
  onRegistrarListaEspera,
}) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState(clienteAtual?.nome || '')
  const [email, setEmail] = useState(clienteAtual?.email || '')
  const [mensagemEspera, setMensagemEspera] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        produtoVendavel(item)
    )
    .slice(0, 4)

  const produtoDisponivel = produtoVendavel(produto)
  const restanteParaFrete = valorParaFreteGratis(produto.price)
  const indicadorFrete = temPrecoValido(produto)
    ? restanteParaFrete === 0
      ? 'Frete grátis liberado'
      : `Faltam ${formatarPreco(restanteParaFrete)} para ganhar frete grátis`
    : 'Frete grátis indisponível'
  const jaNaListaEspera = listaEspera.some(
    (item) => item.produtoId === produto.id && item.email.toLowerCase() === email.trim().toLowerCase()
  )

  function enviarListaEspera(evento) {
    evento.preventDefault()

    const nomeFormatado = nome.trim()
    const emailFormatado = email.trim()

    if (!nomeFormatado || !emailFormatado) {
      setMensagemEspera('Informe nome e e-mail para receber o aviso.')
      return
    }

    if (jaNaListaEspera) {
      setMensagemEspera('Você já está na fila para receber o aviso desse produto.')
      return
    }

    onRegistrarListaEspera(produto.id, { nome: nomeFormatado, email: emailFormatado })
    setMensagemEspera('Você está na fila para receber o aviso quando o produto voltar.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {temPrecoValido(produto) ? `R$ ${Number(produto.price).toFixed(2).replace('.', ',')}` : 'Preço indisponível'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {produtoDisponivel ? `${produto.estoque} unidades disponíveis` : 'Produto indisponível no momento'}
          </p>
          {temPrecoValido(produto) && (
            <p className={restanteParaFrete === 0 ? 'selo selo-frete' : 'selo selo-alerta'}>
              {indicadorFrete}
            </p>
          )}

          {!produtoDisponivel && (
            <form className="lista-espera-form" onSubmit={enviarListaEspera}>
              <label htmlFor="nome-lista-espera">Nome</label>
              <input
                id="nome-lista-espera"
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
              />

              <label htmlFor="email-lista-espera">E-mail</label>
              <input
                id="email-lista-espera"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="seu@email.com"
              />

              <button
                type="submit"
                className="botao botao-grande botao-secundario"
                disabled={jaNaListaEspera}
              >
                {jaNaListaEspera ? 'Já está na lista' : 'Avisar quando voltar'}
              </button>
              {mensagemEspera && <p className="mensagem-cupom">{mensagemEspera}</p>}
            </form>
          )}

          {produtoDisponivel && (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={!produtoDisponivel}
            >
              Adicionar ao carrinho
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
