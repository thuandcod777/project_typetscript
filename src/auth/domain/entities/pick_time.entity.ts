export interface IGroupPickTime {
    [time: string]: {
        count: number;
        items: PickTime[]
    }
}

interface IPickTimeJSON {
    pickTime: string;
    statusPickTime: string;
}

export class PickTime {
    pickTime: string;
    statusPickTime: string;

    constructor({ pickTime = "", statusPickTime = "", }: Partial<IPickTimeJSON> = {}) {
        this.pickTime = pickTime;
        this.statusPickTime = statusPickTime;
    }

    static fromJson(json: IPickTimeJSON): PickTime {
        return new PickTime({
            pickTime: json.pickTime,
            statusPickTime: json.statusPickTime,
        });
    }
}