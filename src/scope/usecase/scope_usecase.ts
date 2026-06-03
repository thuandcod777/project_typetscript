import IScopeRepository from "../domain/iscope_repository";
import ScopeCollectionModel, { ScopeModel } from "../domain/scope";


export default class ScopeUsecase {
    constructor(private scopeRepository: IScopeRepository) { }
    public async execute(email: string, scopeData: ScopeModel[]): Promise<ScopeCollectionModel> {
        const scope = await this.scopeRepository.saveScopeList(email, scopeData);
        return scope;
    }
}