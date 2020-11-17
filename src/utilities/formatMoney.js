function formatMoney(locale, currency, number) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    number
  )
}

export default formatMoney
