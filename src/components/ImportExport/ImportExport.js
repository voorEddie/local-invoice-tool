import ActionPositioner from '../ActionPositioner'
import Button from '../Button'
import importFromFile from './importFromFile'
import exportToFile from './exportToFile'
import askForKey from './askForKey'
import { encrypt, decrypt } from './crypto'

const ImportExport = ({ data, setData }) => {
  const isInvoiceLoaded = !!data

  const showErrorModal = (error) => window.alert(error)

  const importAction = async () => {
    try {
      const cipher = await importFromFile()
      const key = askForKey('noConfirmationNeeded')
      const importedData = decrypt(cipher, key)

      setData(importedData)
    } catch (error) {
      showErrorModal(error)
    }
  }

  const exportAction = () => {
    try {
      const key = askForKey()
      const cipher = encrypt(data, key)

      exportToFile(cipher)
    } catch (error) {
      showErrorModal(error)
    }
  }

  return (
    <ActionPositioner placeOnTop={isInvoiceLoaded}>
      <Button handleClick={importAction} smaller={isInvoiceLoaded} alert>
        Import
      </Button>
      <Button
        handleClick={exportAction}
        smaller={isInvoiceLoaded}
        action
        disabled={!isInvoiceLoaded}
      >
        Export
      </Button>
    </ActionPositioner>
  )
}

export default ImportExport
