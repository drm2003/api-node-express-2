import autopopulate from "mongoose-autopopulate";
import mongoose from "mongoose";

const livroSchema = new mongoose.Schema(
  {
    id: { type: String },
    titulo: { 
      type: String, 
      required: [true, "O título é obrigatório"] 
    },
    autor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "autores", 
      required: [true, "O(A) autor(a) é obrigatório"],
      autopopulate: { select: "nome" }
    },
    editora: { 
      type: String,
      required: [true, "A editora é obrigatória"],
      enum: {
        values: ["Saraiva", "Moderna", "Ática", "Scipione", "FTD", "Casa do Código", "Alura", "Classicos", "Editora Garnier", "Editora Record", "Outra"],
        message: "Editora {VALUE} fornecida não é um valor permitido."
      }
    },
    // numeroPaginas: {
    //   type: Number,
    //   min: [10, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"],
    //   max: [5000, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"],
    // }
    numeroPaginas: {
      type: Number,
      validate: {
        validator: (valor) => {
          return valor >= 10 && valor <= 5000;
        },
        message: "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}."
      }
    }
  }
);

livroSchema.plugin(autopopulate);
const livros = mongoose.model("livros", livroSchema);

export default livros;