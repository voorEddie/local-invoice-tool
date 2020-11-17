function formatToISODate(input) {
  return new Date(input).toISOString().substring(0, 10)
}

export default formatToISODate
