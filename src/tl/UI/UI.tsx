import {Atom} from '$shared/DataVerse2/atom'
import ReactDOM from 'react-dom'
import React from 'react'
import UIRoot from './UIRoot/UIRoot'
import {rootReducer} from './store/rootReducer'
import configureStore from '$shared/utils/redux/configureStore'
import {UIState} from '$tl/UI/store/types'
import {Store} from 'redux'
import atomFromReduxStore from '$shared/utils/redux/atomFromReduxStore'

export default class UI {
  atom: Atom<UIState>
  reduxStore: Store<UIState>
  _enabled = false

  constructor() {
    this.reduxStore = configureStore({rootReducer})
    this.atom = atomFromReduxStore(this.reduxStore)
  }

  enable() {
    if (this._enabled)
      throw new Error(
        `TheaterJS UI is already enabled. You only need to call .enable() once`,
      )

    this._enabled = true
    this._render()
  }

  protected _render() {
    const containerEl = document.createElement('div')
    containerEl.className = 'theaterjsRoot'
    document.body.appendChild(containerEl)

    ReactDOM.render(<UIRoot ui={this} />, containerEl)
  }
}
