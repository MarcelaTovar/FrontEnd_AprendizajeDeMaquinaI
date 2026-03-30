import ApiService from './ApiService';
import endpointConfig from '../configs/endpoint.config';

// GET /agents/branches/
export async function apiGetAgentsBranches<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.agentsBranchesList,
        method: 'get',
    });
}

// POST /agents/branches/create/
export async function apiCreateAgentBranch<T, U extends Record<string, unknown> | FormData>(data: U) {
    return ApiService.fetchDataWithAxios<T, Record<string, unknown> | FormData>({
        url: endpointConfig.agentsBranchesCreate,
        method: 'post',
        data,
    });
}

// DELETE /agents/branches/{branch}/
export async function apiDeleteAgentBranch<T>(branch: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.agentsBranchesDelete(branch),
        method: 'delete',
    });
}

// GET /agents/branches/{branch}/files/
export async function apiGetAgentBranchFiles<T>(branch: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.agentsBranchesFilesList(branch),
        method: 'get',
    });
}

// DELETE /agents/branches/{branch}/files/{filename}/
export async function apiDeleteAgentBranchFile<T>(branch: string, filename: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.agentsBranchesFilesDelete(branch, filename),
        method: 'delete',
    });
}

// POST /agents/rebuild-embeddings/
export async function apiRebuildEmbeddings<T, U extends Record<string, unknown> | FormData>(data: U) {
    return ApiService.fetchDataWithAxios<T, Record<string, unknown> | FormData>({
        url: endpointConfig.agentsRebuildEmbeddings,
        method: 'post',
        data,
    });
}

// POST /agents/upload-pdfs/
export async function apiUploadPdfs<T, U extends Record<string, unknown> | FormData>(data: U) {
    return ApiService.fetchDataWithAxios<T, Record<string, unknown> | FormData>({
        url: endpointConfig.agentsUploadPdfs,
        method: 'post',
        data,
    });
}
