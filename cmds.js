const readline = require('readline');

const model = require('./model');

const {log, biglog, errorlog, colorize} = require('./out');

const helpCmd = rl => {
  log("Comandos:");
  log("h|help - Muestra esta ayuda.");
  log("list - listar los quizzes existentes");
  log("show <id> - Muestra la pregunta y la respuesta del quiz indicado");
  log("add - Añadir un nuevo quiz interacticamente");
  log("delete <id> - Borrar el quiz indicado.");
  log("edit <id> - Editar el quiz indicado.");
  log("test <id> - Probar el quiz indicado.");
  log("p|play - Jugar a preguntar aleatoriamente todos los quizzes");
  log("credits - Créditos");
  log("q|quit - Salir del programa.");
}

const showCmd = (rl,id) => {

  if (typeof(id) === "undefined") {
    errorlog('Falta el parámetro id.');
  } else {
    try {
      const quiz = model.getByIndex(id);
      log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);

    } catch (error) {
      errorlog(error.message);
    }

  }
  rl.prompt();
}

const addCmd = rl =>  {
  //log("Añadir un nuevo quiz.", 'red');

  rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
    rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {

      model.add(question, answer);
      log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
      rl.prompt();
    })
  });
}

const deleteCmd = (rl,id) => {
  log('Borrar el quiz indicado.', 'red');
  rl.prompt();
}

const editCmd = (rl, id) => {
  log('Editar el quiz indicado.', 'red');
  rl.prompt();
}
const testCmd = (rl, id) => {
  log('Probar el quiz indicado.', 'red');
  rl.prompt();
}
const playCmd = rl => {
  log('Jugar.', 'red');
  rl.prompt();
}
const creditsCmd = rl => {
  log('Autor de la práctica:');
  log('Hengxuan Ying');
  rl.prompt();
}
const quitCmd = rl => {
  rl.close();
}
const listCmd = rl => {
  model.getAll().forEach((quiz, id) => {
    log(` [${colorize(id, 'magenta')}]: ${quiz.question}`);
  });
  rl.prompt();
}

exports = module.exports = {
  helpCmd,
  showCmd,
  addCmd,
  deleteCmd,
  editCmd,
  testCmd,
  playCmd,
  creditsCmd,
  quitCmd,
  listCmd
}