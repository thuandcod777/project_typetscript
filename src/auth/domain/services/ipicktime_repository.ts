import type { IGroupPickTime } from "../entities/pick_time.entity.js";

export default interface IPickTimeRepository {
    get_pick_time(): Promise<IGroupPickTime | []>;
    update_status_pick_time(orderCode: string, pick_time: string, status_pick_time: string): Promise<boolean>;
}