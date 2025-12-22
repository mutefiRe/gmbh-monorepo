const error = 'Does not make any sense. Update your layout.';

class util {
  formatDate(date) {
    const time = new Date(date);
    const hour = this._leftZero(time.getHours());
    const minutes = this._leftZero(time.getMinutes());
    const day = this._leftZero(time.getDate());
    const month = this._leftZero(time.getMonth() + 1);

    return `${hour}:${minutes} ${day}.${month}`;
  }

  rpad(str, amount) {
    if(amount < 4) {
      throw Error(error);
    }

    str = String(str);

    if(str.length === amount) {
      return str;
    }

    const whiteSpace = Array(amount).join(' ');
    if(amount - str.length < 0) {
      return str.substr(0, amount - 3) + '...';
    }
    return str.concat(whiteSpace.substr(0, amount - str.length));
  }

  lpad(str, amount) {
    if(amount < 4) {
      throw Error(error)
    }

    str = String(str);

    if(str.length === amount) {
      return str;
    }

    const whiteSpace = Array(amount).join(' ');
    if(amount - str.length < 0) {
      return str.substr(0, amount - 3) + '...';
    }
    return whiteSpace.substr(0, amount - str.length).concat(str);
  }

  cpad(str, amount) {
    if(amount < 4) {
      throw Error(error)
    }

    str = String(str);

    if(str.length === amount) {
      return str;
    }

    const whiteSpace = Array(amount).join(' ');
    if(amount - str.length < 0) {
      return str.substr(0, amount - 3) + '...';
    }

    const pad = whiteSpace.substr(0, (amount - str.length) / 2);
    const tmp = pad.concat(str, pad);

    if(tmp.length !== amount) {
      return tmp + ' ';
    }
    return tmp;
  }

  _leftZero(str) {
    str = String(str);
    if(str.length < 2) {
      return '0' + str;
    }
    return str;
  }
}

module.exports = new util();