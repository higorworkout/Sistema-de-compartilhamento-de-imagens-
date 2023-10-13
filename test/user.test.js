let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let mainUser = {
    name: "Higor Soares", email: "higor@guia.com", password: "12345"
} 

beforeAll(() => {
    // Inserir usuário Victor no BD
   return request.post("/user")
    .send(mainUser)
    .then( res => console.log("criado"))
    .catch(err => console.log(err))
});

afterAll(() => {
    // Remover o usuario do banco
 });

// antes de cada comando test ele é executado. 
// beforeEach();

// // Apos cada test
// afterEach();

describe("Cadastro de usuário", () => {
    test("Should sign in a user with success", () => {

        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user = {name: "Higor", email, password: "123456"};

        return request.post("/user")
        .send(user).then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);
        }).catch(err => {
            console.log(err);
        })
    })

    test("Deve impedir que um usuário se cadastre com os dados vazios", () => {
        let user = {name: "", email: "", password: ""};

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(400); // 400 = Bad request 
            //expect(res.body.email)
        }).catch(err => {
            console.log(err);
        })



})


    test("Deve impedir que um usuário se cadastre com um e-mail repetido", () => {
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user = {name: "Higor", email, password: "123456"};

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual("E-mail já está cadastrado");

            }).catch(err => {
                console.log(err);
            });
            
        }).catch(err => {
            console.log(err);
        });
    });
});

describe("Autenticação", () => {
    test("Deve me retornar um token quando passar um e-mail e uma senha", () => {
        return request.post("/auth")
        .send({ email: mainUser.email, password: mainUser.password})
        .then((res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        })
        .catch(err => {
            console.log(err);
        })
    });

    test("Deve impedir que um usuário não cadastrado se logue", () => {
        return request.post("/auth")
        .send({email: "umemailqualque@gmail.com", password: "123456"})
        .then(res => {
            console.log(res.body.erros.email);
            expert(res.status).toEqual(403);
            expect(res.body.errors.email).toEqual("E-mail não cadastrado");
        })
        .catch(err => {
            console.log(err);
        })
    })

    test("Deve impedir que um usuário se logue com uma senha errada", () => {
        return request.post("/auth")
        .send({email: mainUser.email, password: "123456a"})
        .then(res => {
            expert(res.statusCode).toEqual(403);
            expect(res.body.errors.password).toEqual("Senha incorreta");
        })
        .catch(err => {
            console.log(err);
        })
    })

})