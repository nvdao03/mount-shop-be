export const AUTH_MESSAGE = {
  EMAIL_INVALID: 'Email không hợp lệ',
  EMAIL_REQUIRED: 'Vui lòng nhập email',
  EMAIL_EXISTS: 'Email đã tồn tại',
  EMAIL_NOT_EMPTY: 'Email không được để trống',
  PASSWORD_INVALID_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
  PASSWORD_INVALID_LENGTH: 'Mật khẩu phải có ít nhất 6 - 180 ký tự',
  PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
  LOGIN_FAILED: 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin',
  FULLNAME_NOT_EMPTY: 'Tên không được để trống',
  FULLNAME_INVALID_MIN_LENGTH: 'Họ và tên phải có ít nhất 10 ký tự',
  FULLNAME_INVALID_LENGTH: 'Họ và tên phải có ít nhất 10 - 180 ký tự',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  CONFIRM_PASSWORD_INVALID_LENGTH: 'Mật khẩu phải có ít nhất 6 - 180 ký tự',
  CONFIRM_PASSWORD_INVALID: 'Mật khẩu nhập lại không khớp',
  EMAIL_NOT_EXISTS: 'Email không tồn tại',
  EMAIL_OR_PASSWORD_NOT_EXISTS: 'Email hoặc mật khẩu không chính xác',
  REGISTER_SUCCESS: 'Đăng ký thành công, vui lòng kiểm tra email để kích hoạt tài khoản',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REFRESH_TOKEN_NOT_EMPTY: 'Refresh token không được để trống',
  REFRESH_TOKEN_NOT_EXISTS: 'Refresh token không tồn tại',
  REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ',
  ACCESS_TOKEN_NOT_EMPTY: 'Access token không được để trống',
  ACCESS_TOKEN_NOT_EXISTS: 'Access token không tồn tại',
  ACCESS_TOKEN_INVALID: 'Access token không hợp lệ',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  PASSWORD_NOT_EMPTY: 'Mật khẩu không được để trống',
  PASSWORD_NOT_EXISTS: 'Mật khẩu không tồn tại',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',
  USER_NOT_VERIFIED: 'Tài khoản chưa được xác thực',
  FORGOT_PASSWORD_SUCCESS: 'Vui lòng kiểm tra email để đổi mật khẩu',
  FORGOT_PASSWORD_TOKEN_NOT_EMPTY: 'Forgot token không được để trống',
  FORGOT_PASSWORD_TOKEN_NOT_EXISTS: 'Forgot token không tồn tại',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Xác thực Forgot token hợp lệ',
  FORGOT_PASSWORD_TOKEN_NOT_FOUND: 'Không tìm thấy Forgot password token',
  RESET_PASSWORD_SUCCESS: 'Đổi mật khâu thành công',
  EMAIL_VERIFY_TOKEN_NOT_EMPTY: 'Email verify token không được để trống',
  USER_NOT_EXISTS: 'Tài khoản không tồn tại',
  EMAIL_VERIFY_TOKEN_INVALID: 'Email verify token không hợp lệ',
  EMAIL_VERIFY_TOKEN_NOT_EXISTS: 'Email verify token không tồn tại',
  EMAIL_VERIFY_TOKEN_NOT_FOUND: 'Không tìm thấy email verify token',
  EMAIL_ALREADY_VERIFIED: 'Email đã được xác nhận trước đó',
  EMAIL_VERIFIED_SUCCESS: 'Xác thực email thành công',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản',
  REFRESH_TOKEN_SUCCESS: 'refresh token thành công',
  USER_NOT_ADMIN: 'Tài khoản không phải là admin'
}

export const USER_MESSAGE = {
  USER_NOT_EXISTS: 'Tài khoản không tồn tại',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản'
}

export const MEDIA_MESSAGE = {
  UPLOAD_IMAGE_SUCCESS: 'Upload ảnh thành công'
}

export const CATEGORY_MESSAGE = {
  CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục',
  CATEGORY_NOT_EXISTS: 'Danh mục không tồn tại',
  CATEGORY_NAME_NOT_EMPTY: 'Tên danh mục không được để trống',
  CATEGORY_NAME_INVALID_LENGTH: 'Tên danh mục phải có ít nhất 2 - 180 ký tự',
  CATEGORY_IMAGE_NOT_EMPTY: 'Ảnh danh mục không được để trống',
  CATEGORY_IMAGE_INVALID: 'Ảnh danh mục không hợp lệ',
  CATEGORY_NAME_EXISTS: 'Tên danh mục đã tồn tại',
  ADD_CATEGORY_SUCCESS: 'Thêm danh mục thành công',
  CATEGORY_ID_NOT_EMPTY: 'ID danh mục không được để trống',
  CATEGORY_INVALID_ID: 'ID danh mục không hợp lệ',
  UPDATE_CATEGORY_SUCCESS: 'Cập nhật danh mục thành công',
  DELETE_CATEGORY_SUCCESS: 'Xóa danh mục thành công',
  GET_CATEGORY_ALL_SUCCESS: 'Lấy danh sách danh mục thành công',
  GET_CATEGORY_DETAIL_SUCCESS: 'Lấy chi tiết danh mục thành công',
  GET_BRANDS_BY_CATEGORY_ID_SUCCESS: 'Lấy danh sách thương hiệu theo danh mục thành công'
}

export const BRAND_MESSAGE = {
  BRAND_NAME_NOT_EMPTY: 'Tên thương hiệu không được để trống',
  BRAND_NAME_INVALID_LENGTH: 'Tên thương hiệu phải có ít nhất 2 - 180 ký tự',
  BRAND_NAME_EXISTS: 'Tên thương hiệu đã tồn tại',
  BRAND_IMAGE_NOT_EMPTY: 'Hình ảnh thương hiệu không được để trống',
  BRAND_IMAGE_INVALID: 'Hình ảnh thương hiệu không hợp lệ',
  ADD_BRAND_SUCCESS: 'Thêm thương hiệu thành công',
  BRAND_INVALID_ID: 'ID thương hiệu không hợp lệ',
  BRAND_NOT_FOUND: 'Không tìm thấy tên thương hiệu',
  BRAND_ID_NOT_EMPTY: 'ID thương hiệu không được để trống',
  UPDATE_BRAND_SUCCESS: 'Cập nhật thương hiệu thành công',
  DELETE_BRAND_SUCCESS: 'Xoá thương hiệu thành công',
  GET_BRAND_DETAIL_SUCCESS: 'Lấy chi tiết thương hiệu thành công',
  GET_ALL_BRANDS_SUCCESS: 'Lấy danh sách thương hiệu thành công'
}
