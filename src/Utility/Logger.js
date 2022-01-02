const EnableLog = __DEV__;
const Logger = {
  error(message) {
    if (EnableLog) {
      console.error(message);
    }
  },
  info(message) {
    if (EnableLog) {
      console.info(message);
    }
  },
  log(message, message2) {
    if (EnableLog) {
      if (message2) {
        console.log(message, message2);
      } else {
        console.log(message);
      }
    }
  },
  warn(message) {
    if (EnableLog) {
      console.warn(message);
    }
  },
  trace(message) {
    if (EnableLog) {
      console.trace(message);
    }
  },
  debug(message) {
    if (EnableLog) {
      console.debug(message);
    }
  },
  table(message) {
    if (EnableLog) {
      console.table(message);
    }
  },
};
export default Logger;
