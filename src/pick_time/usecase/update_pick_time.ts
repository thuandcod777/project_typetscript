import IPickTimeRepository from "../domain/ipicktime_repository";

export default class UpdatePickTimeUsecase {
    constructor(private pickTimeRepository: IPickTimeRepository) { }
    public async execute(order_code: string, pick_time: string, status_pick_time: string): Promise<boolean> {
        const dataPickTime = await this.pickTimeRepository.get_pick_time();

        if (dataPickTime && !Array.isArray(dataPickTime) && dataPickTime[pick_time]) {
            if (dataPickTime[pick_time].count >= 5) {
                return false; // Khung giờ đã đầy, không cho đặt tiếp
            }
        }

        const isSaved = await this.pickTimeRepository.save_pick_time(order_code, pick_time, status_pick_time);
        if (!isSaved) {
            return false;
        }
        const isUpdated = await this.pickTimeRepository.update_status_pick_time(order_code, true);
        if (!isUpdated) {

            return false;
        }
        return true;
    }
}