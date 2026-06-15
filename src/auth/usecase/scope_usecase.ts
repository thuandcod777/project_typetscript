import { ScopeCollection } from "../domain/entities/scope-collection.entity";
import IScopeRepository from "../domain/services/iscope_repository";

export default class ScopeUsecase {
    constructor(private scopeRepository: IScopeRepository) { }
    public async execute(email: string, scopeList: ScopeCollection[]): Promise<ScopeCollection> {
        const scope = await this.scopeRepository.saveScopeList(email, scopeList);
        return scope;
    }
}