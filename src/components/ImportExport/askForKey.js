function askForKey(noConfirmationNeeded) {
  const key1 = keyBasicChecker(
    window.prompt('Enter the key for encryption/description.')
  )

  if (!noConfirmationNeeded) {
    const key2 = keyBasicChecker(
      window.prompt('Confirm the key by enter it again.')
    )

    if (key1 !== key2) {
      throw new Error('Key confirmation failed, careful now !')
    }

    return key2
  }

  return key1
}

function keyBasicChecker(userInput) {
  if (!userInput || userInput === '') {
    throw new Error('Key is required !')
  }

  return userInput
}

export default askForKey
