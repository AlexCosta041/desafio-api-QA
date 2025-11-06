/// <reference types="cypress" />

describe('API - Login', () => {
  let userId;
  let email = `qa_${Date.now()}@test.com`; // e-mail dinâmico para evitar duplicidade
it('Deve cadastrar um novo usuário com sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: 'QA Automação',
        email: email,
        password: '1234',
        administrador: 'true'
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
      expect(res.body._id).to.exist;
      userId = res.body._id;
    });
  });

 const baseUrl = 'https://serverest.dev';
  it('Deve realizar login com sucesso', () => {
     cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      body: {
        email: email,
        password: '1234'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Login realizado com sucesso');
      expect(response.body.authorization).to.exist;
    });
  });

  it('Não deve realizar login com senha incorreta', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      failOnStatusCode: false,
      body: {
        email: 'fulano@qa.com',
        password: 'senhaErrada'
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Email e/ou senha inválidos');
    });
  });

    it('Deve deletar o usuário criado', () => {
    cy.request({
      method: 'DELETE',
      url: `/usuarios/${userId}`
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
    });
  });

  });
