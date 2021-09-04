export class PerxError extends Error {

  /**
   * Please use static methods to initialize PerxError
   * 
   * @param code 
   * @param errorMessage 
   * @param additionalInfo 
   */
  protected constructor(
    public readonly code: string,
    public readonly errorMessage: string, 
    public readonly additionalInfo: Record<string, any> = {}) {
    super(errorMessage || code)

    Object.setPrototypeOf(this, PerxError.prototype)
  }

  /**
   * Use this error when Service layer cannot determine the root cause of the problem.
   * (Basically response.data was empty.)
   * 
   * @param httpStatusCode
   * @returns 
   */
  public static networkFailed(httpStatusCode: number): PerxError {
    return new PerxError('http-failed', `Invalid response from server (httpStatusCode ${httpStatusCode})`)
  }

  /**
   * Perx's service intentionally reply an error back to our client.
   * 
   * @param perxServiceErrorCode 
   * @param perxComplaintMessage 
   * @returns 
   */
  public static serverRejected(perxServiceErrorCode: string, perxComplaintMessage: string): PerxError {
    return new PerxError(`perx-error:${perxServiceErrorCode}`, perxComplaintMessage || 'no-error-message')
  }

  /**
   * PerxService reject call due to invalid authorization
   * 
   * @returns 
   */
  public static unauthorized(): PerxError {
    return new PerxError('unauthorized', 'Invalid token')
  }

  /**
   * Our internal service layer detected bad input that cannot construct the request properly.
   *
   * @param reason 
   * @returns 
   */
  public static badRequest(reason: string): PerxError {
    return new PerxError('perx-bad-input', reason || 'invalid-input-from-user')
  }
}