const request =  require('request');
const Thumbor =  require('thumbor');

module.exports = function skipperThumbor (options) {
  options = Object.assign({
    imageHost: null,
    imageSecret: null,
  }, options);

  const thumborURL = new Thumbor(options.imageSecret, options.imageHost);

  const adapter = {

    read: function (fd, cb) {
      return cb(new Error('TODO'));
    },

    rm: function (fd, cb){
      return cb(new Error('TODO'));
    },

    ls: function (dirname, cb) {
      return cb(new Error('TODO'));
    },

    receive: function () {

      var receiver = require('stream').Writable({ objectMode: true });

      receiver._write = (streamFile, encoding, done) => {
        const r = request.post(options.imageHost + '/image');
        r.on('response', (response) => {
          const result = {};
          if (response.headers.location) {
            const locationParsedArray = response.headers.location.split('/');
            const smartPath = locationParsedArray[2];
            // const smartPath = response.headers.location.slice(6);
            // const url = thumborURL.setImagePath(smartPath).resize(50, 50).buildUrl();

            // result.url = url;
            result.id = smartPath;

          }
          receiver.emit('writefile', streamFile);

          const responseJSON = response.toJSON();
          result.statusCode = responseJSON.statusCode;

          streamFile.extra = result;
          done();
        });
        r.on('error', (error) => {
          receiver.emit('error', error);
          return;
        });
        streamFile.pipe(r);
      };

      return receiver;
    }
  };

  return adapter;
};