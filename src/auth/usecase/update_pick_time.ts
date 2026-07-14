import { IPickTimeInputDTO } from "../domain/dtos/pick-time.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import IPickTimeRepository from "../domain/services/ipicktime_repository";

export default class UpdatePickTimeUsecase {
    constructor(private pickTimeRepository: IPickTimeRepository) { }
    public async execute(pickTimeData: IPickTimeInputDTO): Promise<ResponseDto> {

        const dataPickTime = await this.pickTimeRepository.get_pick_time();

        if (dataPickTime && !Array.isArray(dataPickTime) && dataPickTime[pickTimeData.pick_time]) {
            if (dataPickTime[pickTimeData.pick_time].count >= 5) {
                return ResponseDto.failure('Không còn trống lịch vận chuyển');
            }
        }

        const isSaved = await this.pickTimeRepository.update_status_pick_time(pickTimeData);

        if (!isSaved) {
            return ResponseDto.failure('Cập nhật lịch hẹn thất bại');
        }

        return ResponseDto.success('Cập nhật lịch hẹn thành công');
    }
}