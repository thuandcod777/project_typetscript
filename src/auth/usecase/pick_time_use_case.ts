import { ResponseDto } from "../domain/entities/response.entity";
import type IPickTimeRepository from "../domain/services/ipicktime_repository";

export default class PickTimeUsecase {
    constructor(private picktimeRepository: IPickTimeRepository) { }

    public async execute(): Promise<ResponseDto> {
        const data = await this.picktimeRepository.get_pick_time();
        if (!data || (Array.isArray(data) && data.length === 0)) {

            return ResponseDto.failure('Lấy danh sách đặt lịch thất bại');

        }

        return ResponseDto.success('Lấy danh sách đặt lịch thành công');
    }
}