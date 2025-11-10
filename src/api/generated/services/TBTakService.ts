/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TubitakCreditResponseDto } from '../models/TubitakCreditResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TBTakService {
    /**
     * TÜBİTAK zaman damgası kontör bilgisini sorgular
     * TÜBİTAK ESYA zaman damgası servisi için kalan kontör miktarını döndürür. Bu endpoint sadece IS_TUBITAK_TSP=true olarak yapılandırılmışsa kullanılabilir.
     * @returns TubitakCreditResponseDto Kontör bilgisi başarıyla sorgulandı
     * @throws ApiError
     */
    public static getCreditInfo(): CancelablePromise<TubitakCreditResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tubitak/credit',
            errors: {
                400: `TÜBİTAK modu aktif değil veya yapılandırma eksik`,
                500: `Kontör sorgulaması başarısız`,
            },
        });
    }
}
