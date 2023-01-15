export function getLocationUrl() {
  return window.location.href
}

export function matchUrl(matchRes) {
  const url = getLocationUrl()
  for (let match of matchRes) {
    try {
      if (new RegExp(match).test(url)) {
        return true
      }
    } catch (err) {}
  }
  return false
}

export function openNewUrl(url) {
  window.open(url)
}
