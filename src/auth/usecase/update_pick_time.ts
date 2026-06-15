import IPickTimeRepository from "../domain/services/ipicktime_repository";

export default class UpdatePickTimeUsecase {
    constructor(private pickTimeRepository: IPickTimeRepository) { }
    public async execute(orderCode: string, pick_time: string, status_pick_time: string): Promise<boolean> {
        const dataPickTime = await this.pickTimeRepository.get_pick_time();

        if (dataPickTime && !Array.isArray(dataPickTime) && dataPickTime[pick_time]) {
            if (dataPickTime[pick_time].count >= 5) {
                return false; // Khung giờ đã đầy, không cho đặt tiếp
            }
        }

        const isSaved = await this.pickTimeRepository.update_status_pick_time(orderCode, pick_time, status_pick_time);

        if (!isSaved) {
            return false;
        }

        return true;
    }
}