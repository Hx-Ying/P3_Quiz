const readline = require('readline');

const figlet = require('figlet');
const chalk = require('chalk');

const colorize = (msq, color) => {
  if(typeof(color) !== "undefined") {
    msq = chalk[color].bold(msq);
  }
  return msq;
}

const log = (msq, color) => {
  console.log(colorize(msq, color));
}



const errorlog = (emsq) => {
  console.log(`${colorize("Error", "red")}: ${colorize(emsq, "red"), "bgYellowBright"}`);
}

const biglog = (msq, color) => {
  log(figlet.textSync(msq, { horizonlLayout: 'full'}), color);
}

biglog('CORE Quiz', 'green');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colorize("quiz >", 'blue'),
  completer: (line) => {
    const completions = 'h help add delete edit list test p play credits q quit'.split(" ");
    const hits = completions.filter((c) => c.startsWith(line));
    return [hits.length ? hits: completions, line];
  }
});

rl.prompt();

rl
.on('line', (line) => {

  let args = line.split(" ");
  let cmd = args[0].toLowerCase().trim();
  let id = args[1];

  switch (cmd) {
    case'':
      rl.prompt();
      break;

    case 'h':
    case 'help':
      helpCmd();
      break;
      
    case 'quit':
    case 'q':
      quitCmd();
      break;
      
    case "add":
      addCmd();
      break;

    case 'list':
      listCmd();
      break;

    case 'show':
      showCmd(id);
      break;

    case 'test':
      testCmd(id);
      break;

    case 'p':
    case 'play':
      playCmd();
      break;

    case 'delete':
      deleteCmd(id);
      break;

    case 'edit':
      editCmd(id);
      break;

    case 'credits':
      creditsCmd();
      break;

    default:
      log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
      console.log(`Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
      rl.prompt();
      break;
  }
  
})
.on('close', () => {
  console.log('Adios!');
  process.exit(0);
});

const helpCmd = () => {
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

const showCmd = id => {
  log('Mostrar el quiz indicado', 'red');
  rl.prompt();
}

const addCmd = () =>  {
  log("Añadir un nuevo quiz.", 'red');
  rl.prompt();
}

const deleteCmd = id => {
  log('Borrar el quiz indicado.', 'red');
  rl.prompt();
}

const editCmd = id => {
  log('Editar el quiz indicado.', 'red');
  rl.prompt();
}
const testCmd = id => {
  log('Probar el quiz indicado.', 'red');
  rl.prompt();
}
const playCmd = () => {
  log('Jugar.', 'red');
  rl.prompt();
}
const creditsCmd = () => {
  log('Autor de la práctica:');
  log('Hengxuan Ying');
  rl.prompt();
}
const quitCmd = () => {
  rl.close();
}
const listCmd = () => {
  log('Listar todos los quizzes existentes.', 'red');
  rl.prompt();
}

