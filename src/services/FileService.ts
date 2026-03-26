import ApiService from './ApiService'
import endpointConfig from '../configs/endpoint.config'

export async function apiGetFiles<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.getfiles,
        method: 'get',
        params,
    })
}

