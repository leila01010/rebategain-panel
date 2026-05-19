const api = 'client'

export default {
  accounts: api + '/accounts',
  brokers: api + '/brokers',
  inquiries: api + '/inquiries',
  rebateEstimates: api + '/accounts/{account}/inquiries',
  assets: api + '/assets',
  paymentMethods: api + '/payment-methods',
  paymentMethodDefault: api + '/payment-methods/{id}/default',
  overview: api + '/dashboard/overview',
}
