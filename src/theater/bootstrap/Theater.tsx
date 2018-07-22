import Ticker from '$shared/DataVerse/Ticker'
import {Atomify} from '$shared/DataVerse/atoms/atomifyDeep'
import {UnwrapDictAtom} from '$shared/DataVerse/atoms/dictAtom'
import AbstractDerivedDict from '$shared/DataVerse/derivations/dicts/AbstractDerivedDict'
import {PointerDerivation} from '$shared/DataVerse/derivations/pointer'
import {Atom} from '$shared/DataVerse2/atom'
import Studio from '$theater/bootstrap/Studio'
import atomFromReduxStore from '$shared/utils/redux/atomFromReduxStore'
import {ITheaterStoreState} from '$theater/types'
import {Store} from 'redux'
import configureAtom from './configureAtom'
import configureStore from '$shared/utils/redux/configureStore'
import rootReducer from './rootReducer'

export type TheaterStateAtom = Atomify<ITheaterStoreState>

type Options = {}

export default class Theater {
  atom2: Atom<ITheaterStoreState>
  _ran: boolean
  atom: TheaterStateAtom
  atomP: PointerDerivation<
    AbstractDerivedDict<UnwrapDictAtom<TheaterStateAtom>>
  >
  ticker: Ticker
  store: Store<ITheaterStoreState>
  studio: Studio

  constructor(readonly _options: Options) {
    this._ran = false
    this.ticker = new Ticker()
    this.store = configureStore({rootReducer}) as $FixMe
    this.atom = configureAtom(this.store)
    this.atomP = this.atom.derivedDict().pointer()
    this.atom2 = atomFromReduxStore(this.store)

    if (process.env.NODE_ENV === 'development' && module.hot) {
      // @todo
      // module.hot.accept('./rootReducer', () => {
      //   const r: $IntentionalAny = require
      //   store.dispatch(
      //     multiReduceStateAction([
      //       {
      //         path: ['componentModel', 'modifierDescriptors', 'core'],
      //         reducer: () =>
      //           r(
      //             '$theater/componentModel/coreModifierDescriptors/coreModifierDescriptors',
      //           ).default,
      //       },
      //       {
      //         path: ['componentModel', 'componentDescriptors', 'core'],
      //         reducer: () =>
      //           r(
      //             '$theater/componentModel/coreComponentDescriptors/coreComponentDescriptors',
      //           ).default,
      //       },
      //     ]),
      //   )
      // })
    }
  }

  _setStudio(studio: Studio) {
    this.studio = studio
  }

  run(pathToProject: string) {
    if (this._ran)
      throw new Error(`TheaterJS.run() has already been called once`)

    this._ran = true

    const onAnimationFrame = () => {
      this.studio && this.studio._tick()
      this.ticker.tick()
      window.requestAnimationFrame(onAnimationFrame)
    }
    window.requestAnimationFrame(onAnimationFrame)

    if (this.studio) {
      this.studio._run(pathToProject)
    }
  }
}
