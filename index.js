const {
  $,
  clear,
  click,
  openBrowser,
  goto,
  focus,
  write,
  textBox,
  closeBrowser,
  press,
} = require('taiko');

const apontamento = require('./apontamento.json');

const CPF = (() => { throw new Error('coloque cpf aqui') })();
const senha = (() => { throw new Error('coloque senha aqui') })();
const mesAno = '04/2020';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login() {
  await focus(textBox({ id: 'contentCentral_txtUsuario' }));
  await write(CPF);
  await press('Tab')
  await write(senha);
  await press('Tab')
  await write("59"); // token
  await press('Enter');
}

async function marcacaoDia({ dia, entrada, saida }) {
  await click($('[data-marcacao="' + dia + '"] [data-horaprimeramarcacao] input'));
  await press('Enter');
  await write(entrada);
  await click('Home Office');
  await click('Confirmar');
  await sleep(2000);

  await click($('[data-marcacao="' + dia + '"] [data-horasegundamarcacao] input'));
  await press('Enter');
  await write(saida);
  await click('Home Office');
  await click('Confirmar');
  await sleep(2000);
}

(async () => {
  try {
    await openBrowser({
      headless: false
    });
    await goto("https://portal.orisrh.com/");
    await login();

    await click($("#op690"));
    await click("Apontamento");
    await focus($('#contentPaginasInternas_txtAnoMes'));
    await clear($('#contentPaginasInternas_txtAnoMes'));
    await write(mesAno);
    await press('Enter');

    for await (d of apontamento) {
      await marcacaoDia(d)
    }
  } catch (error) {
    console.error(error);
  } finally {
    closeBrowser();
  }
})();