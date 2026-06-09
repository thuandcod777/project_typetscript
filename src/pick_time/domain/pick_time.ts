

export interface IGroupPickTime {
    [time: string]: {
        count: number;
        items: PickTimeModel[]
    }
}

interface IPickTimeJSON {
    order_code: string;
    pick_time: string;
    status_pick_time: string;
}

export class PickTimeModel {
    order_code: string;
    pick_time: string;
    status_pick_time: string;

    constructor({ order_code = "", pick_time = "", status_pick_time = "", }: Partial<IPickTimeJSON> = {}) {
        this.order_code = order_code;
        this.pick_time = pick_time;
        this.status_pick_time = status_pick_time;
    }

    static fromJson(json: IPickTimeJSON): PickTimeModel {
        return new PickTimeModel({
            order_code: json.order_code,
            pick_time: json.pick_time,
            status_pick_time: json.status_pick_time,
        });
    }
}