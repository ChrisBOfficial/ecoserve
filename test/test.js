const request = require("supertest"),
    app = require("../src/server").app,
    assert = require("assert");

describe("API endpoints", function() {
    describe("GET '/'", function() {
        it("should return homepage", function(done) {
            request(app)
                .get("/")
                .expect("x-powered-by", "Express")
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

    describe("GET '/api/surveys' with incorrect token", function() {
        it("should return 401", function() {
            request(app)
                .get("/api/surveys")
                .set("x-api-token", "1nv4l1d t0k3n")
                .then(response => {
                    assert(response.status, 401);
                });
        });
    });

    describe("GET specific survey with invalid surveyId", function() {
        it("should return 401", function() {
            request(app)
                .get("/api/surveys?surveyId=b0gu5surv3y")
                .set("x-api-token", "1nv4l1d t0k3n")
                .then(response => {
                    assert(response.status, 401);
                });
        });
    });
});

describe("Vue router endpoints", function() {
    describe("GET '/contact'", function() {
        it("should return 404", function(done) {
            request(app)
                .get("/contact")
                .expect("x-powered-by", "Express")
                .expect(404)
                .end(function(err, res) {
                    if (err) {
                        console.log(res);
                        done(err);
                    }
                    done();
                });
        });
    });

    describe("GET '/project'", function() {
        it("should return 404", function(done) {
            request(app)
                .get("/project")
                .expect("x-powered-by", "Express")
                .expect(404)
                .end(function(err, res) {
                    if (err) {
                        console.log(res);
                        done(err);
                    }
                    done();
                });
        });
    });

    describe("GET '/workspace'", function() {
        it("should return 404", function(done) {
            request(app)
                .get("/workspace")
                .expect("x-powered-by", "Express")
                .expect(404)
                .end(function(err, res) {
                    if (err) {
                        console.log(res);
                        done(err);
                    }
                    done();
                });
        });
    });
});
