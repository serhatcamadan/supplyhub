import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('only calls the function once after the delay when called repeatedly', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 500)

    debounced('a')
    debounced('b')
    debounced('c')

    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(500)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  it('calls the function again after a new delay window', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 500)

    debounced('a')
    vi.advanceTimersByTime(500)
    debounced('b')
    vi.advanceTimersByTime(500)

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenNthCalledWith(1, 'a')
    expect(fn).toHaveBeenNthCalledWith(2, 'b')
  })
})
