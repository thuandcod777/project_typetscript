"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickTime = void 0;
class PickTime {
    name_sender;
    number_phone;
    license;
    pick_time;
    status_pick_time;
    constructor({ name_sender, number_phone, license, pick_time, status_pick_time }) {
        this.name_sender = name_sender;
        this.number_phone = number_phone;
        this.license = license;
        this.pick_time = pick_time;
        this.status_pick_time = status_pick_time;
    }
    static fromJson(json) {
        return new PickTime({
            name_sender: json.name_sender,
            number_phone: json.number_phone,
            license: json.license,
            pick_time: json.pick_time,
            status_pick_time: json.status_pick_time,
        });
    }
}
exports.PickTime = PickTime;
