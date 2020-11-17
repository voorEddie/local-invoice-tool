import './InvoiceContent.css'
import logo from '../img/logo.JPG'
import PartyInfo from './PartyInfo'
import FeeTable from './FeeTable'
import InlineEdit from './InlineEdit'
import addDays from '../utilities/addDays'
import formatToISODate from '../utilities/formatToISODate'

const InvoiceContent = (props) => {
  const {
    sender,
    receiver,
    terms,
    fees: feeConfig,
    record,
    record: { id, dateOfIssue, paymentReceivedDate, notes, fees, editable },
    numberFormat,
    dispatch,
  } = props

  return (
    <section className="invoice-content">
      <div className="no-print invoice-content__payment-status">
        {paymentReceivedDate && (
          <span className="invoice-content__payment-status__clear">{`Cleared on ${formatToISODate(
            paymentReceivedDate
          )}`}</span>
        )}
        {paymentReceivedDate === null && !editable && (
          <span className="invoice-content__payment-status__not-clear">
            Not clear !
          </span>
        )}
      </div>
      <header className="invoice-content__header">
        <img
          className="invoice-content__header__logo"
          width="112"
          height="68"
          src={logo}
          alt="eddies-logo"
        />
        <h1 className="invoice-content__header__heading">Invoice</h1>
        <div className="invoice-content__header__sender">
          <PartyInfo {...sender} />
        </div>
      </header>
      <main className="invoice-content__main">
        <dl className="invoice-content__main__invoice-to">
          <dt className="invoice-content__main__invoice-client">Bill to</dt>
          <dd>
            <PartyInfo {...receiver} />
          </dd>
          <dt className="invoice-content__main__invoice-number">Invoice #</dt>
          <dd>{id}</dd>
          <dt className="invoice-content__main__invoice-date">Date of issue</dt>
          <dd>{formatToISODate(dateOfIssue)}</dd>
        </dl>
        <div className="invoice-content__main__fee-wrapper">
          <span />
          <FeeTable
            config={feeConfig}
            fees={fees}
            numberFormat={numberFormat}
            isEditable={editable}
            currentRecord={record}
            dispatch={dispatch}
          />
          <span />
        </div>
      </main>
      <div className="invoice-content__grower" />
      <footer className="invoice-content__footer">
        <h4 className="invoice-content__notes-title">
          Notes
          {editable && (
            <InlineEdit
              isEditable
              value={notes}
              type="text"
              confirmEditCallback={(value) =>
                dispatch({
                  type: 'updateCurrentRecordData',
                  payload: { value, field: 'notes' },
                })
              }
            />
          )}
        </h4>
        <p className="invoice-content__notes-content">{notes}</p>
        <h4 className="invoice-content__terms-title">Payment terms</h4>
        <ul className="invoice-content__terms-content">
          {terms.map((item) => {
            const { id, content, paymentInfo, net, quote } = item

            if (id === 1) {
              return (
                <li key={id}>
                  {content}{' '}
                  <span className="invoice-content__terms-content__payment-method">
                    {paymentInfo}
                  </span>
                </li>
              )
            }

            if (id === 2) {
              return (
                <li key={id}>
                  {content}{' '}
                  <span className="invoice-content__terms-content__due-date">
                    {formatToISODate(addDays(dateOfIssue, net))}
                  </span>{' '}
                  <span className="invoice-content__terms-content__net">{`(Net ${net})`}</span>
                </li>
              )
            }

            const parts = content.split('{quote}')

            return (
              <li key={id}>
                {parts[0]}
                <q>{quote}</q>
                {parts[1]}
              </li>
            )
          })}
        </ul>
      </footer>
    </section>
  )
}

export default InvoiceContent
