import './PartyInfo.css'

const PartyInfo = (props) => {
  const { name, officialName, vat, address, phone, email } = props

  return (
    <dl className="party-info">
      {officialName && (
        <>
          <dt>Name:</dt>
          <dd>
            {officialName}
            {name && (
              <span className="party-info__aka">{` a.k.a. ${name}`}</span>
            )}
          </dd>
        </>
      )}

      {email && (
        <>
          <dt>Email:</dt>
          <dd>{email}</dd>
        </>
      )}

      {vat && (
        <>
          <dt>VAT #:</dt>
          <dd>{vat}</dd>
        </>
      )}

      {phone && (
        <>
          <dt>Phone:</dt>
          <dd>{phone}</dd>
        </>
      )}

      {address && (
        <>
          <dt>Address:</dt>
          <dd>{address}</dd>
        </>
      )}
    </dl>
  )
}

export default PartyInfo
