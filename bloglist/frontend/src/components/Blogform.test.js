import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  let component
  let mockHandler = jest.fn()
  beforeEach(() => {

    component = render(
      <BlogForm createBlog={mockHandler} />
    )
  })

  test('updates parent state and calls createBlog', () => {

    const titleInput = component.container.querySelector('#titleInput')
    const authorInput = component.container.querySelector('#authorInput')
    const urlInput = component.container.querySelector('#urlInput')
    const form = component.container.querySelector('form')
    fireEvent.change(titleInput, {
      target: { value: 'testing of forms could be easier' }
    })
    fireEvent.change(authorInput, {
      target: { value: 'Nakke Nakuttaja' }
    })
    fireEvent.change(urlInput, {
      target: { value: 'www.youtube.com/watch?v=dQw4w9WgXcQ' }
    })
    fireEvent.submit(form)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('testing of forms could be easier')
    expect(mockHandler.mock.calls[0][0].author).toBe('Nakke Nakuttaja')
    expect(mockHandler.mock.calls[0][0].url).toBe('www.youtube.com/watch?v=dQw4w9WgXcQ')


  })

})