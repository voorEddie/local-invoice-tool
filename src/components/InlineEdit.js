import { useEffect, useReducer } from 'react'
import produce from 'immer'
import { ReactComponent as EditIcon } from '../icons/edit-solid.svg'
import { ReactComponent as ConfirmIcon } from '../icons/check-circle-solid.svg'
import { ReactComponent as AbortIcon } from '../icons/times-circle-solid.svg'
import Button from './Button'
import './InlineEdit.css'

const initialState = {
  status: null,
  intermediateValue: null,
}

const reducer = produce((draft, action) => {
  switch (action.type) {
    case 'initEdit':
      draft.status = 'init'
      draft.intermediateValue = action.payload
      break
    case 'performEdit':
      draft.status = 'dirty'
      draft.intermediateValue = action.payload
      break
    case 'confirmEdit':
      draft.status = 'save'
      break
    case 'quitEdit':
      draft.status = null
      break
    default:
      break
  }
})

const InlineEdit = ({
  isEditable,
  noMargin = false,
  confirmEditCallback,
  value,
  ...rest
}) => {
  const [{ status, intermediateValue }, dispatch] = useReducer(
    reducer,
    initialState
  )

  useEffect(() => {
    if (status === 'save') {
      confirmEditCallback(intermediateValue)
      dispatch({ type: 'quitEdit' })
    }
  }, [status, intermediateValue, confirmEditCallback])

  if (!isEditable) {
    return null
  }

  const inputKeyShortcut = (e) => {
    const { keyCode } = e
    const keyCodeHandlerHash = {
      13: () => dispatch({ type: 'confirmEdit' }),
      27: () => dispatch({ type: 'quitEdit' }),
    }
    const fn = keyCodeHandlerHash[keyCode]

    fn && fn()
  }

  return (
    <div className="inline-edit">
      <Button
        icon
        noMargin={noMargin}
        handleClick={() => dispatch({ type: 'initEdit', payload: value })}
      >
        <EditIcon title="edit" className="inline-edit__button" />
      </Button>
      {status && (
        <div className="inline-edit__input-area">
          <input
            autoFocus
            value={intermediateValue}
            onChange={(e) =>
              dispatch({
                type: 'performEdit',
                payload: e.target.valueAsNumber || e.target.value,
              })
            }
            onKeyDown={inputKeyShortcut}
            {...rest}
          />
          <Button icon handleClick={() => dispatch({ type: 'confirmEdit' })}>
            <ConfirmIcon
              title="confirm"
              className="inline-edit__confirm-button"
            />
          </Button>
          <Button icon handleClick={() => dispatch({ type: 'quitEdit' })}>
            <AbortIcon title="abort" className="inline-edit__close-button" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default InlineEdit
