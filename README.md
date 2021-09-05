PerxTech API Client
==

![Published](https://github.com/peatiscoding/perxtech-api-client/actions/workflows/publish.yml/badge.svg)

The Perx's API client implemented for node.js using TypeScript.

# Install:

```
npm install perxtech-api-client

or 

yarn add perxtech-api-client
```

# Usage

```ts
import {
  PerxService,
  IPerxService,
  TokenResponse,
  PerxReward,
} from 'perxtech-api-client'


const perxClient: IPerxService = new PerxService({
  baseURL: '<your perx endpoint>',
  clientId: '<your perx clientId>',
  clientSecret: '<your perx clientSecret>',
  tokenDurationInSeconds: 3600,
})

// Issue user's token with specific userId
const response: TokenResponse = await perxClient.getUserToken(userId)
const accessToken = response.accessToken

// List perx's rewards by given user.
const rewards: PerxReward[] = await perxClient.getRewards(accessToken, {})
```

# To Run Testcases

Testcases are designed to run against the actual Perx's server. However all the environment and configurable parameters are to be injected via `dotenv`.

To do this create your own `.env` in root folder of this project (the file is git ignored) Then provide following fields to make our test script run against your perx setups.

```
TEST_PERX_API_URL=https://api.perxtech.io/
TEST_PERX_CLIENT_ID=SOME_RANDOM_PERX_CLIENT_ID
TEST_PERX_CLIENT_SECRET=SOME_RANDOM_PERX_CLIENT_SECRET

# Perx's target account to run against
TEST_PERX_USER_IDENTIFIER=66666   # Your focal customer's 'identifier' (NOT Perx's Id)
TEST_PERX_USER_ID=253             # Your focal customer's 'id' (Yes this one is Perx's Id)

# Perx's target reward id to issue as voucher, reserve the voucher and commit the voucher.
TEST_PERX_REWARD_ID=111

# Perx's Loyalty program that the given perx user enrolled in
TEST_PERX_LOYALTY_PROGRAM_ID=2
```

**NOTE**: As the test run against live perx's server. Please setup your data so that the test can run reapeatly. e.g. User should have already enrolled in the loyalty program configured. And it should have large amount of points. While reward should be repeatly claimed.

Once done you can simply run the test via our jest setup.

```
npm run test
```

# Contribution

This client is written for certain project therefore not all APIs are implemented. If you have your needs and need to pass in ones. PR are more than welcomes.