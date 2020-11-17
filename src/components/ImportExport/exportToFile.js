function exportToFile(cipher) {
  const blob = new Blob([cipher], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.download = 'data.txt'
  link.href = url
  link.click()
}

export default exportToFile
