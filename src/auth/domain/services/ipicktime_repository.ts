import { IPickTimeInputDTO } from "../dtos/pick-time.dto.js";
import { IListPickTime } from "../entities/pick-time.entity.js";

export default interface IPickTimeRepository {
    get_pick_time(): Promise<{ success: boolean, message: string, data: IListPickTime }>;
    update_status_pick_time(pickTimeData: IPickTimeInputDTO): Promise<{ success: boolean, message: string }>;
}