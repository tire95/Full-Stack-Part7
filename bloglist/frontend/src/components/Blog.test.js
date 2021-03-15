import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Blog rendering', () => {
  let component
  let mockHandler = jest.fn()
  beforeEach(() => {
    const blog = {
      title: 'Component testing 101',
      author: 'Mr. Anderson',
      url: 'www.AllYourCookiesAreBelongToUs.com',
      likes: 42
    }

    component = render(
      <Blog blog={blog} updateBlog={mockHandler} />
    )
  })

  test('renders title and author but not url and likes', () => {

    const div = component.container.querySelector('.blog')

    expect(div).toHaveTextContent(
      'Component testing 101 by Mr. Anderson'
    )

    const togglable = component.container.querySelector('.togglableContent')
    expect(togglable).toHaveStyle('display: none')
  })

  test('clicking button "Show" shows url and likes', () => {
    const button = component.getByText('Show')
    fireEvent.click(button)

    const togglable = component.container.querySelector('.togglableContent')
    expect(togglable).not.toHaveStyle('display: none')
  })

  test('clicking "Like" button calls the event handler', () => {
    const button = component.getByText('Show')
    fireEvent.click(button)

    const likeButton = component.getByText('Like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})