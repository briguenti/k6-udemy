import http from 'k6/http'
import { check } from 'k6'
import { Counter, Gauge, Rate, Trend } from 'k6/metrics'

export const options = {
    vus: 1,
    duration: '15s',
    thresholds: { //limites a serem validados pelo teste
        http_req_failed: ['rate < 0.01'], //definição de limite sobre as requsições com falhas
        http_req_duration: [{threshold: 'p(95) < 200', abortOnFail: true, delayAbortEval: '6s'}], //limite referente a duração da requisição e o valor desse limite tem que ser o percentil de 95 inferior a 200ms. A partir do momento em que o teste não atingir o percentil, ele vai ser abordato
        checks: ['rate > 0.99']
    }
}

const chamadas = new Counter('Qtd chamadas')
const myGauge = new Gauge('Tempo bloqueado')
const myRate = new Rate('Taxa Req. 200')
const myTrend = new Trend('Taxa de espera')


export default function () {
    const res = http.get('http://test.k6.io')
    check(res, { //res como parametro da função check
        'status code é 200': (r) => r.status === 200 //definindo um nome para a verificação. 
    })
    chamadas.add(1)
    myGauge.add(res.timings.blocked)
    myRate.add(res.status === 200)
    myTrend.add(res.timings.waiting) // Tempo que a requisição ficou esperando para ser realizada
}
