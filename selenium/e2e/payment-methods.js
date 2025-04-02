const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('payment methods', function () {
  this.timeout(30000); // aumenta o timeout padrão

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.manage().deleteAllCookies();
    await driver.get('http://localhost:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
  });

  it('change cash on delivery position', async () => {
    // Click in payment methods in side menu
    await driver.findElement(By.linkText('Payment methods')).click();
    // Type in value input to search for specify payment method
    await driver.findElement(By.id('criteria_search_value')).sendKeys('cash');
    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    // Click in edit of the last payment method
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();
    // Type 1 in position field
    await driver.findElement(By.id('sylius_payment_method_position')).clear();
    await driver.findElement(By.id('sylius_payment_method_position')).sendKeys('1');
    // Click on Save changes button
    await driver.findElement(By.id('sylius_save_changes_button')).click();
    // Assert that payment method has been updated
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully updated.'));
  });

  it('acessa listagem de métodos de pagamento e verifica título da página', async () => {
    // Acessa o menu Payment Methods
    await driver.findElement(By.linkText('Payment methods')).click();
    // Verifica que o título da página é o esperado
    const title = await driver.findElement(By.css('h1.ui.header')).getText();
    assert(title.includes('Payment methods'));
  });

  it('verifica se a listagem inicial mostra múltiplos métodos de pagamento', async () => {
    // Acessa o menu Payment Methods
    await driver.findElement(By.linkText('Payment methods')).click();
    // Verifica que aparecem métodos conhecidos na listagem
    const body = await driver.findElement(By.tagName('body')).getText();
    assert(body.includes('Cash on delivery'));
    assert(body.includes('Bank transfer'));
  });

  it('acessa a tela de criação de método offline e volta para a listagem', async () => {
    // Acessa o menu Payment Methods
    await driver.findElement(By.linkText('Payment methods')).click();

    // Abre o dropdown "Create"
    const createDropdown = await driver.findElement(By.css('.ui.labeled.icon.top.right.floating.dropdown.button'));
    await createDropdown.click();

    // Aguarda e clica na opção "Offline"
    const offlineOption = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Offline')]")), 5000);
    await offlineOption.click();

    // Verifica se o campo de nome está visível
    await driver.wait(until.elementLocated(By.id('sylius_payment_method_translations_en_US_name')), 5000);

    // Clica em "Cancel" para voltar
    await driver.findElement(By.xpath("//a[contains(text(),'Cancel')]")).click();

    // Verifica se está na URL de listagem
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes('/admin/payment-methods'));
  });

  it('valida que botão "Create" está visível e funcional', async () => {
    // Acessa o menu Payment Methods
    await driver.findElement(By.linkText('Payment methods')).click();
    // Abre o dropdown "Create"
    const createDropdown = await driver.findElement(By.css('.ui.labeled.icon.top.right.floating.dropdown.button'));
    await createDropdown.click();
    // Aguarda as opções aparecerem
    const offline = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Offline')]")), 5000);
    const paypal = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'PayPal')]")), 5000);
    // Verifica visibilidade dos dois
    assert(await offline.isDisplayed());
    assert(await paypal.isDisplayed());
  });

  it('verifica se colunas essenciais estão presentes na tabela de métodos de pagamento', async () => {
    // Acessa o menu Payment Methods
    await driver.findElement(By.linkText('Payment methods')).click();
  
    // Aguarda a tabela aparecer
    const table = await driver.wait(until.elementLocated(By.css('table')), 5000);
    const tableText = await table.getText();
  
    // Verifica se contém os títulos principais das colunas
    assert(tableText.includes('Code'));
    assert(tableText.includes('Name'));
    assert(tableText.includes('Enabled'));
    assert(tableText.includes('Position'));
  });
  

  it('verifica que a URL de listagem termina com /admin/payment-methods', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    const url = await driver.getCurrentUrl();
    assert(url.endsWith('/admin/payment-methods'));
  });

  it('verifica se há pelo menos um botão de editar visível', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    assert(buttons.length > 0);
  });

  it('valida que os campos de filtro estão presentes na listagem', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.id('criteria_search_value'));
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
  });

  it('verifica que o botão "Create" está presente no topo da listagem', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    const createBtn = await driver.findElement(By.xpath("//a[contains(text(), 'Create')]"));
    assert(await createBtn.isDisplayed());
  });

  it('verifica que há pelo menos uma linha na tabela de métodos de pagamento', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    const rows = await driver.findElements(By.css('table tbody tr'));
    assert(rows.length > 0);
  });
});
