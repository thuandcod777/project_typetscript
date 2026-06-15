import { Mongoose } from "mongoose";
import IContractRepository from "../../domain/services/icontract_repository";
import { ContractSchema, IContract, IStepContract, StepContractSchema } from "../model/contract_model";
import { IUser, UserSchema } from "../model/auth_model";
import { Contract } from "../../domain/entities/contract.entity";
import { ContractDetails } from "../../domain/entities/contract-details.entity";
import { IContractDetailsInputDTO } from "../../domain/dtos/contract_details_input.dto";
import { IEmailInputDTO } from "../../domain/dtos/email_input.dto";

export default class ContractRepository implements IContractRepository {
    constructor(private readonly client: Mongoose) { }

    public async verify_contract(email: IEmailInputDTO): Promise<boolean> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const stepContractModel = this.client.model<IStepContract>('Contract', StepContractSchema);

        const dbSession = await this.client.startSession();
        dbSession.startTransaction();

        const user = await userModel.findOne({ email: email }).session(dbSession);
        if (!user) {
            console.error(`[DB Error] Không tìm thấy User ID: ${user!._id}`);

            return false;
        }
        const contractId = user.contract;

        if (!contractId) {
            const stepContractData = await stepContractModel.create([{
                contractCode: "TNH234872834",
                stepContract: 2,
                contractDetails: null,
                scope: null,
                contractPdf: null
            }], { session: dbSession })

            user.contract = stepContractData[0]._id as any;
            await user.save({ session: dbSession });

        }

        await dbSession.commitTransaction();
        return true;
    }

    public async create_contract(email: IEmailInputDTO, contractDetail: IContractDetailsInputDTO): Promise<boolean> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const contractModel = this.client.model<IStepContract>('Contract', StepContractSchema);

        const dbSession = await this.client.startSession();
        dbSession.startTransaction();

        const user = await userModel.findOne({ email: email }).session(dbSession);

        if (!user) {
            throw new Error(`User with email ${user} not found`);
        }

        const contractId = user.contract;

        if (!contractId) {
            throw new Error("User does not have a contract assigned");
        }

        // 2. Lấy thông tin contract hiện tại để kiểm tra trường scope
        const contract = await contractModel.findById(contractId).session(dbSession);

        if (!contract) {
            throw new Error("Contract not found");
        }

        const payload: IContract = {
            nameBrandA: contractDetail.nameBrandA,
            nameBrandB: contractDetail.nameBrandB,
            businessRegisterNumber: contractDetail.businessRegisterNumber,
            numberContract: contractDetail.numberContract,
            nameProduct: contractDetail.nameProduct,
            typeWeight: contractDetail.typeWeight,
            typeProduct: contractDetail.typeProduct,
            addressStart: contractDetail.addressStart,
            addressEnd: contractDetail.addressEnd,
            methodContract: contractDetail.methodContract,
            methodDelivery: contractDetail.methodDelivery,
            methodPayment: contractDetail.methodPayment,
        };

        let updatedContract;
        if (!contract.contractDetails) {
            // Nếu scope đang null -> Dùng $set để khởi tạo mới toàn bộ Object, tránh lỗi PathNotViable
            updatedContract = await contractModel.findByIdAndUpdate(
                contractId,
                {
                    $set: {
                        contractDetails: payload

                    }
                },
                { session: dbSession }
            );
        }

        await dbSession.commitTransaction();


        return true;
    }



}