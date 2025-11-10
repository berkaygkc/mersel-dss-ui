/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Keystore içerisindeki sertifika detay bilgileri
 */
export type CertificateInfoDto = {
    /**
     * Sertifika alias'ı (keystore içindeki benzersiz adı)
     */
    alias?: string;
    /**
     * Sertifika seri numarası (hexadecimal)
     */
    serialNumberHex?: string;
    /**
     * Sertifika seri numarası (decimal)
     */
    serialNumberDec?: string;
    /**
     * Sertifika subject (kime verildiği)
     */
    subject?: string;
    /**
     * Sertifika issuer (kim tarafından verildiği)
     */
    issuer?: string;
    /**
     * Geçerlilik başlangıç tarihi
     */
    validFrom?: string;
    /**
     * Geçerlilik bitiş tarihi
     */
    validTo?: string;
    /**
     * Private key mevcut mu?
     */
    hasPrivateKey?: boolean;
    /**
     * Sertifika tipi
     */
    type?: string;
    /**
     * İmza algoritması
     */
    signatureAlgorithm?: string;
    /**
     * Sertifika kullanım alanları (Key Usage)
     */
    keyUsage?: string;
    /**
     * Genişletilmiş kullanım alanları (Extended Key Usage)
     */
    extendedKeyUsage?: string;
    /**
     * Sertifika politikaları (Certificate Policies OIDs)
     */
    certificatePolicies?: string;
};

