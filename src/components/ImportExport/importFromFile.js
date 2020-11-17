function importFromFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')

    input.type = 'file'
    input.onchange = (event) => {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.readAsText(file, 'UTF-8')
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      reader.onerror = (event) => reject(new Error('something went wrong !'))
    }

    input.click()
  })
}

export default importFromFile
