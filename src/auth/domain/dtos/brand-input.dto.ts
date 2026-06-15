import { IProductBrandInputDTO } from "./product-brand-input.dto";

export interface IBrandInputDTO {
    nameBrand: string;
    product: IProductBrandInputDTO[]
}