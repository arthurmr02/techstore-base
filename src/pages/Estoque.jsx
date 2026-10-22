import { Link } from 'react-router'

// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const clientesEmEspera = listaEspera.reduce((acumulador, item) => {
    acumulador[item.produtoId] = acumulador[item.produtoId] || []
    acumulador[item.produtoId].push(item)
    return acumulador
  }, {})

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Esperando retorno</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => {
              const espera = clientesEmEspera[produto.id] || []

              return (
                <tr key={produto.id}>
                  <td>
                    <Link to={`/produto/${produto.id}`}>{produto.title}</Link>
                  </td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                    {produto.estoque > 0 && produto.estoque < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                  <td>
                    {espera.length === 0 && <span>—</span>}
                    {espera.length > 0 && (
                      <ul className="lista-espera">
                        {espera.map((cliente) => (
                          <li key={`${produto.id}-${cliente.email}`}>
                            {cliente.nome} — {cliente.email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
