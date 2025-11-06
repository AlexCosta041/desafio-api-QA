describe('API - Usuários', () => {
  let userId;
  let email = `qa_${Date.now()}@test.com`; 

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

  it('Não deve cadastrar usuário com e-mail duplicado', () => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false,
      body: {
        nome: 'QA Automação',
        email: email, // mesmo e-mail do teste anterior
        password: '1234',
        administrador: 'true'
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq('Este email já está sendo usado');
    });
  });

  it('Deve listar todos os usuários', () => {
    cy.request('/usuarios').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.usuarios).to.be.an('array');
      expect(res.body.quantidade).to.be.greaterThan(0);
    });
  });

  it('Deve buscar usuário por ID', () => {
    cy.request(`/usuarios/${userId}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.nome).to.eq('QA Automação');
      expect(res.body.email).to.eq(email);
    });
  });

  it('Deve editar um usuário existente', () => {
    cy.request({
      method: 'PUT',
      url: `/usuarios/${userId}`,
      body: {
        nome: 'QA Automação Atualizado',
        email: email,
        password: '4321',
        administrador: 'true'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro alterado com sucesso');
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
