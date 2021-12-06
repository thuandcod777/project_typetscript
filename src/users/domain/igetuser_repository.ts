import Users from "./users";

export default interface IGetuserRepository {
    getUser(): Promise<Users[]>
}