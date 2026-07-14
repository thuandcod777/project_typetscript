import mongoose, { Schema, Document } from "mongoose";

mongoose.Schema.Types.String.checkRequired((v) => typeof v === "string");

export function restoreFieldsPlugin(schema: Schema) {
    schema.post(["find", "findOne", "findOneAndUpdate"], function (docs) {
        if (!docs) {
            return;
        }

        const documents = Array.isArray(docs) ? docs : [docs];
        const paths = schema.paths;

        documents.forEach((doc: Document) => {
            // Lớp bảo vệ tránh crash ứng dụng khi gọi hàm trên Plain Object
            if (!doc || typeof doc.toObject !== "function") {
                return;
            }

            let hasChanges = false;
            // Chuyển đổi sang Plain Object thuần túy, loại bỏ các thuộc tính ảo (virtuals) để đối chiếu chính xác
            const docObj = doc.toObject({ getters: false, virtuals: false });

            Object.keys(paths).forEach((path) => {
                // Bỏ qua các trường hệ thống cố định
                if (path === "_id" || path === "__v" || path === "createdAt" || path === "updatedAt") return;

                // THAY ĐỔI QUAN TRỌNG: Kiểm tra xem trường bị thiếu hoàn toàn (undefined) hoặc mang giá trị rỗng (null)
                if (docObj[path] === undefined || docObj[path] === null) {
                    const defaultVal = paths[path].options.default;

                    // Trường hợp 1: Nếu Schema có định nghĩa giá trị default cụ thể
                    if (defaultVal !== undefined) {
                        const resolvedDefault = typeof defaultVal === "function" ? defaultVal() : defaultVal;

                        // Chỉ cập nhật nếu giá trị hiện tại trên DB thực sự khác với giá trị mặc định mong muốn
                        if (docObj[path] !== resolvedDefault) {
                            doc.set(path, resolvedDefault);
                            hasChanges = true;
                        }
                    }
                    // Trường hợp 2: Nếu trường bị thiếu hoàn toàn (undefined) trên Cloud nhưng Schema không có default
                    // Chúng ta chủ động bù đắp dữ liệu mồi dựa theo kiểu dữ liệu (Instance Type) để tránh lỗi TypeScript
                    else if (docObj[path] === undefined) {
                        const instanceType = paths[path].instance;

                        if (instanceType === "String") {
                            doc.set(path, ""); // Nhờ dòng checkRequired ở trên, chuỗi rỗng này sẽ không bị lỗi Validate
                            hasChanges = true;
                        } else if (instanceType === "Number") {
                            doc.set(path, 0);
                            hasChanges = true;
                        }
                    }
                }
            });

            // Nếu phát hiện có sự sai lệch cấu trúc, tiến hành ghi đè cập nhật lại lên Cloud DB
            if (hasChanges) {
                doc.save()
                    .then(() => {
                        console.log(`[Plugin] Tự động đồng bộ và khôi phục cấu trúc thành công cho ID: ${doc._id}`);
                    })
                    .catch((err) => {
                        console.error(`[Plugin] Không thể tự động khôi phục trường cho ID ${doc._id}:`, err);
                    });
            }
        });
    });
}