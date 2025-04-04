import { autores, livros } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const buscaLivro = livros.find();

      // armazenando o resultado da busca na requisição
      // para que possa ser utilizado no middleware de paginação
      // o resultado é um array de objetos, onde cada objeto representa um livro
      req.resultado = buscaLivro;

      next();
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros
        .findById(id, {}, { autopopulate: false })
        .populate("autor");

      res.status(200).send(livroResultados);
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndUpdate(id, { $set: req.body });

      res.status(200).send({ message: "Livro atualizado com sucesso" });
    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndDelete(id);

      res.status(200).send({ message: "Livro removido com sucesso" });
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {

      const busca = await processaBusca(req.query);

      if (busca !== null) {
        const livrosResultado = livros
          .find(busca);
        
        // armazenando o resultado da busca na requisição
        // para que possa ser utilizado no middleware de paginação
        // o resultado é um array de objetos, onde cada objeto representa um livro
        req.resultado = livrosResultado;
        next();
      } else{
        res.status(200).send([]);
      }

    } catch (erro) {
      next(erro);
    }
  };

}

async function processaBusca(parametros) {
  let busca = {};
    
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;

  if(editora) busca.editora = editora;

  // Duas alternativas para trabalhar com o regex
  // const regex = RegExp(titulo, "i");
  // if(titulo) busca.titulo = regex;

  // a opção "i" torna a busca case insensitive
  if(titulo) busca.titulo = { $regex: titulo, $options: "i"};

  if(minPaginas) busca.numeroPaginas = { $gte: minPaginas };
  if(maxPaginas) busca.numeroPaginas = { $lte: maxPaginas };

  if (nomeAutor) {
    const autorRegex = { $regex: nomeAutor, $options: "i" };
    const autor = await autores.findOne({ nome: autorRegex });

    if(autor !== null) {
      const autorId = autor._id;
  
      busca.autor = autorId;
    } else {
      busca = null;
    }

  }
    
  return busca;
}


export default LivroController;