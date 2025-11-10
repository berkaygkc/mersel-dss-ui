/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignWsSecurityDto } from '../models/SignWsSecurityDto';
import type { SignXadesDto } from '../models/SignXadesDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class XadesControllerService {
    /**
     * XML belgelerini XAdES imzası ile imzalar
     * e-Fatura, e-Arşiv Raporu, Uygulama Yanıtı, İrsaliye, HrXml ve diğer XML belgelerini destekler
     * @param formData
     * @returns binary OK
     * @throws ApiError
     */
    public static signXades(
        formData?: SignXadesDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/xadessign',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * SOAP zarfını WS-Security ile imzalar
     * SOAP 1.1/1.2 mesajları için WS-Security imzası oluşturur
     * @param formData
     * @returns binary OK
     * @throws ApiError
     */
    public static signWsSecurity(
        formData?: SignWsSecurityDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/wssecuritysign',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
}
