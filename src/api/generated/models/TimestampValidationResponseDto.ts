/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Zaman damgası doğrulama yanıtı
 */
export type TimestampValidationResponseDto = {
    /**
     * Zaman damgası geçerli mi
     */
    valid?: boolean;
    /**
     * Zaman damgası zamanı (ISO 8601 formatında)
     */
    timestamp?: string;
    /**
     * TSA (Time Stamp Authority) bilgisi
     */
    tsaName?: string;
    /**
     * Kullanılan hash algoritması (human-readable)
     */
    hashAlgorithm?: string;
    /**
     * Hash algoritması OID
     */
    hashAlgorithmOid?: string;
    /**
     * Seri numarası
     */
    serialNumber?: string;
    /**
     * Nonce değeri (varsa)
     */
    nonce?: string;
    /**
     * İmza algoritması (human-readable)
     */
    signatureAlgorithm?: string;
    /**
     * İmza algoritması OID
     */
    signatureAlgorithmOid?: string;
    /**
     * TSA sertifikası (Base64 kodlu PEM formatında)
     */
    tsaCertificate?: string;
    /**
     * Sertifika geçerli mi
     */
    certificateValid?: boolean;
    /**
     * Sertifika başlangıç tarihi
     */
    certificateNotBefore?: string;
    /**
     * Sertifika bitiş tarihi
     */
    certificateNotAfter?: string;
    /**
     * Hash doğrulaması başarılı mı (originalData sağlanmışsa)
     */
    hashVerified?: boolean;
    /**
     * Doğrulama hataları veya uyarılar
     */
    errors?: Array<string>;
    /**
     * Doğrulama mesajı
     */
    message?: string;
};

