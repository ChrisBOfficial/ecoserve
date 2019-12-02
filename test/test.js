var request = require('supertest'),
    app = require('../src/server').app,
    assert = require('assert');

describe('GET \'/\'', function() {
    it('should return homepage', function(done) {
        request(app)
            .get('/')
            .expect('x-powered-by', 'Express')
            .expect(200)
            .end(function(err, _) {
                if (err) return done(err);
                done();
            });
    });
});
