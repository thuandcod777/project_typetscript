"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
const transaction_failure_1 = require("../domain/error/transaction-failure");
class OrderUsecase {
    authRepository;
    orderRepository;
    constructor(authRepository, orderRepository) {
        this.authRepository = authRepository;
        this.orderRepository = orderRepository;
    }
    async execute(userData, orderData) {
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
                throw new transaction_failure_1.TransactionFailure(response_entity_1.ResponseDto.failure(checkUser.message));
            }
            const userId = checkUser.userData._id.toString();
            console.log('[OrderUsecase] Đang cập nhật thông tin user', { userId });
            const updateUser = await this.authRepository.updateUser(userId, userData, session);
            console.log('[OrderUsecase] Kết quả updateUser', updateUser);
            if (!updateUser.success) {
                console.log('[OrderUsecase] Cập nhật user thất bại', updateUser.message);
                throw new transaction_failure_1.TransactionFailure(response_entity_1.ResponseDto.failure(updateUser.message));
            }
            console.log('[OrderUsecase] Đang lưu đơn hàng', { userId, orderData });
            const saveOrder = await this.orderRepository.saveOrder(userId, orderData, session);
            console.log('[OrderUsecase] Kết quả saveOrder', saveOrder);
            if (!saveOrder.success) {
                console.log('[OrderUsecase] Lưu đơn hàng thất bại');
                throw new transaction_failure_1.TransactionFailure(response_entity_1.ResponseDto.failure(saveOrder.message));
            }
            console.log('[OrderUsecase] Đang commit transaction');
            await session.commitTransaction();
            console.log('[OrderUsecase] Commit transaction thành công');
            return response_entity_1.ResponseDto.success(saveOrder.message);
        }
        catch (error) {
            console.log('[OrderUsecase] Gặp lỗi trong transaction, đang abort', error);
            await session.abortTransaction();
            console.log('[OrderUsecase] Abort transaction thành công');
            if (error instanceof transaction_failure_1.TransactionFailure) {
                return error.response;
            }
            console.error('[OrderUsecase] Lỗi hệ thống:', error);
            return response_entity_1.ResponseDto.failure('Đã có lỗi xảy ra hệ thống. Vui lòng thử lại sau.');
        }
        finally {
            console.log('[OrderUsecase] Kết thúc session');
            await session.endSession();
        }
    }
}
exports.default = OrderUsecase;
