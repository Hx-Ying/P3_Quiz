const Sequelize = require('sequelize');

const readline = require('readline');

const {models} = require('./model');

const {log, biglog, errorlog, colorize} = require('./out');

const helpCmd = (socket, rl) => {
  log(socket, "Commandos:");
  log(socket, " h|help - Muestra esta ayuda.");
  log(socket, " list - listar los quizzes existentes");
  log(socket, " show <id> - Muestra la pregunta y la respuesta del quiz indicado");
  log(socket, " add - Añadir un nuevo quiz interacticamente");
  log(socket, " delete <id> - Borrar el quiz indicado.");
  log(socket, " edit <id> - Editar el quiz indicado.");
  log(socket, " test <id> - Probar el quiz indicado.");
  log(socket, " p|play - Jugar a preguntar aleatoriamente todos los quizzes");
  log(socket, " credits - Créditos");
  log(socket, " q|quit - Salir del programa.");
  rl.prompt();
}

//Funciones auxiliares
const validateId = id => {

  return new Promise ((resolve, reject) => {
      if(typeof id === "undefined") {
        reject(new Error(`Falta el parámetro <id>.`));
      } else {
        id = parseInt(id);
        if(Number.isNaN(id)) {
          reject(new Error(`El valor del parámetro <id> no es un número.`))
        } else {
          resolve(id);
        }
      }
  });
};

const makeQuestion = (rl, text) => {

  return new Promise((resolve, reject) => {
    rl.question(colorize(text, 'red'), answer => {
      resolve(answer.trim());
    });
  });
}


const showCmd = (socket, rl, id) => {
  
  validateId(id)
  .then(id => models.quiz.findById(id))
  .then(quiz => {
    if(!quiz) {
      throw new Error(`No existe un quiz asociado al id=${id}.`);
    }
    log(socket, ` [${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`)
  })
  .catch(error => {
    errorlog(socket, error.message);
  })
  .then(() => {
    rl.prompt();
  });
}

const addCmd = (socket, rl) =>  {

  makeQuestion(rl, ' Introduzca una pregunta: ')
  .then(q => {
    return makeQuestion(rl,' Introduzca la respuesta: ')
    .then(a => {
      return {question: q, answer: a};
    });
  })
  .then(quiz => {
    return models.quiz.create(quiz);
  })
  .then(quiz => {
    log(socket, ` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`)
  })
  .catch(Sequelize.validationError, error => {
    errorlog(socket, 'El quiz es erroneo:');
    error.errors.forEach(({message}) => errorlog(socket, message));
  })
  .catch(error => {
    errorlog(socket, error.message);
  })
  .then(() => {
    rl.prompt();
  });
};

const deleteCmd = (socket, rl,id) => {

  validateId(id)
  .then(id => models.quiz.destroy({where: {id}}))
  .catch(error => {
    errorlog(socket, error.message);
  })
  .then(() => {
    rl.prompt();
  });
};

const editCmd = (socket, rl, id) => {

  validateId(id)
  .then(() => models.quiz.findById(id))
  .then(quiz => {
    if(!quiz) {
      throw new Error('No existe un quiz asociado al id=${id}.');
    }

    socket.write.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
    return makeQuestion(rl, ' Introduzca la pregunta: ')
    .then (q => {
      socket.write.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
      return makeQuestion(rl, ' Introduzca la respuesta ')
      .then (a => {
        quiz.question = q;
        quiz.answer = a;
        return quiz;
      });
    });
  })
  .then(quiz => {
    return quiz.save();
  })
  .then(quiz => {
    log(socket, ` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`)
  })
  .catch(Sequelize.validationError, error => {
    errorlog(socket, 'El quiz es erroneo:');
    error.errors.forEach(({message}) => errorlog(socket, message));
  })
  .catch(error => {
    errorlog(socket, error.message);
  })
  .then(() => {
    rl.prompt();
  });
};

const testCmd = (socket, rl, id) => {

  validateId(id)
  .then(() => models.quiz.findById(id))
  .then(quiz => {
    //log(socket, JSON.stringify(quiz.question));

    rl.question(`${colorize(quiz.question, 'red')}? `, respuesta => {
      if (respuesta.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") === quiz.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) {
          log(socket, 'Su respuesta es correcta.');
          biglog(socket, 'Correcta', 'green');
          rl.prompt();
      } else {
          log(socket, 'Su respuesta es incorrecta.');
          biglog(socket, 'Incorrecta', 'red');
          rl.prompt();
      }
    });
  })
  .catch(Sequelize.validationError, error => {
    errorlog(socket, 'El quiz es erroneo:');
    error.errors.forEach(({message}) => errorlog(socket, message));
  })
  .catch(error => {
    errorlog(socket, error.message);
  })
  .then(() => {
    rl.prompt();
  });


}

const playCmd = (socket, rl) => {
  let score = 0;

  const playOne = (quizzes) => {
    let index = Math.floor(Math.random()*quizzes.length);
    
    let quiz = quizzes[index];
      if (quiz === 'undefined') {
        errorlog(socket, `El valor del parámetro id no es válido.`);
        rl.prompt();
      } else {
        rl.question(`${colorize(quiz.question, 'red')}? `, respuesta => {
          if (respuesta.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
            === quiz.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) {
            score++;
            log(socket, `CORRECTO - Lleva ${score} aciertos.`);
            if(quizzes.length <= 1) {
              log(socket, 'No hay nada más que preguntar.');
              log(socket, `Fin del juego. Aciertos: ${score}`);
              biglog(socket, `${score}`, 'magenta')
              rl.prompt();
              return;
            }
            quizzes.splice(index, 1);
            playOne(quizzes);
          } else {
              log(socket, 'INCORRECTO.');
              log(socket, `Fin del juego. Aciertos: ${score}`);
              biglog(socket, `${score}`, 'magenta')
              rl.prompt();
              return;
          }
      });
    }
  };

  models.quiz.findAll()
  .then(quizzes =>{
    let repositorio = quizzes;
    playOne(repositorio);

  })
  .catch(error => {
    errorlog(socket, error.message);
  })
  .then(() => {
    rl.prompt();
  });


}

const creditsCmd = (socket, rl) => {
  log(socket, 'Autores de la práctica:');
  log(socket, 'Hengxuan Ying', 'green');
  rl.prompt();
}

const quitCmd = (socket, rl) => {
  rl.close();
  socket.end();
}

const listCmd = (socket, rl) => {
  models.quiz.findAll()
  .each(quiz => {
      log(socket, ` [${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
  })
  .catch(error => {
    errorlog(socket, error.message);
  })
  .then(() => {
    rl.prompt();
  });
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