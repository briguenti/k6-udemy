import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// - Registration e auth: Login
//     - Realizar o login com um novo usuário
// - Critérios:
//     - Stress test:
//         - Ramp-up 5 VUs em 5s
//         - Carga 5 VUs por 5s
//         - Ramp-up 50 VUs em 2s
//         - Carga 50 VUs em 2s
//         - Ramp-down 0 VU em 5s
//     - Limites:
//         - Requisição com falha inferior a 1%


export const options = {
    stages: [
        //{duration: '3s', target: 1} // smoke test

        {duration: '5s', target: 5},
        {duration: '5s', target: 5},
        {duration: '2s', target: 50},
        {duration: '2s', target: 50},
        {duration: '5s', target: 0}
    ],
    thresholds: {
        http_req_failed: ['rate < 0.01']
    }
}

const csvData = new SharedArray('Ler dados', function(){
    return papaparse.parse(open('./usuarios.csv'), {header: true}).data
})

export default function(){
    const BASE_URL = 'https://test-api.k6.io'
    const USER = csvData[Math.floor(Math.random() * csvData.length)].email
    const PASS = 'pwd123'
    console.log(USER + PASS)

    const res = http.post(`${BASE_URL}/auth/token/login/`, {
        username: USER,
        password: PASS
    })

    check(res, {
        'Sucesso login': (r) => r.status === 200,
        'Token gerado': (r) => r.json('access') !== ''
    })

    sleep(1)
}