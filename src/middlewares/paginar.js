import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

async function paginar(req, res, next) {
  try {
    let { limite = 5, pagina = 1, ordenacao="_id:-1" } = req.query;

    let [campoOrdenacao, ordem] = ordenacao.split(":");
    limite = parseInt(limite);
    pagina = parseInt(pagina);
    ordem = parseInt(ordem);


    if (limite > 0 && pagina > 0) {
        
      const resultado = req.resultado;
      // sort serve para ordenar os resultados, sendo que 1 é o menor e -1 é o maior
      // skip serve para pular os primeiros resultados, ou seja, se a página for 2 e o limite for 5, ele vai pular os 5 primeiros resultados
      // limit serve para limitar a quantidade de resultados retornados
      // O resultado da consulta é um array de objetos, onde cada objeto representa um livro
      // populate serve para popular os dados de um autor, ou seja, ele vai trazer os dados do autor junto com os dados do livro
      // exec serve para executar a consulta
      const resultadoPaginado = await resultado.find()
        .sort({ [campoOrdenacao]: ordem })
        .skip((pagina-1) * limite)
        .limit(limite);

      res.status(200).json(resultadoPaginado);
    } else {
      next(new RequisicaoIncorreta());
    }

  } catch (erro) {
    next(erro);
  }
}

export default paginar;
