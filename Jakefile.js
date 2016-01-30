var assert = require('assert');
var needle = require('needle');
var spawn  = require('child_process').spawn;

task('test', { async: true }, function() {
  test(true, function() {
    test(false, complete);
  });
});

namespace('test', function() {
  desc('Test with oneapm');
  task('with_oneapm', { async: true }, function() {
    test(true, complete);
  });

  desc('Test without oneapm');
  task('without_oneapm', function() {
    test(false, complete);
  });
});

function test(oneapmEnabled, done) {
  var env = process.env;
  env.ONEAPM_ENABLED = oneapmEnabled;
  console.log('=====================');
  console.log('OneAPM enabled: ' + oneapmEnabled);
  console.log('=====================');

  var cp = spawn('node', ['.'], { env: env });

  var clientStarted = false;
  cp.stdout.on('data', function(data) {
    console.log(data.toString());

    if (!clientStarted) {
      clientStarted = true;

      needle.post('http://0.0.0.0:3000/api/TestUsers/', {
        email: 'user@example.com',
        password: 'password'
      }, { accept: 'application/json' }, function(err, res) {
        assert.equal(null, err);

        needle.post('http://0.0.0.0:3000/api/TestUsers/login', {
          email: 'user@example.com',
          password: 'password'
        }, { accept: 'application/json' }, function(err, res) {
          assert.equal(null, err);

          var accessToken = res.body;
          needle.post('http://0.0.0.0:3000/api/TestUsers/' + accessToken.userId + '/galleries?access_token=' + accessToken.id, {
            name: 'gallery'
          }, { accept: 'application/json' }, function(err, res) {
            assert.equal(null, err);

            var gallery = res.body;
            needle.post('http://0.0.0.0:3000/api/Galleries/' + gallery.id + '/items?access_token=' + accessToken.id, {
              name: 'item'
            }, { accept: 'application/json' }, function(err, res) {
              assert.equal(null, err);

              cp.kill();
              done();
            });
          });
        });
      });
    }
  });
}
