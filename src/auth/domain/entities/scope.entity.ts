import { IScopeCollectionJson, ScopeCollection } from "./scope-collection.entity";

export interface IScopeJSON {
    is_success: boolean;
    scopes: IScopeCollectionJson[];
}

export default class Scope {
    readonly is_success: boolean;
    readonly scopes: ScopeCollection[];

    constructor({ is_success, scopes }: {
        is_success: boolean,
        scopes: ScopeCollection[]
    } = { is_success: false, scopes: [] }) {
        this.is_success = is_success;
        this.scopes = scopes;
    }

    public static fromJson(json: IScopeJSON): Scope {

        return new Scope({
            is_success: json.is_success,
            scopes: json.scopes.map(item => ScopeCollection.fromJson(item))
        });

    }
}