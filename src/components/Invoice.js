import { useEffect, useReducer } from 'react'
import produce from 'immer'
import Button from './Button'
import PrintableView from './PrintableView'
import InvoiceContent from './InvoiceContent'
import InlineEdit from './InlineEdit'
import formatToISODate from '../utilities/formatToISODate'
import './Invoice.css'

const initialState = {
  records: null,
  currentRecord: null,
}

const reducer = produce((draft, action) => {
  switch (action.type) {
    case 'setRecords':
      draft.records = action.payload
      break
    case 'updateRecordData':
      const { id, value, field } = action.payload
      const index = draft.records.findIndex((record) => record.id === id)

      draft.records[index][field] = value
      break
    case 'updateCurrentRecordData':
      const { value: currentValue, field: currentField } = action.payload

      draft.currentRecord[currentField] = currentValue
      break
    case 'updateCurrentRecordFeeData':
      const {
        feeId,
        value: currentFeeValue,
        field: currentFeeField,
      } = action.payload
      const feeIndex = draft.currentRecord.fees.findIndex(
        (fee) => fee.feeId === feeId
      )

      draft.currentRecord.fees[feeIndex][currentFeeField] = currentFeeValue
      break
    case 'saveCurrentRecordData':
      draft.currentRecord.editable = false
      draft.currentRecord.fees = draft.currentRecord.fees.filter(
        (fee) => fee.quantity !== 0
      )
      const {
        id: newInvoiceId,
        dateOfIssue,
        paymentReceivedDate,
        notes,
        fees,
      } = draft.currentRecord
      draft.records.push({
        id: newInvoiceId,
        dateOfIssue,
        paymentReceivedDate,
        fees,
        notes,
      })
      break
    case 'toListView':
      draft.currentRecord = null
      break
    case 'toDetailView':
      draft.currentRecord = action.payload
      break
    default:
      break
  }
})

const Invoice = ({
  invoices,
  timestamp,
  staticData,
  view,
  toListView,
  toDetailView,
  saveData,
}) => {
  useEffect(() => {
    dispatch({ type: 'setRecords', payload: invoices })
  }, [invoices])

  const [{ records, currentRecord }, dispatch] = useReducer(reducer, {
    ...initialState,
    records: invoices,
  })

  const newInvoiceData = () => {
    const id = records.length + 1
    const dateOfIssue = Date.now()
    const paymentReceivedDate = null
    const notes = `It's a pleasure doing business with you !`
    const fees = [
      { feeId: 1, quantity: 1, note: '' },
      { feeId: 2, quantity: 0, note: '' },
    ]

    return {
      id,
      dateOfIssue,
      paymentReceivedDate,
      notes,
      fees,
      editable: true,
    }
  }

  const saveNewRecord = () => {
    if (window.confirm('Save this invoice ?')) {
      dispatch({ type: 'saveCurrentRecordData' })
      saveData(
        Date.now(),
        produce({ records, currentRecord }, (draft) => {
          draft.currentRecord.editable = false
          draft.currentRecord.fees = draft.currentRecord.fees.filter(
            (fee) => fee.quantity !== 0
          )
          const {
            id: newInvoiceId,
            dateOfIssue,
            paymentReceivedDate,
            notes,
            fees,
          } = draft.currentRecord
          draft.records.push({
            id: newInvoiceId,
            dateOfIssue,
            paymentReceivedDate,
            fees,
            notes,
          })
        }).records
      )
    }
  }

  return (
    <>
      {view === 'detailView' ? (
        <PrintableView
          exitAction={() => {
            dispatch({ type: 'toListView' })
            toListView()
          }}
          isShowSaveButton={currentRecord.editable}
          saveAction={saveNewRecord}
        >
          <InvoiceContent
            {...staticData}
            record={currentRecord}
            dispatch={dispatch}
          />
        </PrintableView>
      ) : (
        <>
          <div className="invoice-table-wrapper">
            {records && (
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date of issue</th>
                    <th>Payment received date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item) => {
                    const { id, dateOfIssue, paymentReceivedDate } = item

                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{formatToISODate(dateOfIssue)}</td>
                        <td>
                          {paymentReceivedDate ? (
                            <>{formatToISODate(paymentReceivedDate)}</>
                          ) : (
                            <>
                              <span>N/A</span>
                              <InlineEdit
                                isEditable
                                value={formatToISODate(Date.now())}
                                type="text"
                                confirmEditCallback={(value) => {
                                  dispatch({
                                    type: 'updateRecordData',
                                    payload: {
                                      id,
                                      value: new Date(value).getTime(),
                                      field: 'paymentReceivedDate',
                                    },
                                  })
                                  saveData(
                                    null,
                                    produce(records, (draft) => {
                                      const index = draft.findIndex(
                                        (record) => record.id === id
                                      )

                                      draft[index][
                                        'paymentReceivedDate'
                                      ] = value
                                    })
                                  )
                                }}
                              />
                            </>
                          )}
                        </td>
                        <td>
                          <Button
                            inline
                            handleClick={() => {
                              dispatch({ type: 'toDetailView', payload: item })
                              toDetailView()
                            }}
                          >
                            Printable view
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4">
                      <Button
                        inline
                        handleClick={() => {
                          dispatch({
                            type: 'toDetailView',
                            payload: newInvoiceData(),
                          })
                          toDetailView()
                        }}
                      >
                        Generate an invoice
                      </Button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
          {timestamp && (
            <footer className="last-generated no-print">
              <div className="last-generated__title">
                Last invoice generated:{' '}
              </div>
              <div className="last-generated__date">
                {new Date(timestamp).toLocaleString()}
              </div>
            </footer>
          )}
        </>
      )}
    </>
  )
}

export default Invoice
