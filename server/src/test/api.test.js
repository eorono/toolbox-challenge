const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index') // Importamos nuestra App de Express
const expect = chai.expect

chai.use(chaiHttp)

describe('API Rest Files', () => {

    describe('GET /files/data', () => {
        it('Debe retornar un status 200 y un array de objetos', (done) => {
            chai.request(app)
                .get('/files/data')
                .end((err, res) => {
                    // Validaciones básicas del protocolo HTTP
                    expect(res).to.have.status(200)
                    expect(res).to.be.json

                    // Validaciones de la estructura de datos pedida en el PDF
                    expect(res.body).to.be.an('array')

                    // Si hay datos, validamos el formato del primer elemento
                    if (res.body.length > 0) {
                        const fileObj = res.body[0]
                        expect(fileObj).to.have.property('file')
                        expect(fileObj).to.have.property('lines')
                        expect(fileObj.lines).to.be.an('array')

                        // Validamos las propiedades internas de las líneas
                        if (fileObj.lines.length > 0) {
                            const line = fileObj.lines[0]
                            expect(line).to.have.property('text')
                            expect(line).to.have.property('number').that.is.a('number')
                            expect(line).to.have.property('hex')
                        }
                    }
                    done()
                })
        })
    })
})