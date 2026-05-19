const api = 'client'

export default {
  accounts: api + '/accounts',
  brokers: api + '/brokers',
  paymentMethods: api + '/payment-methods',
  paymentMethodDefault: api + '/payment-methods/{id}/default',
}
