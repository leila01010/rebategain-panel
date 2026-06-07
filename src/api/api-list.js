const api = 'client'

export default {
  user: 'auth/user',
  userAvatar: 'auth/user/avatar',
  ssoExchange: 'auth/sso/exchange-code',
  logout: 'auth/logout',
  accounts: api + '/accounts',
  brokers: api + '/brokers',
  inquiries: api + '/inquiries',
  rebateEstimates: api + '/accounts/{account}/inquiries',
  assets: api + '/assets',
  paymentMethods: api + '/payment-methods',
  paymentMethodDefault: api + '/payment-methods/{id}/default',
  overview: api + '/dashboard/overview',
  withdraws: api + '/withdraws',
  balances: api + '/balances',
  countries: 'public/countries',
}
