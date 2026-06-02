const KEY = 'RG_PANEL_CONFIG'

export const storage = {
  get(key) {
    let data = localStorage.getItem(KEY) || '{}'
    try {
      data = JSON.parse(data)
    } catch {
      data = {}
    }

    if (key) data = data[key]

    return data
  },

  set(key, value) {
    let data = this.get()

    data[key] = value

    window.localStorage.setItem(KEY, JSON.stringify(data))
  },

  remove(key) {
    let data = this.get()

    if (key) {
      if (data[key] === undefined) return
      data[key] = undefined
    }
    else {
      data = {}
    }

    window.localStorage.setItem(KEY, JSON.stringify(data))
  },

  clear() {
    localStorage.clear()
  }
}
