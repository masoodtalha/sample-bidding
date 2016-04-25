module.exports = function(app) {

  var send = function(code, res, message, data, error_code) {
    if (!code) {
      throw new Error('error_code is required.');
    }

    res.send(
      code, {
        error_code: error_code,
        message: message,
        data: data
      }
    );
  };

  return {
    send: send
  };
};
