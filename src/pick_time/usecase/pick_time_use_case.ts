import type PickTimeRepository from "../data/repository/pick_time_repository.js";
import type IPickTimeRepository from "../domain/ipicktime_repository.js";

export default class PickTimeUsecase {
    constructor(private picktimeRepository: IPickTimeRepository) { }

    public async execute(): Promise<boolean> {
        const data = await this.picktimeRepository.get_pick_time();
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return false;
        }
        return true;
    }
}