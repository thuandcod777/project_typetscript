import { IOrderInputDTO, IUSerInputDto } from "../../../domain/dtos/order_input.dto";
import FindOrderUsecase from "../../../usecase/find_order_usecase";
import OrderUsecase from "../../../usecase/order_usercase";
import { Request, Response } from 'express';
import { success, z, ZodError } from 'zod';
import VerifyOrderCodeUsecase from "../../../usecase/verify_order_code_usecase";

const UserModelSchema: z.ZodType<IUSerInputDto> = z.object({
    email: z.string(),
    name: z.string(),
    name_company: z.string(),
    number_phone: z.string(),
}).strict();

const OrderModelSchema: z.ZodType<IOrderInputDTO> = z.object({
    order_code: z.string(),
    status_delivery: z.string(),
    product: z.object({
        name_product: z.string(),
        type_product: z.string(),
        amount: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
        weight: z.number().positive(),
        length: z.number().positive()
    }),
    address_take_goods: z.object({
        method: z.string(),
        address: z.string(),
        scope: z.string()
    }),
    address_delivery: z.object({
        method: z.string(),
        address: z.string(),
        scope: z.string()
    }),
    payment: z.object({
        type_payment: z.string(),
        step_payment: z.number()
    })
}).strict();


const CreateOrderRequestSchema = z.object({
    user: UserModelSchema,
    order: OrderModelSchema
}).strict();

export default class OrderController {
    private readonly orderUsecase: OrderUsecase;
    private readonly findOrderUsecase: FindOrderUsecase;
    private readonly verifyOrderCodeUseCase: VerifyOrderCodeUsecase;

    constructor(orderUseCase: OrderUsecase, findOrderUsecase: FindOrderUsecase, verifyOrderCodeUseCase: VerifyOrderCodeUsecase) {
        this.orderUsecase = orderUseCase
        this.findOrderUsecase = findOrderUsecase
        this.verifyOrderCodeUseCase = verifyOrderCodeUseCase
    }

    public async saveOrder(req: Request, res: Response) {
        try {

            const safeModelData = CreateOrderRequestSchema.parse(req.body);

            const result = await this.orderUsecase.execute(safeModelData.user, safeModelData.order);

            return res.status(result.status).json({ data: { success: result.success, message: result.message } });
        } catch (err) {
            if (err instanceof z.ZodError) {
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

    public async findOrder(req: Request, res: Response) {
        try {
            const { order_code } = req.body;
            const result = await this.findOrderUsecase.execute(order_code);
            return res.status(result.status).json({
                data: {
                    order: result.data,
                    success: result.success,
                    message: result.message
                }
            });
        } catch (err: any) {
            if (err.name === "ZodError" || err instanceof ZodError) {
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

    public async verifyOrderCode(req: Request, res: Response) {
        try {
            const { order_code } = req.body;

            const result = await this.verifyOrderCodeUseCase.execute(order_code);

            return res.status(result.status).json({
                data: {
                    success: result.success,
                    message: result.message
                }
            });
        } catch (err: any) {
            if (err.message && err.message.includes("")) {
                return res.status(404).json({ error: err.message });
            }
        }
    }
}