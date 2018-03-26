
const readline = require('readline');

const figlet = require('figlet');
const chalk = require('chalk');

const net = require('net');

//Importo los modulos que he creado yo
const model = require('./model');
const {log, biglog, errorlog, colorize} = require('./out');
const cmds = require('./cmds');

net.createServer(socket => {

	console.log("Se ha conectado un cliente desde " + socket.remoteAddress);

	biglog(socket, 'CORE Quiz', 'green');

	const rl = readline.createInterface({
	  input: socket,
	  output: socket,
	  prompt: colorize("quiz > ", 'blue'),
	  completer: (line) => {
	    const completions = 'h help add delete edit list test p play credits q quit'.split(" ");
	    const hits = completions.filter((c) => c.startsWith(line));
	    return [hits.length ? hits: completions, line];
	  }
	});

	socket
	.on("end", () => { rl.close(); })
	.on("error", () => { rl.close(); });

	rl.prompt();

	rl
	.on('line', (line) => {

	  let args = line.split(" ");
	  let cmd = args[0].toLowerCase().trim();
	  let idPregunta = args[1];
	  
	  switch (cmd) {
	    case'':
	      rl.prompt();
	      break;

	    case 'h':
	    case 'help':
	      cmds.helpCmd(socket, rl);
	      break;
	      
	    case 'quit':
	    case 'q':
	      cmds.quitCmd(socket, rl);
	      break;
	      
	    case "add":
	      cmds.addCmd(socket, rl);
	      break;

	    case 'list':
	      cmds.listCmd(socket, rl);
	      break;

	    case 'show':
	      cmds.showCmd(socket, rl, idPregunta);
	      break;

	    case 'test':
	      cmds.testCmd(socket, rl, idPregunta);
	      break;

	    case 'p':
	    case 'play':
	      cmds.playCmd(socket, rl);
	      break;

	    case 'delete':
	      cmds.deleteCmd(socket, rl, idPregunta);
	      break;

	    case 'edit':
	      cmds.editCmd(socket, rl, idPregunta);
	      break;

	    case 'credits':
	      cmds.creditsCmd(socket, rl);
	      break;

	    default:
	      log(socket, `Comando desconocido: '${colorize(cmd, 'red')}'`);
	      log(socket, `Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
	      rl.prompt();
	      break;
	  }
	  
	})
	.on('close', () => {
	  log(socket, 'Adios!');
	  //process.exit(0);
	});

})
.listen(3030);

