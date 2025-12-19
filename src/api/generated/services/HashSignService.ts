/* Hash imzalama servisi */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export interface SignHashRequest {
    hash: string;
    hashAlgorithm?: string;
}

export interface SignHashResponse {
    signatureValue: string;
    certificate: string;
    certificateChain: string;
    signatureAlgorithm: string;
}

export class HashSignService {
    /**
     * Hash değerini imzalar
     * Client tarafında hazırlanan hash değerini imzalar ve imza değeri ile sertifika bilgilerini döner.
     * @param requestBody
     * @returns SignHashResponse İmza ve sertifika bilgileri
     * @throws ApiError
     */
    public static signHash(
        requestBody: SignHashRequest,
    ): CancelablePromise<SignHashResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/signhash',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
}
