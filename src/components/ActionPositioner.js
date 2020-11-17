import clsx from 'clsx'
import './ActionPositioner.css'

const ActionPositioner = (props) => {
  const { children, placeOnTop } = props

  return (
    <div
      className={clsx('action-positioner', {
        'action-positioner--place-on-top': placeOnTop,
      })}
    >
      {children}
    </div>
  )
}

export default ActionPositioner
