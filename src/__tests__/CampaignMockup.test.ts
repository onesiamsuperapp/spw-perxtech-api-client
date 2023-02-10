import {
  IPerxService,
  PerxService,
} from "..";

describe("Campaign Mockup test suit", () => {
  const testingTokenDurationInSeconds = 300;

  const client: IPerxService = new PerxService({
    baseURL: process.env.TEST_PERX_API_URL || "",
    clientId: process.env.TEST_PERX_CLIENT_ID || "",
    clientSecret: process.env.TEST_PERX_CLIENT_SECRET || "",
    tokenDurationInSeconds: testingTokenDurationInSeconds, // 5 mins is more than enough
    delay: 1000 //1 sec
  });

  const ctx = {
    accessToken: "",
  };

  it("success case: pass resp is ok", async () => {
    const campaigns = await client.listAllCampaign(ctx.accessToken, 1, 25, undefined);
    expect(campaigns.data.length).toBeGreaterThan(0)
  });
});
