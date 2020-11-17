import { useCallback, useEffect, useReducer } from 'react'
import produce from 'immer'
import useLocalStorage from './hooks/useLocalStorage'
import ImportExport from './components/ImportExport'
import Invoice from './components/Invoice'
import './App.css'
import './print.css'

const initialState = {
  view: 'listView',
  data: null,
}

const reducer = produce((draft, action) => {
  switch (action.type) {
    case 'toListView':
      draft.view = 'listView'
      break
    case 'toDetailView':
      draft.view = 'detailView'
      break
    case 'setData':
      draft.data = action.payload
      break
    case 'saveData':
      const { timestamp, records } = action.payload
      draft.data.timestamp = timestamp
      draft.data.invoices = records
      break
    default:
      break
  }
})

const App = () => {
  const [invoice, setInvoice] = useLocalStorage('local-invoice-tool', null)
  const [{ view, data }, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: 'setData', payload: invoice })
  }, [invoice])

  const toListView = useCallback(() => {
    dispatch({ type: 'toListView' })
  }, [])

  const toDetailView = useCallback(() => {
    dispatch({ type: 'toDetailView' })
  }, [])

  const saveData = useCallback(
    (timestamp, records) => {
      dispatch({ type: 'saveData', payload: { timestamp, records } })
      setInvoice({
        ...data,
        invoices: records,
        timestamp,
      })
    },
    [data, setInvoice]
  )

  if (!data) {
    return null
  }

  const { invoices, timestamp, ...rest } = data

  return (
    <div className="app">
      {view === 'listView' && <ImportExport data={data} setData={setInvoice} />}
      {data && (
        <Invoice
          invoices={invoices}
          timestamp={timestamp}
          staticData={rest}
          view={view}
          toListView={toListView}
          toDetailView={toDetailView}
          saveData={saveData}
        />
      )}
    </div>
  )
}

export default App
