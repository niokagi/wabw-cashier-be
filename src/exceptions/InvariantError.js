import ClientError from "./ClientError.js";

export default class InvariantError extends ClientError {
  constructor(message) {
    super(message, 400);
    this.name = "InvariantError";
  }
}
