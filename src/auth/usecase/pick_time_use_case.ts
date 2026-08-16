import { ResponseDto } from "../domain/entities/response.entity";
import type IPickTimeRepository from "../domain/services/ipicktime_repository";

export default class PickTimeUsecase {
    constructor(private picktimeRepository: IPickTimeRepository) { }

    public async execute(): Promise<ResponseDto> {
        const data = await this.picktimeRepository.get_pick_time();
        if (!data.success) {

            return ResponseDto.failure(data.message);

        }

        return ResponseDto.success(data.message, data.data);
    }
}