import mongoose from "mongoose";
import ErroBase from "../erros/ErroBase.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function manipuladorDeErros(erro, req, res, next) {
  console.log(erro);  // imprime o erro para a pessoa desenvolvedora

  if (erro instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: "Um ou mais dados fornecidos estão incorretos." });
  } else if (erro instanceof mongoose.Error.ValidationError) {
    // console.error(erro.errors);
    const mensagensErro = Object.values(erro.errors)
      .map(erro => erro.message)
      .join("; ");

    res.status(400).send({ message: `Os seguintes erros foram encontrados: <br /> ${mensagensErro}` });

  } else {
    new ErroBase("Erro interno do servidor", 500).enviarResposta(res);
  }
}


export default manipuladorDeErros;