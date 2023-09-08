import { PerxCampaign } from '../models'

describe('PerxCampaign', () => {
  let perxCampaign: PerxCampaign;

  beforeEach(() => {
    perxCampaign = new PerxCampaign();
  });

  test('should set the token and baseUrl', () => {
    const token = 'example-token';
    const baseUrl = 'https://example.com/microsite';
    perxCampaign.configMicrositeContext(token, baseUrl);

    // Check if private properties are set correctly
    expect(perxCampaign['_token']).toBe(token);
    expect(perxCampaign['_microSiteBaseUrl']).toBe(baseUrl);
  });

  test('should produce the correct micrositeUrl', () => {
    const token = 'example-token';
    const baseUrl = 'https://example.com/microsite';
    perxCampaign.configMicrositeContext(token, baseUrl);

    const expectedMicrositeUrl = `${baseUrl}/loading?token=${token}&cid=${perxCampaign.id}`;
    const micrositeUrl = perxCampaign.micrositeUrl;

    expect(micrositeUrl).toBe(expectedMicrositeUrl);
  });

  test('should include micrositeUrl in the toJSON result', () => {
    const token = 'example-token';
    const baseUrl = 'https://example.com/microsite';
    perxCampaign.configMicrositeContext(token, baseUrl);

    const result = perxCampaign.toJSON();

    expect(result).toHaveProperty('micrositeUrl', perxCampaign.micrositeUrl);
  });
});