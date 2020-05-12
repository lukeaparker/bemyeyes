const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server")
const should = chai.should();
chai.use(chaiHttp);

// Agent that will keep track of the cookies
const agent = chai.request.agent(app);
const User = require("../models/user");

describe("User", function() {
    after(function() {
        agent.close();
    })

    it("should not be able to login if they have not signed up", function(done) {
        agent.post("/login", {
            username: "wrong@wrong.com",
            password: "nope"
        })
        .end(function(err, res) {
            res.status.should.be.equal(401);
            done();
        })
    })

    it("should be able to signup", function(done) {
        User.findOneAndRemove({ username: "testOne" }, function() {
            agent
                .post("/sign-up")
                .send({
                    firstName: "hello",
                    lastName: "world",
                    username: "testOne",
                    password: "password"
                })
                .end(function(err, res) {
                    console.log(res.body);
                    res.should.have.status(200);
                    done();
                })
        })
    })
})