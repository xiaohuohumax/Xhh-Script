import { GMNoAuthError } from '@/exception/gm.error'

export function setValue(name, value) {
  if (typeof GM_setValue != 'function') {
    throw new GMNoAuthError('no auth GM_setValue')
  }
  GM_setValue(name, value)
}

export function getValue(name, defValue = null) {
  if (typeof GM_getValue != 'function') {
    throw new GMNoAuthError('no auth GM_getValue')
  }
  return GM_getValue(name, defValue)
}

export function addValueChangeListener(
  key,
  listenerCallback = (_key, _oldValue, _newValue, _remote) => {},
) {
  if (typeof GM_addValueChangeListener != 'function') {
    throw new GMNoAuthError('no auth GM_addValueChangeListener')
  }
  GM_addValueChangeListener(key, listenerCallback)
}
