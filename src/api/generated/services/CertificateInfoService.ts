/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CertificateInfoDto } from '../models/CertificateInfoDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CertificateInfoService {
    /**
     * Keystore sertifikalarını listele
     * Yapılandırılmış keystore (PKCS#11 veya PFX) içerisindeki tüm sertifikaları listeler. Bu endpoint ile alias ve serial number bilgilerini öğrenebilirsiniz.
     * @returns CertificateInfoDto Sertifika listesi başarıyla döndürüldü
     * @throws ApiError
     */
    public static listCertificates(): CancelablePromise<CertificateInfoDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/certificates/list',
            errors: {
                500: `Keystore yüklenemedi veya sertifikalar okunamadı`,
            },
        });
    }
    /**
     * Keystore bilgilerini getir
     * Yapılandırılmış keystore hakkında genel bilgi döndürür (tip, yol, slot, vb.)
     * @returns any Keystore bilgileri başarıyla döndürüldü
     * @throws ApiError
     */
    public static getKeystoreInfo(): CancelablePromise<Record<string, Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/certificates/info',
        });
    }
}
