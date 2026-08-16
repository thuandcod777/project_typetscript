import { IOrderInputDTO, IUSerInputDto } from "../domain/dtos/order_input.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import { TransactionFailure } from "../domain/error/transaction-failure";
import IAuthRepository from "../domain/services/iauth_repository";
import IOrderRepository from "../domain/services/iorder_repository";

export default class OrderUsecase {
    constructor(private authRepository: IAuthRepository, private orderRepository: IOrderRepository) { }
    public async execute(userData: IUSerInputDto, orderData: IOrderInputDTO): Promise<ResponseDto> {

        console.log('[OrderUsecase] Bắt đầu xử lý transaction');
        const session = await this.authRepository.startSession();
        console.log('[OrderUsecase] Session đã được khởi tạo');
        session.startTransaction();
        console.log('[OrderUsecase] Transaction đã bắt đầu');

        try {
            console.log('[OrderUsecase] Đang kiểm tra user', { email: userData.email });
            const checkUser = await this.authRepository.checkUser(userData.email, session);
            console.log('[OrderUsecase] Kết quả checkUser', checkUser);

            if (!checkUser.success && !checkUser.userData) {
                console.log('[OrderUsecase] Không tìm thấy user, dừng xử lý');
                throw new TransactionFailure(ResponseDto.failure(checkUser.message));

            }

            const userId = checkUser.userData!._id!.toString();
            console.log('[OrderUsecase] Đang cập nhật thông tin user', { userId });
            const updateUser = await this.authRepository.updateUser(userId, userData, session);
            console.log('[OrderUsecase] Kết quả updateUser', updateUser);

            if (!updateUser.success) {
                console.log('[OrderUsecase] Cập nhật user thất bại', updateUser.message);
                throw new TransactionFailure(ResponseDto.failure(updateUser.message));
            }

            console.log('[OrderUsecase] Đang lưu đơn hàng', { userId, orderData });
            const saveOrder = await this.orderRepository.saveOrder(userId, orderData, session);
            console.log('[OrderUsecase] Kết quả saveOrder', saveOrder);

            if (!saveOrder.success) {
                console.log('[OrderUsecase] Lưu đơn hàng thất bại');
                throw new TransactionFailure(ResponseDto.failure(saveOrder.message));
            }

            console.log('[OrderUsecase] Đang commit transaction');
            await session.commitTransaction();
            console.log('[OrderUsecase] Commit transaction thành công');

            return ResponseDto.success(saveOrder.message);
        } catch (error) {
            console.log('[OrderUsecase] Gặp lỗi trong transaction, đang abort', error);
            await session.abortTransaction();
            console.log('[OrderUsecase] Abort transaction thành công');
            if (error instanceof TransactionFailure) {
                return error.response;
            }
            console.error('[OrderUsecase] Lỗi hệ thống:', error);
            return ResponseDto.failure('Đã có lỗi xảy ra hệ thống. Vui lòng thử lại sau.');
        } finally {
            console.log('[OrderUsecase] Kết thúc session');
            await session.endSession();
        }


    }
}