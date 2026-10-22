import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoVendavel } from './utils/carrinho'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState([])

  useEffect(() => {
    const itensSalvos = localStorage.getItem('techstore-lista-espera')
    if (itensSalvos) {
      try {
        setListaEspera(JSON.parse(itensSalvos))
      } catch {
        setListaEspera([])
      }
    }

    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('techstore-lista-espera', JSON.stringify(listaEspera))
  }, [listaEspera])

  function adicionarAoCarrinho(produto) {
    if (!produtoVendavel(produto)) {
      return
    }

    setCarrinho((carrinhoAtual) => carrinhoAtual.concat(produto))
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  function registrarListaEspera(produtoId, dadosCliente) {
    if (!produtoId || !dadosCliente?.nome || !dadosCliente?.email) {
      return
    }

    setListaEspera((atual) => {
      const jaCadastrado = atual.some(
        (item) => item.produtoId === produtoId && item.email === dadosCliente.email
      )

      if (jaCadastrado) {
        return atual
      }

      return [
        ...atual,
        {
          produtoId,
          nome: dadosCliente.nome,
          email: dadosCliente.email,
        },
      ]
    })
  }

  const clienteAtual = clientes.find(
    (cliente) => String(cliente.id) === String(clienteAtualId)
  )

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  listaEspera={listaEspera}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarListaEspera={registrarListaEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEspera={listaEspera} />} />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
