import { reactive } from 'vue'

export class PopupManager {
  constructor() {
    this.topElements = reactive([])
    this.maxZIndex = 0
    this.initilaized = false
  }

  _init() {
    if (this.initilaized) return
    this.maxZIndex = this.getMaxZIndex()
    this.initilaized = true
  }

  getMaxZIndex() {
    if ('UI_KIT_Z_INDEX' in window) return window.UI_KIT_Z_INDEX
    let maxZIndex = 80001
    const elements = document.querySelectorAll('body *')
    for (let i = 0, ii = elements.length; i < ii; i++) {
      const element = elements[i]
      let zIndex = parseFloat(window.getComputedStyle(element).zIndex || element.style.zIndex)
      if (zIndex > maxZIndex) maxZIndex = zIndex
    }
    return maxZIndex
  }

  getNewZIndex() {
    if (!this.initilaized) this._init()
    return ++this.maxZIndex
  }

  setBodyOverflow() {
    const shouldLock = this.topElements.length > 0
    document.body.style.overflow = shouldLock ? 'hidden' : ''
    document.body.classList.toggle('ir-has-popup', shouldLock)
  }

  get topElement() {
    return this.topElements[0]
  }

  setTopElement(element, add = true) {
    if (add) {
      this.topElements.unshift(element)
    } else {
      this.removeFromTopElements(element)
    }
  }

  removeFromTopElements(element) {
    this.topElements = this.topElements.filter((el) => el !== element)
  }

  destroyElement(element) {
    popupManager.removeFromTopElements(element)
    popupManager.setBodyOverflow()
  }
}

export const popupManager = new PopupManager()
