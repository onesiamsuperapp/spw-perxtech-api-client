import { Deserialize } from 'cerialize';
import { makePolicy, ComparePolicy } from './utils/compare';
import { PerxPagingMeta, BasePerxResponse, PerxError } from '..';

const _fixture = {
  lastPage: {
    size: 3,
    page: 2,
    current_page: 2,
    per_page: 25,
    prev_page: 1,
    next_page: null,
    total_count: 28,
    count: 28,
    total_pages: 2,
  },
  firstPage: {
    size: 25,
    page: 1,
    current_page: 1,
    per_page: 25,
    prev_page: null,
    next_page: 2,
    total_count: 28,
    count: 28,
    total_pages: 2,
  },
};

class MockBasePerxResponse extends BasePerxResponse {
  private mockError: Error | undefined;

  constructor(mockError?: Error) {
    super();
    this.mockError = mockError;
  }

  public get error(): Error | undefined {
    return this.mockError;
  }

  public afterDeserialized(json: any) {}
}

describe('Perx Response', () => {
  describe('Paging Meta', () => {
    it.each`
      name            | fixtureData
      ${'last page'}  | ${_fixture.lastPage}
      ${'first page'} | ${_fixture.firstPage}
    `('can deserialized $name from JSON', ({ name, fixtureData }) => {
      const o: PerxPagingMeta = Deserialize(fixtureData, PerxPagingMeta);

      expect(o).toBeInstanceOf(PerxPagingMeta);

      const policy = makePolicy(o, fixtureData);
      const fieldCompare: Array<[string, ComparePolicy]> = [
        ['size', policy.equal],
        ['page', policy.equal],
        ['current_page', policy.equal],
        ['per_page', policy.equal],
        ['prev_page', policy.equal],
        ['next_page', policy.equal],
        ['total_count', policy.equal],
        ['count', policy.equal],
        ['total_pages', policy.equal],
      ];
      for (const f of fieldCompare) {
        const fieldName = f[0];
        const policyComparer = f[1];
        policyComparer(fieldName);
      }
    });
  });
});

describe('BasePerxResponse', () => {
  test('should return undefined error when no error code and description', () => {
    const basePerxResponse = new BasePerxResponse();
    expect(basePerxResponse.error).toBeUndefined();
    expect(basePerxResponse.hasError).toBe(false);
  });
  test('should return PerxError when error code or description is set', () => {
    const errorCode = 'invalid-token';
    const errorDescription = 'The access token is invalid.';
    const response = new BasePerxResponse();
    response.errorCode = errorCode;
    response.errorDescription = errorDescription;
    const error = response.error as PerxError;
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(PerxError);
    expect(error?.errorMessage).toBe(errorDescription);
    expect(error?.code).toBe(`perx-error:${errorCode}`);
    expect(response.hasError).toBe(true);
  });
  test('should parse and evaluate response correctly with no error', () => {
    const jsonData = { errorCode: 1, errorDescription: 'John Doe' };
    const httpStatus = 200;
    const response = BasePerxResponse.parseAndEval(
      jsonData,
      httpStatus,
      BasePerxResponse
    );
    expect(response).toBeInstanceOf(BasePerxResponse);
  });

  test('should parse and evaluate response throw error with json null', () => {
    const jsonData = null;
    const httpStatus = 500;
    let error;
    try {
      BasePerxResponse.parseAndEval(jsonData, httpStatus, BasePerxResponse);
    } catch (e) {
      error = e as PerxError;
    }
    expect(error?.code).toBe('http-failed');
    expect(error?.errorMessage).toBe(
      `Invalid response from server (httpStatusCode ${httpStatus})`
    );
  });

  test('should parse and evaluate response throw error with status 500 and error message', () => {
    const jsonData = { message: 'error-message', code: 'error-code' };
    const httpStatus = 500;
    let error;
    try {
      BasePerxResponse.parseAndEval(jsonData, httpStatus, BasePerxResponse);
    } catch (e) {
      error = e as PerxError;
    }
    expect(error?.code).toBe(`perx-error:${jsonData.code}`);
  });

  test('should call afterDeserialized method', () => {
    const afterDeserializedSpy = jest.spyOn(
      MockBasePerxResponse.prototype,
      'afterDeserialized'
    );
    const jsonData = { error: 'some-error' };
    MockBasePerxResponse.parseAndEval(jsonData, 400, MockBasePerxResponse);
    expect(afterDeserializedSpy).toHaveBeenCalledWith(jsonData);
  });

  test('should throw error when error is present', () => {
    const errorCode = 'invalid-token';
    const errorMessage = 'The access token is invalid.';
    const jsonData = { error: errorCode, error_description: errorMessage };
    let error;
    new MockBasePerxResponse(PerxError.serverRejected(errorCode, errorMessage));
    try {
      BasePerxResponse.parseAndEval(jsonData, 401, BasePerxResponse);
    } catch (e) {
      error = e as PerxError;
    }
    expect(error?.code).toBe(`perx-error:${errorCode}`);
  });
});
