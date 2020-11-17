import clsx from 'clsx'
import './Button.css'

const Button = (props) => {
  const {
    children,
    handleClick,
    alert,
    action,
    smaller,
    inline,
    icon,
    noMargin,
    disabled,
  } = props

  return (
    <div
      className={clsx('button-wrapper', {
        'button-wrapper--disabled': disabled,
        'button-wrapper--icon-margin': icon && !noMargin,
      })}
    >
      <button
        className={clsx('button', {
          'button--alert': alert,
          'button--action': action,
          'button--smaller': smaller,
          'button--inline': inline,
          'button--icon': icon,
        })}
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </button>
      {!icon && <div className="button-wrapper__indicator" />}
    </div>
  )
}

export default Button
