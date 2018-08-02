'use strict'

/**
 * @description
 * Test User CRUD
 */

process.env.NODE_ENV = 'test'

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../bin/www'),
    should = chai.should(),
    UserOrganism = require('../modules/Users/organisms/organism-user'),
    apiUrl = process.env.APP_URI || require('../env').settings.APP_URI

let token = null

chai.use(chaiHttp)

//Our parent block
describe('Users', () => {

    // Erase the database before and after testing
    before((done) => {
        UserOrganism.remove({}, (err) => {
            done()
        })
    })

    after((done) => {
        UserOrganism.remove({}, (err) => {
            done()
        })
    })

    describe('/POST user', () => {
        it('it should not POST a user without email field', (done) => {

            const user = {
                password: '123'
            }

            chai.request(apiUrl)
                .post(`/users`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('object')
                    res.body.should.have.property('success')
                    res.body.should.have.property('message')
                    res.body.message.should.be.a('array')
                    done()
                })
        })

    })

    describe('/POST user', () => {
        it('it should POST a user', (done) => {

            const user = {
                email: `${Date.now()}@strv.com`,
                password: '123123'
            }

            chai.request(apiUrl)
                .post(`/users`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('success')
                    res.body.success.should.be.eql(true)
                    done()
                })
        })

    })

    describe('/POST user authentication', () => {
        it('it should authenticate a user', (done) => {

            const user = {
                email: 'caue@strv.com',
                password: '123123'
            }

            chai.request(apiUrl)
                .post(`/users/auth`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data')
                    res.body.data.should.have.property('token')
                    token = res.body.data.token
                    done()
                })
        })

    })

    describe('/POST contact', () => {
        it('it should POST a contact on firebase', (done) => {

            const contact = {
                "firstName": "Cauê",
                "lastName": "Almeida",
                "email": "caue@strv.com",
                "mobilenumber": "227777770",
                "telephonenumber": "227777770",
                "address": "Kaprova 45/10, 110 00 Staré Město, Chéquia",
                "companyName": "STRV"
            }

            chai.request(apiUrl)
                .post(`/contacts`)
                .set('Authorization', token)
                .send(contact)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('success')
                    res.body.success.should.be.eql(true)
                    done()
                })
        })

    })

})