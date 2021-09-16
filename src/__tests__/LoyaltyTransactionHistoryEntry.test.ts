import { Deserialize } from 'cerialize'
import { makePolicy, ComparePolicy } from './utils/compare'
import { PerxLoyaltyTransactionDetail, PerxLoyaltyTransactionDetailData, PerxLoyaltyTransactionHistoryEntry } from '../models/LoyaltyTransactionHistoryEntry'

const _fixture = {
  simple: {
    "id": 334,
    "amount": 4600,
    "identifier": "Awarded Points",
    "loyalty_id": 1,
    "loyalty_name": "Siam Piwat Spending  Loyalty Program",
    "name": "Loyalty Earn Rule",
    "properties": {
      "test": "123"
    },
    "rule_id": 1,
    "rule_name": "Basic Earn Rule",
    "transacted_amount": "4600.0",
    "transacted_at": "2021-09-14T04:35:53.227Z",
    "transacted_cents": 0,
    "transacted_currency": "SGD",
    "transaction_details": {
        "type": "Transaction",
        "data": {
            "id": 137,
            "user_account_id": 276,
            "updated_at": "2021-09-14T04:36:36.610Z",
            "transaction_type": "purchase",
            "amount": 4600.0,
            "transaction_date": "2021-09-14T04:35:53.227Z",
            "currency": "SGD",
            "workflow_id": null,
            "created_at": "2021-09-14T04:35:53.235Z",
            "properties": {},
            "transaction_reference": "UNI-POS12345347",
            "points_earned": 4623,
            "merchant_user_account_id": null
        }
    }
  },
  noDetails: {
    "id": 158,
    "amount": 400000,
    "identifier": "Awarded Points",
    "loyalty_id": 2,
    "loyalty_name": "VizCoin Program",
    "name": "Custom points",
    "properties": {},
    "rule_id": null,
    "rule_name": null,
    "transacted_amount": null,
    "transacted_at": "2021-09-05T10:48:37.222Z",
    "transacted_cents": 0,
    "transacted_currency": null,
    "transaction_details": null
  },
  withError: {
    "id": 273,
    "amount": -22,
    "identifier": "Awarded Points",
    "loyalty_id": 2,
    "loyalty_name": "VizCoin Program",
    "name": "Loyalty Earn Rule",
    "properties": {
        "store_id": 1,
        "error_params": "{:user_account=>#<User::Account id: 276, identifier: \"22222\", email: nil, first_name: nil, last_name: nil, name: nil, code: nil, phone: \"22222\", birthday: \"1987-06-29\", age_range_min: nil, age_range_max: nil, gender: \"F\", locale: nil, state: \"active\", properties: {}, legacy_user_id: nil, created_at: \"2021-09-02 02:57:47\", updated_at: \"2021-09-05 10:47:57\", birth_day: nil, birth_month: nil, salutation: nil, account_holder_id: nil, personal_properties: {\"email\"=>nil, \"phone\"=>\"22222\", \"gender\"=>\"F\", \"address\"=>nil, \"birthday\"=>\"1987-06-29\", \"joined_at\"=>\"2021-09-02T02:57:47.231Z\", \"mobile_no\"=>\"22222\", \"account_id\"=>\"10012232\", \"birth_date\"=>\"1987-06-29\", \"citizen_id\"=>\"2222222222\", \"nationality_cd\"=>\"th\", \"customer_status\"=>\"actived\"}, joined_at: \"2021-09-02 02:57:47\", middle_name: nil, address: nil, otp: nil, otp_sent_at: nil, password_changed_at: \"2021-09-02 02:57:47\", account_confirmed_at: \"2021-09-02 02:57:47\">, :rule=>#<TransactionRule id: 121, outcome_type: \"StoredValue::Campaign\", outcome_id: 1, name: \"Reversal Transaction\", conditions: [{\"operator\"=>\"equals\", \"attribute\"=>\"transaction_type\", \"selected_values\"=>\"reversal\"}], created_at: \"2021-09-08 09:59:22\", updated_at: \"2021-09-08 09:59:22\", event_name: \"transactions_created\", event_params: {}, rule_type: \"loyalty_rule\", outcome_value: 1, state: \"active\", begins_at: \"2021-09-08 09:57:39\", ends_at: nil, filters: {\"current_birthday\"=>[{\"type\"=>\"current_birthday\", \"criteria\"=>[{\"values\"=>false}]}], \"current_birthmonth\"=>[{\"type\"=>\"current_birthmonth\", \"criteria\"=>[{\"values\"=>false}]}]}, account_interval_units: nil, account_interval_period: nil, account_interval_limit: nil, outcome_base: 0.1e1, trigger_limit: nil, priority: 0, max_outcome_value: nil, account_limit: nil, action_name: \"issue_points\", action_params: nil, send_notification: nil, outcome_options: {\"operation\"=>\"burn_points\"}, version: 1, rule_group_id: nil>, :transaction=>#<Transaction id: 105, user_account_id: 276, transaction_reference: \"inv004\", transaction_type: \"reversal\", transaction_date: \"2021-09-10 08:43:15\", amount: 0.22e4, currency: \"USD\", workflow_id: nil, created_at: \"2021-09-10 08:43:15\", updated_at: \"2021-09-10 08:43:15\", properties: {\"store_id\"=>1, \"receipt_date\"=>\"08/09/2021\", \"reverse_receipt_number\"=>\"inv003\"}, merchant_user_account_id: nil, processed_at: nil, state: \"pending\", process_at: \"2021-09-10 08:43:15\">, :count=>-2200, :reason_code=>\"Loyalty Earn Rule\", :round_sale_return_points_to_user_balance=>false}",
        "receipt_date": "08/09/2021",
        "error_message": "You do not have enough points to redeem",
        "reverse_receipt_number": "inv003"
    },
    "rule_id": 122,
    "rule_name": "Reversal Transaction",
    "transacted_amount": "2200.0",
    "transacted_at": "2021-09-10T08:43:15.448Z",
    "transacted_cents": 0,
    "transacted_currency": "USD",
    "transaction_details": {
      "type": "Transaction",
      "data": {
        "id": 105,
        "user_account_id": 276,
        "updated_at": "2021-09-10T08:43:30.542Z",
        "transaction_type": "reversal",
        "amount": 2200.0,
        "transaction_date": "2021-09-10T08:43:15.448Z",
        "currency": "USD",
        "workflow_id": null,
        "created_at": "2021-09-10T08:43:15.456Z",
        "properties": {
          "store_id": 1,
          "error_params": "{:user_account=>#<User::Account id: 276, identifier: \"22222\", email: nil, first_name: nil, last_name: nil, name: nil, code: nil, phone: \"22222\", birthday: \"1987-06-29\", age_range_min: nil, age_range_max: nil, gender: \"F\", locale: nil, state: \"active\", properties: {}, legacy_user_id: nil, created_at: \"2021-09-02 02:57:47\", updated_at: \"2021-09-05 10:47:57\", birth_day: nil, birth_month: nil, salutation: nil, account_holder_id: nil, personal_properties: {\"email\"=>nil, \"phone\"=>\"22222\", \"gender\"=>\"F\", \"address\"=>nil, \"birthday\"=>\"1987-06-29\", \"joined_at\"=>\"2021-09-02T02:57:47.231Z\", \"mobile_no\"=>\"22222\", \"account_id\"=>\"10012232\", \"birth_date\"=>\"1987-06-29\", \"citizen_id\"=>\"2222222222\", \"nationality_cd\"=>\"th\", \"customer_status\"=>\"actived\"}, joined_at: \"2021-09-02 02:57:47\", middle_name: nil, address: nil, otp: nil, otp_sent_at: nil, password_changed_at: \"2021-09-02 02:57:47\", account_confirmed_at: \"2021-09-02 02:57:47\">, :rule=>#<TransactionRule id: 121, outcome_type: \"StoredValue::Campaign\", outcome_id: 1, name: \"Reversal Transaction\", conditions: [{\"operator\"=>\"equals\", \"attribute\"=>\"transaction_type\", \"selected_values\"=>\"reversal\"}], created_at: \"2021-09-08 09:59:22\", updated_at: \"2021-09-08 09:59:22\", event_name: \"transactions_created\", event_params: {}, rule_type: \"loyalty_rule\", outcome_value: 1, state: \"active\", begins_at: \"2021-09-08 09:57:39\", ends_at: nil, filters: {\"current_birthday\"=>[{\"type\"=>\"current_birthday\", \"criteria\"=>[{\"values\"=>false}]}], \"current_birthmonth\"=>[{\"type\"=>\"current_birthmonth\", \"criteria\"=>[{\"values\"=>false}]}]}, account_interval_units: nil, account_interval_period: nil, account_interval_limit: nil, outcome_base: 0.1e1, trigger_limit: nil, priority: 0, max_outcome_value: nil, account_limit: nil, action_name: \"issue_points\", action_params: nil, send_notification: nil, outcome_options: {\"operation\"=>\"burn_points\"}, version: 1, rule_group_id: nil>, :transaction=>#<Transaction id: 105, user_account_id: 276, transaction_reference: \"inv004\", transaction_type: \"reversal\", transaction_date: \"2021-09-10 08:43:15\", amount: 0.22e4, currency: \"USD\", workflow_id: nil, created_at: \"2021-09-10 08:43:15\", updated_at: \"2021-09-10 08:43:15\", properties: {\"store_id\"=>1, \"receipt_date\"=>\"08/09/2021\", \"reverse_receipt_number\"=>\"inv003\"}, merchant_user_account_id: nil, processed_at: nil, state: \"pending\", process_at: \"2021-09-10 08:43:15\">, :count=>-2200, :reason_code=>\"Loyalty Earn Rule\", :round_sale_return_points_to_user_balance=>false}",
          "receipt_date": "08/09/2021",
          "error_message": "You do not have enough points to redeem",
          "reverse_receipt_number": "inv003"
        },
        "transaction_reference": "inv004",
        "points_earned": -22,
        "merchant_user_account_id": null
      }
    }
  }
}


describe('Perx LoyaltyTransactionHistoryEntry', () => {
  it.each`
    name                      | fixtureData
    ${'simple'}               | ${_fixture.simple}
    ${'error'}                | ${_fixture.withError}
    ${'no details'}           | ${_fixture.noDetails}
  `('can deserialized $name from JSON', ({ name, fixtureData }) => {
    const o: PerxLoyaltyTransactionHistoryEntry = Deserialize(fixtureData, PerxLoyaltyTransactionHistoryEntry)

    expect(o).toBeInstanceOf(PerxLoyaltyTransactionHistoryEntry)
    if (o.transactionDetails) {
      expect(o.transactionDetails).toBeInstanceOf(PerxLoyaltyTransactionDetail)
      expect(o.transactionDetails.data).toBeInstanceOf(PerxLoyaltyTransactionDetailData)
    }

    const policy = makePolicy(o, fixtureData)
    let fieldCompare: Array<[string, ComparePolicy]> = [
      ['id', policy.equal],
      ['amount', policy.equal],
      ['loyalty_id', policy.equal],
      ['loyalty_name', policy.equal],
      ['name', policy.equal],
      ['properties', policy.equal],
      ['transacted_amount', policy.equal],
      ['transacted_at', policy.isoDate],
      ['transacted_cents', policy.equal],
      ['transacted_currency', policy.equal],
    ]
    if (o.transactionDetails) {
      fieldCompare = fieldCompare.concat([
        ['transaction_details.type', policy.equal],
        ['transaction_details.data.id', policy.equal],
        ['transaction_details.data.user_account_id', policy.equal],
        ['transaction_details.data.updated_at', policy.isoDate],
        ['transaction_details.data.transaction_type', policy.equal],
        ['transaction_details.data.amount', policy.equal],
        ['transaction_details.data.transaction_date', policy.isoDate],
        ['transaction_details.data.currency', policy.equal],
        ['transaction_details.data.workflow_id', policy.equal],
        ['transaction_details.data.created_at', policy.isoDate],
        ['transaction_details.data.properties', policy.equal],
        ['transaction_details.data.transaction_reference', policy.equal],
        ['transaction_details.data.points_earned', policy.equal],
        ['transaction_details.data.merchant_user_account_id', policy.equal],
      ])
    }
    for (const f of fieldCompare) {
      const fieldName = f[0]
      const policyComparer = f[1]
      policyComparer(fieldName)
    }
  })
})