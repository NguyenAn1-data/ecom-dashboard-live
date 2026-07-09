# Hướng dẫn kết nối Google Sheets với Next.js Dashboard

Tài liệu này hướng dẫn bạn cách tải dữ liệu từ tệp Excel hiện tại lên Google Sheets và cấu hình API để Dashboard có thể tự động đồng bộ hóa thời gian thực.

---

## BƯỚC 1: Chuẩn bị dữ liệu trên Google Sheets
1. Truy cập vào Google Drive của bạn và tạo một bảng tính **Google Sheets** mới.
2. Từ tệp Excel `Sales Overview by Product.xlsx` hiện tại của bạn, hãy sao chép dữ liệu của **4 sheet** sau đây vào **4 tab tương ứng** trong Google Sheet mới:
   - Tab 1: Đặt tên chính xác là `Product Database` (Dữ liệu giao dịch gốc).
   - Tab 2: Đặt tên chính xác là `Purchase Value change` (Dữ liệu tên khách hàng phục vụ Decomposition Tree).
   - Tab 3: Đặt tên chính xác là `Credit Limit` (Dữ liệu phân loại hạn mức tín dụng).
   - Tab 4: Đặt tên chính xác là `Sheet3` (Dữ liệu ngày giao hàng thực tế và ngày yêu cầu).
3. Copy mã **Spreadsheet ID** trên URL Google Sheet của bạn:
   - Định dạng URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit#gid=0`
   - Ví dụ: Trong URL `https://docs.google.com/spreadsheets/d/1aBCDeFgHiJkLmNoPqRStUvWxYz/edit`, Spreadsheet ID là `1aBCDeFgHiJkLmNoPqRStUvWxYz`.

---

## BƯỚC 2: Tạo Google Cloud Credentials (Service Account)
Để Next.js đọc được dữ liệu Google Sheet của bạn mà không cần mở khóa công khai hoàn toàn tệp tin, chúng ta sử dụng **Google Service Account**:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một dự án mới (ví dụ: `Ecom Dashboard`).
3. Đi tới **API Library** (Thư viện API), tìm kiếm **Google Sheets API** và nhấn **Enable** (Kích hoạt).
4. Đi tới **IAM & Admin** (IAM & Quản trị) -> **Service Accounts** (Tài khoản dịch vụ) và nhấn **Create Service Account** (Tạo tài khoản dịch vụ).
5. Nhập tên và mô tả tài khoản dịch vụ, bấm **Create and Continue**, sau đó nhấn **Done** (không cần gán role).
6. Sau khi tạo xong, sao chép địa chỉ email của Service Account vừa tạo (dạng: `account-name@project-id.iam.gserviceaccount.com`).
7. Nhấp vào Service Account đó, chọn tab **Keys** -> **Add Key** -> **Create New Key** -> Chọn định dạng **JSON** -> Tải tệp JSON xuống máy tính.

---

## BƯỚC 3: Chia sẻ Google Sheet với Service Account
1. Mở tệp Google Sheet của bạn lên.
2. Nhấn nút **Share** (Chia sẻ) ở góc phải phía trên.
3. Dán địa chỉ email của **Service Account** (đã copy ở Bước 2) vào ô người nhận.
4. Gán quyền **Viewer** (Người xem) là đủ và nhấn **Share** (hoặc gửi đi).

---

## BƯỚC 4: Cấu hình tệp môi trường `.env.local`
1. Tạo một tệp mới tên là `.env.local` nằm ngay trong thư mục `dashboard/` (bạn có thể copy từ `.env.local.example` và đổi tên).
2. Mở tệp JSON key đã tải ở Bước 2 bằng một trình soạn thảo văn bản và điền các thông tin vào `.env.local` theo định dạng sau:

```env
# Email của tài khoản dịch vụ Google Cloud
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@your-project-id.iam.gserviceaccount.com

# Key riêng tư (Private Key) - hãy chắc chắn giữ cả dấu nháy kép ""
# Lưu ý: Thay thế toàn bộ ký tự xuống dòng trong key bằng ký tự \n
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhki...\\n-----END PRIVATE KEY-----\n"

# Spreadsheet ID của Google Sheet
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
```

---

## BƯỚC 5: Khởi chạy dự án
Mở terminal tại thư mục `dashboard/` và chạy:

```bash
# Cài đặt thư viện nếu chưa cài
npm install

# Chạy server local
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt để thưởng thức ứng dụng! Nếu chưa cấu hình cấu hình Google Sheet, bạn có thể click chọn **"Use Demo Data (Xem thử Dữ liệu mẫu)"** để chạy thử giao diện ngay lập tức.
