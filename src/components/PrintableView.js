import Button from './Button'
import './PrintableView.css'

const PrintableView = (props) => {
  const { exitAction, isShowSaveButton, saveAction, children } = props

  return (
    <div className="printable-view">
      <div className="printable-view__float-button no-print">
        <Button handleClick={exitAction} smaller>
          Exit printable view
        </Button>
        {isShowSaveButton && (
          <Button handleClick={saveAction} action smaller>
            Save record
          </Button>
        )}
      </div>
      <div className="printable-view__inner">{children}</div>
    </div>
  )
}

export default PrintableView
