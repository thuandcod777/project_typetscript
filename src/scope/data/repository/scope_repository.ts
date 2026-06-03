import { Mongoose } from "mongoose";
import IScopeRepository from "../../domain/iscope_repository";
import { IScopeCollection, IScopeSchema } from "../models/scope_model";
import ScopeCollectionModel, { ScopeModel } from "../../domain/scope";

export default class ScopeRepository implements IScopeRepository {
    constructor(private readonly client: Mongoose) { }
    public async saveScopeList(email: string, scopeList: ScopeModel[]): Promise<ScopeCollectionModel> {

        const scope = this.client.model<IScopeCollection>('Scope', IScopeSchema);

        if (!scopeList) {
            throw new Error("Scope list cannot be null");
        }

        const formattedScopes = scopeList.map(scope => ({
            address: scope.address,
            location: scope.latlng.toGeoJson()
        }));

        const saveScope = await scope.create({ email: email, scopes: formattedScopes });

        return ScopeCollectionModel.fromJson(saveScope.toJSON())
    }
}