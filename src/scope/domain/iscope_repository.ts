import ScopeCollectionModel, { ScopeModel } from "./scope";

export default interface IScopeRepository {
    saveScopeList(email: string, scopeData: ScopeModel[]): Promise<ScopeCollectionModel>;
}