/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TimestampValidationResponseDto } from '../models/TimestampValidationResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TimestampService {
    /**
     * Zaman damgasını doğrula
     * RFC 3161 zaman damgasını doğrular. Timestamp token'ın imzasını, TSA sertifikasını ve isteğe bağlı olarak orijinal belgenin hash'ini doğrular. Detaylı doğrulama raporu döner.
     * @param formData
     * @returns TimestampValidationResponseDto Doğrulama tamamlandı (başarılı veya başarısız olabilir)
     * @throws ApiError
     */
    public static validateTimestamp(
        formData?: {
            /**
             * Doğrulanacak timestamp token dosyası (.tst veya binary)
             */
            timestampToken: Blob;
            /**
             * Orijinal belge (hash doğrulaması için - opsiyonel)
             */
            originalDocument?: Blob;
        },
    ): CancelablePromise<TimestampValidationResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/timestamp/validate',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Geçersiz istek`,
                500: `Doğrulama yapılamadı`,
            },
        });
    }
    /**
     * Binary belge için zaman damgası al
     * Herhangi bir binary belge için RFC 3161 standardına uygun zaman damgası alır. Timestamp token'ı binary (application/octet-stream) olarak döner. Metadata bilgileri HTTP response header'larında gelir: X-Timestamp-Time, X-Timestamp-TSA, X-Timestamp-Serial, X-Timestamp-Hash-Algorithm
     * @param hashAlgorithm Hash algoritması
     * @param formData
     * @returns any Zaman damgası başarıyla alındı (binary .tst dosyası)
     * @throws ApiError
     */
    public static getTimestamp(
        hashAlgorithm: string = 'SHA256',
        formData?: {
            /**
             * Zaman damgası alınacak dosya
             */
            document: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/timestamp/get',
            query: {
                'hashAlgorithm': hashAlgorithm,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Geçersiz istek veya timestamp servisi yapılandırılmamış`,
                500: `Zaman damgası alınamadı`,
            },
        });
    }
    /**
     * Timestamp servisi durumunu kontrol et
     * Timestamp servisinin yapılandırılmış ve kullanıma hazır olup olmadığını kontrol eder.
     * @returns any Servis durumu (JSON object: {configured: boolean, message: string})
     * @throws ApiError
     */
    public static getStatus(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/timestamp/status',
        });
    }
}
