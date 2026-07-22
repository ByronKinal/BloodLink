export class ApiResponse {
  constructor(success, data = null, message = '') {
    this.success = success;
    this.data = data;
    this.message = message;
  }

  static success(data = null, message = 'Operación exitosa') {
    return new ApiResponse(true, data, message);
  }

  static error(message = 'Ha ocurrido un error', data = null) {
    return new ApiResponse(false, data, message);
  }
}
