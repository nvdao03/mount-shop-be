# 🛍️ Mount Shop - E-commerce Backend (ExpressJS)

![NodeJS](https://img.shields.io/badge/NodeJS-v18-green)
![ExpressJS](https://img.shields.io/badge/ExpressJS-Backend-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-lightblue)
![DrizzleORM](https://img.shields.io/badge/Drizzle%20ORM-ORM-orange)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow)
![AWS](https://img.shields.io/badge/AWS-S3%20%26%20SES-orange)
![Swagger](https://img.shields.io/badge/API-Swagger%20Docs-brightgreen)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 🚀 Overview

This is the back-end component of the **Mount Shop** project — an eCommerce platform that provides APIs for user authentication, product management, shopping cart, order processing, and payment handling.

The system integrates **AWS S3** for storing product and user images, and **AWS SES** for sending verification and password recovery emails.

Live server: [https://mount.io.vn](https://mount.io.vn)

## 📑 Table of Contents

- [🛍️ Mount Shop - E-commerce Backend (ExpressJS)](#️-mount-shop---e-commerce-backend-expressjs)
  - [🚀 Overview](#-overview)
  - [📑 Table of Contents](#-table-of-contents)
  - [🧩 Tech Stack](#-tech-stack)
  - [🚀 Installation](#-installation)
  - [⚡ Usage](#-usage)
  - [🔑 API Endpoints](#-api-endpoints)
  - [📄 Document API](#-document-api)
  - [🗄️ Database Schema](#️-database-schema)
    - [1. Roles](#1-roles)
    - [2. Users](#2-users)
    - [3. Refresh Tokens](#3-refresh-tokens)
    - [4. Categories](#4-categories)
    - [5. Brands](#5-brands)
    - [6. Brands-Categories](#6-brands-categories)
    - [7. Products](#7-products)
    - [8. Addresses](#8-addresses)
    - [9. Comments](#9-comments)
    - [10. Carts](#10-carts)
    - [11. Orders](#11-orders)
    - [12. Order Items](#12-order-items)
    - [👨‍💻 Author](#-author)

## 🧩 Tech Stack

- **Backend Framework**: ExpressJS
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT
- **Validation**: express-validator
- **Upload**: Formidable
- **File Storage**: AWS S3
- **Email Service**: AWS SES
- **Documentation**: Swagger (OpenAPI 3.0)
- **Environment**: dotenv

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nvdao03/mount-shop-be.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a cluster in mongoDB

4. Create acount AWS

5. Create acount Google Console

6. Create `.env` file and configure environment variable

   ```bash
    NODE_ENV=

    PORT=
    BASE_URL=

    DATABASE_URL=

    JWT_SECRET_ACCESS_TOKEN=
    JWT_SECRET_REFRESH_TOKEN=
    JWT_SECRET_EMAIL_VERIFY_TOKEN=
    JWT_SECRET_FORGOT_PASSWORD_TOKEN=

    ACCESS_TOKEN_EXPIRES_IN=
    REFRESH_TOKEN_EXPIRES_IN=
    EMAIL_VERIFY_TOKEN_EXPIRES_IN=
    FORGOT_PASSWORD_TOKEN_EXPIRES_IN=

    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_REGION=
    AWS_FROM_ADDRESS=
    AWS_S3_BUCKET_NAME=

    CLIENT_LOCAL_HOST_URL=
    CLIENT_PRODUCTION_URL=
    CLIENT_REDIRECT_URL_VERIFY_EMAIL=
    CLIENT_REDIRECT_URL_VERIFY_FORGOT_PASSWORD_EMAIL=

    GOOGLE_OAUTH_CLIENT_ID=
    GOOGLE_OAUTH_CLIENT_SECRET=
    GOOGLE_OAUTH_REDIRECT_URI=
    GOOGLE_CLIENT_REDIRECT_URL=
   ```

7. Run database migration (using Drizzle ORM)

   ```bash
    npm run db:push
   ```

## ⚡ Usage

To start the server, run the following command:

```bash
 npm run dev
```

## 🔑 API Endpoints

- `/auth`: Authentication & email verification (register, login, logout, forgot password)
- `/users`: Manage user profiles, roles, and verification status
- `/categories`: Manage product categories -`/brands`: Manage brands and their relation to categories
- `/products`: Create, update, delete, and fetch product details
- `/comments`: Manage customer product reviews and feedback
- `/carts`: Handle user shopping cart operations (add/remove/update products)
- `/addresses`: Manage user delivery addresses
- `/orders`: Handle order creation, tracking, and cancellation
- `/order-items`: Manage ordered product items

## 📄 Document API

- [https://mount-shop-be.onrender.com/api/api-docs/](https://mount-shop-be.onrender.com/api/api-docs/)

## 🗄️ Database Schema

### 1. Roles

| Field                     | Type      | Description                                 |
| ------------------------- | --------- | ------------------------------------------- |
| `id`                      | Serial    | Khoá chính (bắt buộc)                       |
| `name`                    | String    | Tên vai trò (ví dụ: Admin, User) (bắt buộc) |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian           |

### 2. Users

| Field                     | Type      | Description                                             |
| ------------------------- | --------- | ------------------------------------------------------- |
| `id`                      | Serial    | Khoá chính (bắt buộc)                                   |
| `email`                   | String    | Email duy nhất (bắt buộc)                               |
| `password`                | String    | Mật khẩu đã được mã hóa (bắt buộc)                      |
| `role_id`                 | Integer   | Khóa ngoại tham chiếu đến Roles                         |
| `name`                    | String    | Tên hiển thị                                            |
| `avatar`                  | String    | Ảnh đại diện                                            |
| `email_verify_token`      | String    | Mã token xác minh email                                 |
| `forgot_password_token`   | String    | Mã token đặt lại mật khẩu                               |
| `verify`                  | Enum      | Trạng thái tài khoản (0: Chưa xác minh, 1: Đã xác minh) |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian                       |

---

### 3. Refresh Tokens

| Field                     | Type      | Description                       |
| ------------------------- | --------- | --------------------------------- |
| `id`                      | Serial    | Khoá chính (bắt buộc)             |
| `token`                   | String    | Mã refresh token (JWT)            |
| `user_id`                 | ObjectId  | Tham chiếu tới `User`             |
| `iat`                     | Timestamp | Issued At (thời điểm tạo)         |
| `exp`                     | Timestamp | Expiration (thời điểm hết hạn)    |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian |

---

### 4. Categories

| Field                     | Type      | Description                       |
| ------------------------- | --------- | --------------------------------- |
| `id`                      | Serial    | Khoá chính (bắt buộc)             |
| `name`                    | String    | Tên danh mục (duy nhất)           |
| `image`                   | String    | Ảnh đại diện danh mục             |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian |

---

### 5. Brands

| Field                     | Type      | Description                       |
| ------------------------- | --------- | --------------------------------- |
| `id`                      | Serial    | Khoá chính (bắt buộc)             |
| `name`                    | String    | Tên thương hiệu (duy nhất)        |
| `image`                   | String    | Ảnh thương hiệu                   |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian |

---

### 6. Brands-Categories

| Field                     | Type      | Description                            |
| ------------------------- | --------- | -------------------------------------- |
| `brand_id`                | Integer   | Khóa ngoại tham chiếu đến `Brands`     |
| `category_id`             | Integer   | Khóa ngoại tham chiếu đến `Categories` |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian      |

---

### 7. Products

| Field                     | Type      | Description                           |
| ------------------------- | --------- | ------------------------------------- |
| `id`                      | Serial    | Khoá chính (bắt buộc)                 |
| `name`                    | String    | Tên sản phẩm                          |
| `image`                   | String    | Ảnh đại diện sản phẩm                 |
| `images`                  | Array     | Danh sách hình ảnh sản phẩm           |
| `description`             | Text      | Mô tả chi tiết sản phẩm               |
| `price_before_discount`   | Integer   | Giá gốc                               |
| `price`                   | Integer   | Giá sau giảm                          |
| `rating`                  | Numeric   | Điểm đánh giá trung bình (mặc định 0) |
| `sold`                    | Integer   | Tổng số lượng đã bán                  |
| `stock`                   | Integer   | Số lượng hàng còn lại                 |
| `category_id`             | Integer   | Khóa ngoại tham chiếu đến Categories  |
| `brand_id`                | Integer   | Khóa ngoại tham chiếu đến Brands      |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian     |

---

### 8. Addresses

| Field                     | Type      | Description                       |
| ------------------------- | --------- | --------------------------------- |
| `id`                      | Serial    | Khoá chính (bắt buộc)             |
| `address`                 | String    | Địa chỉ giao hàng                 |
| `phone`                   | String    | Số điện thoại liên hệ             |
| `full_name`               | String    | Tên người nhận                    |
| `user_id`                 | Integer   | Khóa ngoại tham chiếu đến `Users` |
| `is_default`              | Boolean   | Cờ đánh dấu địa chỉ mặc định      |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian |

---

### 9. Comments

| Field                     | Type      | Description                          |
| ------------------------- | --------- | ------------------------------------ |
| `id`                      | Serial    | Khoá chính (bắt buộc)                |
| `content`                 | String    | Nội dung bình luận                   |
| `product_id`              | Integer   | Khóa ngoại tham chiếu đến `Products` |
| `user_id`                 | Integer   | Khóa ngoại tham chiếu đến `Users`    |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian    |

---

### 10. Carts

| Field                     | Type      | Description                          |
| ------------------------- | --------- | ------------------------------------ |
| `id`                      | Serial    | Khoá chính (bắt buộc)                |
| `user_id`                 | Integer   | Khóa ngoại tham chiếu đến `Users`    |
| `product_id`              | Integer   | Khóa ngoại tham chiếu đến `Products` |
| `quantity`                | Integer   | Số lượng sản phẩm trong giỏ hàng     |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian    |

---

### 11. Orders

| Field                     | Type      | Description                                                  |
| ------------------------- | --------- | ------------------------------------------------------------ |
| `id`                      | Serial    | Khoá chính (bắt buộc)                                        |
| `user_id`                 | Integer   | Khóa ngoại tham chiếu đến `Users`                            |
| `total_price`             | Integer   | Tổng số tiền đơn hàng                                        |
| `status`                  | Enum      | Trạng thái đơn hàng (đang xử lý, đang giao, đã giao, đã hủy) |
| `address_id`              | Integer   | Khóa ngoại tham chiếu đến `Addresses`                        |
| `cancel_reason`           | String    | Lý do hủy đơn hàng                                           |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian                            |

---

### 12. Order Items

| Field                     | Type      | Description                               |
| ------------------------- | --------- | ----------------------------------------- |
| `id`                      | Serial    | Khoá chính (bắt buộc)                     |
| `order_id`                | Integer   | Khóa ngoại tham chiếu đến `Orders`        |
| `product_id`              | Integer   | Khóa ngoại tham chiếu đến Products        |
| `quantity`                | Integer   | Số lượng của từng sản phẩm trong đơn hàng |
| `createdAt` / `updatedAt` | Timestamp | Tự động tạo và cập nhật thời gian         |

### 👨‍💻 Author

Developed by [Nguyễn Văn Đạo](https://www.facebook.com/van.ao.547278) 🚀
GitHub: [nvdao03](https://github.com/nvdao03)
