# Roblox Creator Skills (RCS)

README bản địa hóa này được giữ ngắn gọn có chủ đích.
Hãy dùng các tài liệu chuẩn liên kết bên dưới cho bề mặt sản phẩm hiện tại.

- Gói: `@jstn-sdk/rcs`
- Kho mã: `https://github.com/JustineDevs/roblox-ai-os`
- Bắt đầu: [../site/getting-started.html](../site/getting-started.html)
- Tham chiếu skills: [../skills.html](../skills.html)
- Wiki cho người đóng góp: [../wiki/Home.md](../wiki/Home.md)
- Lộ trình: [../wiki/ROADMAP.md](../wiki/ROADMAP.md)
- Kiến trúc: [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- Hướng dẫn đóng góp: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- Tích hợp: [../site/integrations.html](../site/integrations.html)
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
- để cài đặt và kích hoạt plugin, hãy làm theo hướng dẫn upstream của `robloxstudio-mcp` trước; tài liệu tương thích của RCS **không** thay thế các bước đó

## Đóng góp

- Hãy tìm các issue có nhãn `good first issue` hoặc `help wanted`.
- Các đóng góp về tài liệu, bản địa hóa, QA và vệ sinh release đều được chào đón.
- Hãy dùng wiki dành cho người đóng góp và lộ trình để giữ phạm vi nhỏ và rõ ràng.
- Wiki dành cho người đóng góp **không** giống với wiki runtime cục bộ trong `.rcs/wiki/`.

## Quyền sở hữu

RCS thuộc sở hữu và được duy trì bởi [JustineDevs](https://github.com/JustineDevs) và [@JustineDevs](https://github.com/JustineDevs) cho các workflow creator của Roblox.

## Lời cảm ơn

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Giấy phép

[MIT](https://opensource.org/licenses/MIT)
