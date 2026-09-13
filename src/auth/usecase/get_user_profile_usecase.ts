import { IUserSessionInputDTO } from "../domain/dtos/register_input.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import IAuthRepository from "../domain/services/iauth_repository";
import IContractRepository from "../domain/services/icontract_repository";
import UserContract from "../domain/entities/object_data.entity";
import { Contract } from "../domain/entities/contract.entity";
import ObjectData from "../domain/entities/object_data.entity";

export default class GetUserProfileUsecase {
    constructor(private authRepository: IAuthRepository, private contractRepository: IContractRepository) { }

    public async execute(userSession: IUserSessionInputDTO): Promise<ResponseDto<ObjectData>> {

        const isUserProfile = await this.authRepository.getUserProfileFromSession(userSession.token, userSession.role);

        if (!isUserProfile.success) {
            return ResponseDto.failure(isUserProfile.message);
        }
        let contractData: Contract | null = null;

        if (userSession.role === 'cooperative') {
            const isContract = await this.contractRepository.getContract(isUserProfile.userData!._id!.toString());
            if (!isContract.success) {
                return ResponseDto.failure(isContract.message);
            }
            contractData = isContract.contractData;
        }


        const userContract = new ObjectData(
            { user: isUserProfile.userData!, contract: contractData }
        );

        return ResponseDto.success(isUserProfile.message, userContract);

    }
}