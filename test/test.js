var request = require('supertest'),
    app = require('../src/server').app,
    assert = require('assert');

describe('Node.js endpoints', function() {
    describe('GET \'/\'', function() {
        it('should return homepage', function(done) {
            request(app)
                .get('/')
                .expect('x-powered-by', 'Express')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        console.log(res);
                        return done(err);
                    }
                    done();
                });
        });
    });

    describe('GET \'/api/surveys\' with incorrect token', function() {
        it('should return 401', function() {
            request(app)
                .get('/api/surveys')
                .set('x-api-token', '1nv4l1d t0k3n')
                .then(response => {
                    assert(response.status, 401);
                });
        });
    });
});
