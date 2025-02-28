import mongoose from "mongoose";

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
    res.status(500).send({ message: `Erro interno de servidor. ${erro.message} ` });
  }
}


export default manipuladorDeErros;