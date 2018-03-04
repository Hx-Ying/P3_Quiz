const readline = require('readline');

const model = require('./model');

const {log, biglog, errorlog, colorize} = require('./out');

const helpCmd = rl => {
  log("Commandos:");
  log(" h|help - Muestra esta ayuda.");
  log(" list - listar los quizzes existentes");
  log(" show <id> - Muestra la pregunta y la respuesta del quiz indicado");
  log(" add - Añadir un nuevo quiz interacticamente");
  log(" delete <id> - Borrar el quiz indicado.");
  log(" edit <id> - Editar el quiz indicado.");
  log(" test <id> - Probar el quiz indicado.");
  log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes");
  log(" credits - Créditos");
  log(" q|quit - Salir del programa.");
  rl.prompt();
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

  if (typeof(id) === "undefined") {
    errorlog('Falta el parámetro id.');
  } else {
    try {

      model.deleteByIndex(id);
    } catch (error) {
      errorlog(error.message);
    }

  }

  rl.prompt();
}

const editCmd = (rl, id) => {

  if(typeof(id) === "undefined") {
    errorlog(`Falta el parámetro id.`);
    rl.prompt();
  } else {
    try {

      const quiz = model.getByIndex(id);

      if (quiz === "undefined") {
        errorlog('El valor del parámetro id no es válido.')
        rl.prompt();
      } else {
        process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);

        rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

          process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);

          rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
            model.update(id, question, answer);
            log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
          });
        });
      }
      
    } catch (error) {
      errorlog(error.message);
      rl.prompt();
    }
  }
}

const testCmd = (rl, id) => {
  if (typeof id === "undefined") {
    errorlog(`Falta el parámetro id.`);
    rl.prompt();
  } else {
    try {

      let quiz = model.getByIndex(id);
      if (quiz === 'undefined') {
        errorlog(`El valor del parámetro id no es válido.`);
        rl.prompt();
      } else {
        rl.question(`${colorize(quiz.question, 'red')}? `, respuesta => {
          if (respuesta.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") === quiz.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) {
            log('Su respuesta es correcta.');
            biglog('Correcta', 'green');
            rl.prompt();
          } else {
            log('Su respuesta es incorrecta.');
            biglog('Incorrecta', 'red');
            rl.prompt();
          }
        });

        rl.prompt();
      }
    } catch (err) {
      errorlog(err.message);
      rl.prompt();
    }
  }
}

const playCmd = rl => {
  let score = 0;
  //let toBeResolved = [];
  const quizzes = model.getAll();
  const numeroPreguntas = quizzes.length;
  const playOne = (quizzes) => {
    let index = Math.floor(Math.random()*quizzes.length);
    
    let quiz = quizzes[index];
      if (quiz === 'undefined') {
        errorlog(`El valor del parámetro id no es válido.`);
        rl.prompt();
      } else {
        rl.question(`${colorize(quiz.question, 'red')}? `, respuesta => {
          if (respuesta.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
            === quiz.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) {
            score++;
            log(`CORRECTO - Lleva ${score} aciertos.`);
            if(quizzes.length <= 1) {
              log('No hay nada más que preguntar.');
              log(`Fin del juego. Aciertos: ${score}`);
              biglog(`${score}`, 'magenta')
              rl.prompt();
              return;
            }
            quizzes.splice(index, 1);
            playOne(quizzes);
          } else {
              log('INCORRECTO.');
              log(`Fin del juego. Aciertos: ${score}`);
              biglog(`${score}`, 'magenta')
              rl.prompt();
              return;
          }
      });
    }
  };

  playOne(quizzes);
}

const creditsCmd = rl => {
  log('Autores de la práctica:');
  log('Hengxuan Ying', 'green');
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