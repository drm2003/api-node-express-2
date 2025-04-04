import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";
import { autores, livros } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      let { limite = 10, pagina = 1 } = req.query;

      limite = parseInt(limite);
      pagina = parseInt(pagina);

      if (limite > 0 && pagina > 0) {
        const livrosResultado = await livros.find()
          .skip((pagina-1) * limite)
          .limit(limite)
          .populate("autor")
          .exec();
  
        res.status(200).json(livrosResultado);
      } else {
        next(new RequisicaoIncorreta());
      }

    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

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
        const livrosResultado = await livros
          .find(busca)
          .populate("autor");
  
        res.status(200).send(livrosResultado);
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
  if(titulo) busca.titulo = { $regex: titulo, $options: "i"};

  if(minPaginas) busca.numeroPaginas = { $gte: minPaginas };
  if(maxPaginas) busca.numeroPaginas = { $lte: maxPaginas };

  if(nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });

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