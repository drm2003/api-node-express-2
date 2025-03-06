import mongoose from "mongoose";
import ErroBase from "../erros/ErroBase.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";
import ErroValidacao from "../erros/ErroValidacao.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function manipuladorDeErros(erro, req, res, next) {
  console.log(erro);  // imprime o erro para a pessoa desenvolvedora

  if (erro instanceof mongoose.Error.CastError) {
    new RequisicaoIncorreta().enviarResposta(res);
  } else if (erro instanceof mongoose.Error.ValidationError) {
    new ErroValidacao(erro).enviarResposta(res);
  } else if (erro instanceof NaoEncontrado) {
    erro.enviarResposta(res);
  }  else {
    new ErroBase("Erro interno do servidor", 500).enviarResposta(res);
  }
}


export default manipuladorDeErros;