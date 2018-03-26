const figlet = require('figlet');
const chalk = require('chalk');


const colorize = (msq, color) => {
  if(typeof(color) !== "undefined") {
    msq = chalk[color].bold(msq);
  }
  return msq;
}

const log = (socket, msq, color) => {
  socket.write(colorize(msq, color)+"\n");
}



const errorlog = (socket, msq) => {
  socket.write(`${colorize("Error", "red")}: ${colorize(colorize(emsq, "red"), "bgYellowBright")}"\n"`);
}

const biglog = (socket, msq, color) => {
  log(socket, figlet.textSync(msq, { horizonlLayout: 'full'}), color);
}

exports = module.exports = {
	colorize,
	log,
	errorlog,
	biglog
};