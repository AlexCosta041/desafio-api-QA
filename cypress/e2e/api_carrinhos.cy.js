describe('API - Carrinhos', () => {
  let token;
  let produtoId;
  let email = `qa_${Date.now()}@teste.com`;
  let senha = '1234';
  let userId;

  before(() => {
    // 1️⃣ Cria usuário
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: 'Usuário QA Carrinho',
        email: email,
        password: senha,
        administrador: 'true'
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      cy.log('Usuário criado com sucesso:', email);

      // 2️⃣ Faz login com o usuário criado
      cy.request({
        method: 'POST',
        url: '/login',
        body: { email: email, password: senha }
      }).then((loginRes) => {
        expect(loginRes.status).to.eq(200);
        token = loginRes.body.authorization;
        userId = res.body._id;
        cy.log('Token gerado:', token);

        // 3️⃣ Cria produto autenticado
        cy.request({
          method: 'POST',
          url: '/produtos',
          headers: { Authorization: token },
          body: {
            nome: `Mouse Gamer ${Date.now()}`,
            preco: 200,
            descricao: 'Mouse com fio USB',
            quantidade: 10
          }
        }).then((produtoRes) => {
          expect(produtoRes.status).to.eq(201);
          produtoId = produtoRes.body._id;
          cy.log('Produto criado com ID:', produtoId);
        });
      });
    });
  });

  it('Deve criar um novo carrinho', () => {
    cy.request({
      method: 'POST',
      url: '/carrinhos',
      headers: { Authorization: token },
      body: {
        produtos: [
          {
            idProduto: produtoId,
            quantidade: 2
          }
        ]
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });

  it('Deve listar carrinhos', () => {
    cy.request('https://serverest.dev/carrinhos').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.carrinhos).to.be.an('array');
    });
  });

  it('Deve cancelar compra', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://serverest.dev/carrinhos/cancelar-compra',
      headers: {
      Authorization: `Bearer ${token}`, // ✅ apenas um 'Bearer'
             }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Carrinho cancelado com sucesso');
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
