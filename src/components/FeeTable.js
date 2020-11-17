import InlineEdit from './InlineEdit'
import formatMoney from '../utilities/formatMoney'
import './FeeTable.css'

const FeeTable = (props) => {
  const {
    config,
    fees,
    numberFormat: { currency, locale },
    isEditable,
    dispatch,
  } = props
  const feeItem = []

  return (
    <>
      <table className="fee-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Unit price</th>
            <th>Line total</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((item) => {
            const { feeId, quantity, note } = item
            const { name, unit, unitPrice } = config.find(
              ({ id }) => feeId === id
            )
            const total = formatMoney(locale, currency, unitPrice * quantity)

            feeItem.push(unitPrice * quantity)

            return (
              <tr key={feeId}>
                <td>
                  <div className="fee-table-item-name">{name}</div>
                  <div className="fee-table-item-description">
                    {note}
                    <InlineEdit
                      isEditable={isEditable}
                      value={note}
                      type="text"
                      noMargin={note === ''}
                      confirmEditCallback={(value) =>
                        dispatch({
                          type: 'updateCurrentRecordFeeData',
                          payload: { value, feeId, field: 'note' },
                        })
                      }
                    />
                  </div>
                </td>
                <td>{unit}</td>
                <td>
                  {quantity}
                  <InlineEdit
                    isEditable={isEditable}
                    value={quantity}
                    type="number"
                    min={1}
                    max={21}
                    confirmEditCallback={(value) =>
                      dispatch({
                        type: 'updateCurrentRecordFeeData',
                        payload: { value, feeId, field: 'quantity' },
                      })
                    }
                  />
                </td>
                <td>{formatMoney(locale, currency, unitPrice)}</td>
                <td>{total}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5">
              <div className="fee-table-total-label">Invoice Total</div>
              <div className="fee-table-total">
                {formatMoney(
                  locale,
                  currency,
                  feeItem.reduce((cur, acc) => cur + acc, 0)
                )}
              </div>
              <div className="fee-table-vat-disclaimer">VAT is included</div>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}

export default FeeTable
