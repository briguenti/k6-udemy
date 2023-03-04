//1. inicialização - vamos carregar arquivos locais, importar módulos. A chamada só ocorre 1x
import sleep from 'k6'

//2. configuração - configuramos dados que são compartilhados entre todas as VU's. É uma etapa chamada uma unica vez durante todo o ciclo de vida do teste.
//Nessa fase pode ter mais de 1 bloco que realize algum tipo de configuração, como requisição previa para obtenção de um token.
export const options = {
    vus: 1,
    duration: '10s'
}

//3. execução ou código VU - Onde executamos nossa função de teste de fato
export default function(){
    console.log('testando k6')
    sleep(1)
}

//4. desmontagem - Etapa opcional, podemos processar resultados, para enviar como tratamento de dados ou webhooks. É executado uma unica vez durante o ciclo de vida
export function teardown(data){
    console.log(data)
}
