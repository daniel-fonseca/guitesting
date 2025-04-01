describe('payment methods', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  it('change cash on delivery position', () => {
    // Click in payment methods in side menu
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Type in value input to search for specify payment method
    cy.get('[id="criteria_search_value"]').type('cash');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last payment method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Type 1 in position field
    cy.get('[id="sylius_payment_method_position"]').type('1');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that payment method has been updated
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  });

  it('filtra o método de pagamento bank transfer e verifica visibilidade', () => {
    // Acessa o menu Payment Methods
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Digita "bank" no campo de busca
    cy.get('[id="criteria_search_value"]').type('bank');
    // Clica no botão de filtro
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Espera o texto "Bank transfer" aparecer de forma robusta
    cy.contains('Bank transfer', { timeout: 10000 }).should('be.visible');
  });

  it('cria um novo método de pagamento Pix BB e valida presença na lista', () => {
    // Acessa o menu Payment Methods
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Aguarda o botão "Create" estar visível e clica
    cy.contains('Create', { timeout: 10000 }).should('be.visible').click();
    // Aguarda o campo de nome estar visível
    cy.get('[id="sylius_payment_method_translations_en_US_name"]', { timeout: 10000 }).should('be.visible');
    // Preenche os campos obrigatórios
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('Pix BB');
    cy.get('[id="sylius_payment_method_code"]').type('pix_bb');
    // Seleciona "Offline" como gateway
    cy.get('[id="sylius_payment_method_gatewayConfig_gatewayName"]').select('Offline');
    // Seleciona "BRL" como moeda
    cy.get('[id="sylius_payment_method_currency"]').select('BRL');
    // Salva o novo método
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    // Valida mensagem de sucesso
    cy.get('body').should('contain', 'Payment method has been successfully created.');
    // Filtra por "pix" para confirmar que aparece na tabela
    cy.get('[id="criteria_search_value"]').type('pix');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Verifica se o método Pix BB está visível
    cy.contains('Pix BB', { timeout: 10000 }).should('be.visible');
  });

  it('desativa o método de pagamento Pix BB e verifica o status', () => {
    // Acessa o menu Payment Methods
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Filtra pelo método Pix BB
    cy.get('[id="criteria_search_value"]').type('pix');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Garante que a linha Pix BB existe antes de tentar editar
    cy.contains('Pix BB', { timeout: 10000 }).parents('tr').within(() => {
      cy.contains('Edit').click();
    });
    // Aguarda o campo de habilitação
    cy.get('[id="sylius_payment_method_enabled"]', { timeout: 10000 }).should('exist');
    // Desmarca o checkbox de "Enable"
    cy.get('[id="sylius_payment_method_enabled"]').uncheck();
    // Salva alterações
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    // Valida mensagem de sucesso
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
    // Filtra novamente para garantir que o método aparece como desativado
    cy.get('[id="criteria_search_value"]').clear().type('pix');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Verifica se a linha contém "Disabled" (status desativado)
    cy.contains('Pix BB', { timeout: 10000 }).parents('tr').should('contain', 'Disabled');
  });
});
