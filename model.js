
const fs = require('fs');

const DB_FILENAME = "quizzes.json";

//Modelo de datos

let quizzes = [
  {
    question: "Capital de Italia",
    answer: "Roma"
  },
  {
    question: "Capital de Francia",
    answer: "París"
  },
  {
    question: "Capital de España",
    answer: "Madrid"
  },
  {
    question: "Capital de Portugal",
    answer: "Lisboa"
  },
  
];

//funcion para leer el fichero
const load = () => {

  fs.readFile(DB_FILENAME, (err, data) => {
    if(err) {

      //La primera vez no existe el fichero
      if(err.code === "ENOENT") {
        save(); //valores iniciales
        return;
      }
      throw err;
    }

    let json = JSON.parse(data);

    if (json) {
      quizzes = json;
    }
  });
};

const save = () => {
  fs.writeFile(DB_FILENAME,
    JSON.stringify(quizzes),
    err => {
      if (err) throw err;
    });
};

//funciones para manejar el array
exports.count = () => {
  load();
  quizzes.length;
}

exports.add = (question, answer) => {

  quizzes.push({
    question: (question || "").trim(),
    answer: (answer || "").trim()
  });
  save()
};

exports.update = (id, question, answer) => {

  const quiz = quizzes[id];
  if (typeof(quiz) === "undefined") {
    throw new Error('El valor del parámetro id no es válido.');
  }
  quizzes.splice(id, 1, {
    question: (question || "").trim(),
    answer: (answer || "").trim()
  });
  save();
};

exports.getAll = () => {
  load();
  return JSON.parse(JSON.stringify(quizzes));
}

exports.getByIndex = id => {
  const quiz = quizzes[id];

  if(typeof(quiz) === "undefined") {
    throw new Error('El valor del parámetro id no es válido.');
  }
  return JSON.parse(JSON.stringify(quiz));
};

exports.deleteByIndex = id => {

  const quiz = quizzes[id];

  if(typeof(quiz) === "undefined") {
    throw new Error('El valor del parámetro id no es válido.');
  }

  quizzes.splice(id, 1);
  save();
}

load();