var expect = require("chai").expect;
var request = require("request");

describe("User Login/Session API", function() {

  describe("Login/Register", function() {

    var url =
      "http://localhost:8000/api/user";

    it("returns status 200", function(done) {
      request({
        method: 'POST',
        uri: url,
        json: true,
        headers: {
          "content-type": "application/json",
        },
        body: {
          username: 'ali'
        },
      }, function(error, response, body) {
        expect(
          response.statusCode).to.equal(200);
        done();
      });
    });
    it("returns same username on creating/signingIn provided username",
      function(done) {
        request({
          method: 'POST',
          uri: url,
          json: true,
          headers: {
            "content-type": "application/json",
          },
          body: {
            username: 'ali'
          },
        }, function(error, response, body) {
          expect(
            response.body.data.username).to.equal('ali');
          done();
        });
      });
    var returnData = {};
    it(
      "creates sessionId on registering/signingIn username",
      function(done) {
        request({
          method: 'POST',
          uri: url,
          json: true,
          headers: {
            "content-type": "application/json",
          },
          body: {
            username: 'ali'
          },
        }, function(error, response, body) {
          returnData = response.body.data;
          expect(
            response.body.data.sessionId).not.to.equal(NaN);

          done();
        });
      });

  });

});
