import { Types } from 'mongoose';

export interface IPickTimeItem {
    _id: Types.ObjectId;
    status_pick_time: {
        pick_time: string;
    };
}

export type IListPickTime = IPickTimeItem[];


export interface IPickTimeJSON {
    pick_time: string;
    status_pick_time: string;
}

export class PickTime {
    pick_time: string;
    status_pick_time: string;

    constructor({ pick_time = "", status_pick_time = "", }: Partial<IPickTimeJSON> = {}) {
        this.pick_time = pick_time;
        this.status_pick_time = status_pick_time;
    }

    static fromJson(json: IPickTimeJSON): PickTime {
        return new PickTime({
            pick_time: json.pick_time,
            status_pick_time: json.status_pick_time,
        });
    }
}