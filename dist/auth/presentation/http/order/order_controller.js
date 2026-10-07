"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const UserModelSchema = zod_1.z.object({
    email: zod_1.z.string(),
    name: zod_1.z.string(),
    name_company: zod_1.z.string(),
    number_phone: zod_1.z.string(),
}).strict();
const OrderModelSchema = zod_1.z.object({
    order_code: zod_1.z.string(),
    status_delivery: zod_1.z.string(),
    product: zod_1.z.object({
        name_product: zod_1.z.string(),
        type_product: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        width: zod_1.z.number().positive(),
        height: zod_1.z.number().positive(),
        weight: zod_1.z.number().positive(),
        length: zod_1.z.number().positive()
    }),
    address_take_goods: zod_1.z.object({
        method: zod_1.z.string(),
        address: zod_1.z.string(),
        scope: zod_1.z.string()
    }),
    address_delivery: zod_1.z.object({
        method: zod_1.z.string(),
        address: zod_1.z.string(),
        scope: zod_1.z.string()
    }),
    payment: zod_1.z.object({
        type_payment: zod_1.z.string(),
        step_payment: zod_1.z.number()
    })
}).strict();
const CreateOrderRequestSchema = zod_1.z.object({
    user: UserModelSchema,
    order: OrderModelSchema
}).strict();
class OrderController {
    orderUsecase;
    findOrderUsecase;
    verifyOrderCodeUseCase;
    constructor(orderUseCase, findOrderUsecase, verifyOrderCodeUseCase) {
        this.orderUsecase = orderUseCase;
        this.findOrderUsecase = findOrderUsecase;
        this.verifyOrderCodeUseCase = verifyOrderCodeUseCase;
    }
    async saveOrder(req, res) {
        try {
            const safeModelData = CreateOrderRequestSchema.parse(req.body);
            const result = await this.orderUsecase.execute(safeModelData.user, safeModelData.order);
            return res.status(result.status).json({ data: { success: result.success, message: result.message } });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                const formattedErrors = err.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }));
                return res.status(400).json({
                    status: "Validation Failed",
                    errors: formattedErrors
                });
            }
            console.error("System Error:", err);
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Đã xảy ra lỗi hệ thống."
            });
        }
    }
    async findOrder(req, res) {
        try {
            const { order_code } = req.body;
            const result = await this.findOrderUsecase.execute(order_code);
            return res.status(result.status).json({
                data: {
                    user: result.data?.user,
                    order: result.data?.order,
                    success: result.success,
                    message: result.message
                }
            });
        }
        catch (err) {
            if (err.name === "ZodError" || err instanceof zod_1.ZodError) {
                return res.status(400).json({
                    error: "Dữ liệu yêu cầu không hợp lệ",
                    details: err.errors
                });
            }
            if (err.message && err.message.includes("Không tìm thấy đơn hàng")) {
                return res.status(404).json({
                    error: err.message
                });
            }
        }
    }
    async verifyOrderCode(req, res) {
        try {
            const { order_code } = req.body;
            const result = await this.verifyOrderCodeUseCase.execute(order_code);
            return res.status(result.status).json({
                data: {
                    success: result.success,
                    message: result.message
                }
            });
        }
        catch (err) {
            if (err.message && err.message.includes("")) {
                return res.status(404).json({ error: err.message });
            }
        }
    }
}
exports.default = OrderController;
