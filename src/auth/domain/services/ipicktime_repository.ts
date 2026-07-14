import { IPickTimeInputDTO } from "../dtos/pick-time.dto.js";
import type { IGroupPickTime } from "../entities/pick-time.entity.js";

export default interface IPickTimeRepository {
    get_pick_time(): Promise<IGroupPickTime | []>;
    update_status_pick_time(pickTimeData: IPickTimeInputDTO): Promise<boolean>;
}