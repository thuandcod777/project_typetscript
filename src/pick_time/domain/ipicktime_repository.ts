import type { IGroupPickTime, PickTimeModel } from "./pick_time.js";

export default interface IPickTimeRepository {
    get_pick_time(): Promise<IGroupPickTime | []>;
    update_status_pick_time(orderCode: string, statusPickTime: boolean): Promise<boolean>;
    save_pick_time(orderCode: string, pick_time: string, status_pick_time: string): Promise<boolean>;
}