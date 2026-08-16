import { IPickTimeInputDTO } from "../domain/dtos/pick-time.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import IPickTimeRepository from "../domain/services/ipicktime_repository";

export default class UpdatePickTimeUsecase {
    constructor(private pickTimeRepository: IPickTimeRepository) { }
    public async execute(pickTimeData: IPickTimeInputDTO): Promise<ResponseDto> {

        /*   const dataPickTime = await this.pickTimeRepository.get_pick_time();
  
          if (!dataPickTime.success) {
              return ResponseDto.failure(dataPickTime.message);
          }
   */
        const isSaved = await this.pickTimeRepository.update_status_pick_time(pickTimeData);

        if (!isSaved.success) {
            return ResponseDto.failure(isSaved.message);
        }

        return ResponseDto.success(isSaved.message);
    }
}