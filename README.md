# Thumbor Adapter for Skipper

## Require
```
    var skipperThumbor = require('skipper-thumbor');
```
## Usage
```
    req.file('image').upload(
      {
        adapter: skipperThumbor,
        imageHost: config.imageHost,
        imageSecret: config.imageSecret
      },
      function (err, uploadedFiles){
      if (err) return res.serverError(err);
      return res.json({
        message: uploadedFiles.length + ' file(s) uploaded successfully!',
        files: uploadedFiles
      });
    });
```
