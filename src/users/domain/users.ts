export default class Users {
    constructor(public readonly id: string,
        public readonly email: string,
        public readonly name: string,
        public readonly password: string,
        public readonly type: string,
    ) { }
}