export interface IScopeInputDTO {
    user_id: string;
    step_contract: number;
    scopes: {
        is_scope: boolean;
        address: string;
        location: {
            type: string;
            coordinates: [number, number];
        };
    }[];
    is_success: boolean;
}