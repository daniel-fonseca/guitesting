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

  it('acessa listagem de métodos de pagamento e verifica título da página', () => {
    // Acessa o menu Payment Methods
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Verifica que o título da página é o esperado
    cy.get('h1.ui.header').should('contain.text', 'Payment methods');
  });

  it('verifica se a listagem inicial mostra múltiplos métodos de pagamento', () => {
    // Acessa o menu Payment Methods
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Verifica que aparecem métodos conhecidos na listagem
    cy.contains('Cash on delivery', { timeout: 10000 }).should('be.visible');
    cy.contains('Bank transfer', { timeout: 10000 }).should('be.visible');
  });

  it('acessa a tela de criação de método offline e volta para a listagem', () => {
    // Acessa o menu Payment Methods
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Passa o mouse sobre o botão "Create" e abre o submenu
    cy.contains('Create', { timeout: 10000 }).realHover();
    // Clica na opção "Offline"
    cy.contains('Offline').click({ force: true });
    // Verifica se o campo de nome está visível
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').should('be.visible');
    // Clica no botão "Cancel" para voltar para a listagem
    cy.contains('Cancel').click();
    // Verifica se voltou para a URL de listagem
    cy.url().should('include', '/admin/payment-methods');
  });

  it('valida que botão "Create" está visível e funcional', () => {
    // Acessa o menu Payment Methods
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Verifica que o botão "Create" está visível e clicável
    cy.contains('Create', { timeout: 10000 }).should('be.visible').realHover().click({ force: true });
    // Verifica que aparecem as opções do submenu
    cy.contains('Offline').should('be.visible');
    cy.contains('PayPal').should('be.visible');
  });

  it('verifica se colunas essenciais estão presentes na tabela de métodos de pagamento', () => {
    // Acessa o menu Payment Methods
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Verifica a presença dos nomes das colunas principais
    cy.get('table').should('contain.text', 'Code');
    cy.get('table').should('contain.text', 'Name');
    cy.get('table').should('contain.text', 'Enabled');
    cy.get('table').should('contain.text', 'Position');
  });
  
});
