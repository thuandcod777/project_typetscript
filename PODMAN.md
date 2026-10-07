PODMAN 使用说明 (Tiếng Việt)

Mô tả
- File `Containerfile` và `podman-compose.yml` giúp triển khai ứng dụng Node/TypeScript này cùng MongoDB và Redis.

Yêu cầu
- Cài `podman` và `podman-compose` hoặc sử dụng `podman` với subcommand `compose` (podman v4+).

Cách chạy (phổ thông)
1. Xây image và khởi chạy dịch vụ:
```bash
podman-compose build
podman-compose up -d
```

2. Hoặc dùng podman trực tiếp (nếu không có podman-compose):
```bash
podman build -f Containerfile -t tnh_cargo_typescript_app:latest .
podman run -d --name tnh_app -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_DB="mongodb://mongo:27017/tnh_db" \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  tnh_cargo_typescript_app:latest
```

3. Kiểm tra logs:
```bash
podman-compose logs -f app
```

4. Dừng và gỡ:
```bash
podman-compose down
```

Biến môi trường quan trọng
- `PORT`: cổng lắng nghe (mặc định file compose đặt `5000`).
- `MONGO_DB`: chuỗi kết nối tới MongoDB (ví dụ `mongodb://mongo:27017/tnh_db`).
- `PRIVATE_KEY`: (nếu ứng dụng cần) khóa bí mật cho JWT.

Gợi ý
- Tạo file `.env` tại thư mục gốc để ghi `MONGO_DB`, `PRIVATE_KEY`, `PORT` trước khi chạy.
- Nếu muốn dùng mã TypeScript trực tiếp (dev), sử dụng `npm run dev` trong môi trường phát triển.

Liên hệ
- Nếu cần tùy chỉnh thêm (user, volumes, backup), nói rõ nhu cầu để mình cập nhật.
