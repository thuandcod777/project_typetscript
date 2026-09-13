import { Types } from 'mongoose';

export interface IPickTimeItem {
    _id: Types.ObjectId;
    status_schedule: {
        pick_time: string;
    };
}

export type IListPickTime = IPickTimeItem[];


export interface IPickTimeJSON {
    name_sender: string;
    number_phone: string;
    license: string;
    pick_time: string;
    status_pick_time: string;
}

export class PickTime {
    name_sender: string;
    number_phone: string;
    license: string;
    pick_time: string;
    status_pick_time: string;

    constructor({ name_sender, number_phone, license, pick_time, status_pick_time }: {
        name_sender: string,
        number_phone: string,
        license: string,
        pick_time: string,
        status_pick_time: string
    }) {
        this.name_sender = name_sender;
        this.number_phone = number_phone;
        this.license = license;
        this.pick_time = pick_time;
        this.status_pick_time = status_pick_time;
    }

    static fromJson(json: IPickTimeJSON): PickTime {
        return new PickTime({
            name_sender: json.name_sender,
            number_phone: json.number_phone,
            license: json.license,
            pick_time: json.pick_time,
            status_pick_time: json.status_pick_time,
        });
    }
}