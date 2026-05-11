# Roblox Creator Skills (RCS)

README bản địa hóa này được giữ ngắn gọn có chủ đích.
Hãy dùng các tài liệu chuẩn liên kết bên dưới cho bề mặt sản phẩm hiện tại.

- Gói: `@jstn-sdk/rcs`
- Kho mã: `https://github.com/JustineDevs/roblox-ai-os`
- Bắt đầu: [../getting-started.html](../getting-started.html)
- Tham chiếu skills: [../skills.html](../skills.html)
- Tích hợp: [../integrations.html](../integrations.html)
- README chuẩn: [../../README.md](../../README.md)

## Quy trình creator chuẩn

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Đối với công việc triển khai Roblox, pre-action gate bắt buộc được áp dụng trước mọi bước sinh mã:
- thu thập tài liệu tham chiếu
- xây dựng hiểu biết
- chuẩn hóa thuật ngữ
- thiết kế kiến trúc cây tệp dạng mô-đun
- chỉ sau đó mới triển khai

Xem:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Kích hoạt MCP

Sau `rcs setup`, cấu hình mặc định tương thích với Codex nên bao gồm hai lớp MCP:

1. **Máy chủ MCP first-party của RCS** qua `rcs mcp-serve`
2. **Máy chủ MCP tham chiếu Roblox mặc định** qua cơ chế vận chuyển từ xa GitMCP

Mô hình khuyến nghị:
- giữ **`rcs mcp-serve`** hoạt động cho công việc runtime/state/control-plane cục bộ
- giữ **các máy chủ tham chiếu Roblox qua GitMCP** bật theo mặc định để giảm hallucination và tăng độ bám sát nền tảng
- chỉ bật **`robloxstudio-mcp`** thủ công khi bạn muốn có kết nối thời gian thực giữa Codex CLI và Roblox Studio

Làm rõ quan trọng:
- `rcs mcp-serve` chỉ phục vụ **các máy chủ MCP cục bộ thuộc sở hữu của RCS**
- nó **không** phục vụ `robloxstudio-mcp`

## Quyền sở hữu

RCS thuộc sở hữu và được duy trì bởi [JustineDevs](https://github.com/JustineDevs) và [@JustineDevs](https://github.com/JustineDevs) cho các workflow creator của Roblox.

## Lời cảm ơn

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Giấy phép

[MIT](https://opensource.org/licenses/MIT)
