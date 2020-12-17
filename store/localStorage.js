export const state = () => ({ errorList: [], usedBefore: false })

export const mutations = {
  appendError (state, { meaning, kana, kanji }) {
    if (state.errorList.findIndex(x => x.meaning === meaning) === -1) {
      state.errorList.push({
        meaning, kana, kanji
      })
    }
  },
  removeError (state, meaning) {
    const index = state.errorList.findIndex(x => x.meaning === meaning)
    if (index !== -1) {
      state.errorList.splice(index, 1)
    }
  },
  setError (state, list) {
    state.errorList = list
  },
  markUsed (state) {
    state.usedBefore = true
  }
}
