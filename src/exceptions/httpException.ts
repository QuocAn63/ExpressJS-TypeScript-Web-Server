export default class HttpException extends Error {
  public status: number;
  public message: string;
  public detail?: string;

  constructor(status: number, message: string, detail?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.detail = detail;
  }
}
