import { ScopeCollection } from "../entities/scope-collection.entity";

export default interface IScopeRepository {
    saveScopeList(email: string, scopeData: ScopeCollection[]): Promise<ScopeCollection>;
}