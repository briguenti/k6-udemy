import http from "k6/http";
import { check, sleep } from "k6";

// - Private API:
//     - Buscando todos os crocodilos
// - Critérios:
//     - Performance test:
//         - 100 VUs por 10s
//         - Limites:
//             - Requisição com falha inferior a 1%
//             - Duração da requisição p(95) < 250

export const options = {
    vus: 100,
    duration: '10s',
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250']
    }
}

const BASE_URL = 'https://test-api.k6.io'

export function setup(){
    const loginResponse = http.post(`${BASE_URL}/auth/token/login/`, {
        username: '0.22760311161128244@mail.com',
        password: 'pwd123'
    })

    const tokenRetornado = loginResponse.json('access')
    return tokenRetornado
}

export default function(tokenRetornado){
    const params = {
        headers: {
            Authorization: `Bearer ${tokenRetornado}`,
            'Content-Type': 'application/json'
        }
    }

    const res = http.get(`${BASE_URL}/my/crocodiles`, params)

    check(res, {
        'status code 200': (r) => r.status === 200
    })

    sleep(1)
}
