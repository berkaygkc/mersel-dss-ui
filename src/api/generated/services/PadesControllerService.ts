/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignPadesDto } from '../models/SignPadesDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PadesControllerService {
    /**
     * PDF belgelerini PAdES imzası ile imzalar
     * PDF belgelerine gömülü CAdES imzası oluşturur
     * @param formData
     * @returns binary OK
     * @throws ApiError
     */
    public static signPades(
        formData?: SignPadesDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/padessign',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
}
