describe('API - Produtos', () => {
  let token;
  let produtoId;
  let userId;
  const email = `qa_${Date.now()}@teste.com`;
  const senha = '123456';

  before(() => {
    // 1️⃣ Cria usuário
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: 'Usuário QA Produto',
        email: email,
        password: senha,
        administrador: 'true'
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      userId = res.body._id;
      cy.log('Usuário criado:', userId);

      // 2️⃣ Faz login e armazena token
      cy.request({
        method: 'POST',
        url: '/login',
        body: {
          email: email,
          password: senha
        }
      }).then((loginRes) => {
        expect(loginRes.status).to.eq(200);
        token = loginRes.body.authorization;
        cy.log('Token obtido:', token);
      });
    });
  });

  it('Deve cadastrar um novo produto', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { Authorization: token },
      body: {
        nome: `Notebook QA ${Date.now()}`,
        preco: 4500,
        descricao: 'Notebook de testes automáticos',
        quantidade: 5
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
      produtoId = res.body._id;
      cy.log('Produto criado com ID:', produtoId);
    });
  });

  it('Deve listar produtos', () => {
    cy.request('https://serverest.dev/produtos').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.produtos).to.be.an('array');
    });
  });

  it('Deve editar o produto criado', () => {
    cy.request({
      method: 'PUT',
      url: `/produtos/${produtoId}`,
      headers: { Authorization: token },
      body: {
        nome: 'Notebook QA Atualizado',
        preco: 4800,
        descricao: 'Versão revisada',
        quantidade: 10
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro alterado com sucesso');
    });
  });

  it('Deve deletar o produto criado', () => {
    cy.request({
      method: 'DELETE',
      url: `/produtos/${produtoId}`,
      headers: { Authorization: token }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
    });
  });

  after(() => {
    // 3️⃣ Deleta o usuário criado
    cy.request({
      method: 'DELETE',
      url: `/usuarios/${userId}`,
      headers: { Authorization: token }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
      cy.log('Usuário deletado:', userId);
    });
  });
});
