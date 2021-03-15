describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('Login').click()
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Logging in', function () {
    beforeEach(function () {
      const user = {
        name: 'Test user',
        username: 'tuser',
        password: 'salainen'
      }
      cy.createUser({ user })
      cy.visit('http://localhost:3000')
      cy.contains('Login').click()
    })

    it('Logging in with existing user succeeds', function () {
      cy.get('#usernameInput').type('tuser')
      cy.get('#passwordInput').type('salainen')
      cy.get('#loginButton').click()
      cy.contains('Test user logged in')
    })

    it('Logging in with nonexisting user fails', function () {
      cy.get('#usernameInput').type('tuser')
      cy.get('#passwordInput').type('solainen')
      cy.get('#loginButton').click()
      cy.get('.error').contains('Wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      const user = {
        name: 'Test user',
        username: 'tuser',
        password: 'salainen'
      }
      cy.createUser({ user })
      cy.login({ username: 'tuser', password: 'salainen' })
    })

    it('Creating a new blog succeeds', function () {
      cy.visit('http://localhost:3000')
      cy.contains('Add a new blog').click()
      cy.get('#titleInput').type('E2E testing with Cypress is surprisingly nice')
      cy.get('#authorInput').type('Mr. Very Reliable Author')
      cy.get('#urlInput').type('www.AA.com')
      cy.get('#blogCreationButton').click()
      cy.contains('E2E testing with Cypress is surprisingly nice by Mr. Very Reliable Author')
    })

    describe('When a blog already exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'But sometimes testing can be a pain in the ass', author: 'So many damn parentheses', url: 'www.INeedHelp.NOW', likes: 0 })
      })
      it('User can like a blog', function () {
        cy.contains('But sometimes testing can be a pain in the ass').parent().get('#toggleButton').click()
        cy.contains('But sometimes testing can be a pain in the ass').parent().get('#likeButton').click()
        cy.contains('But sometimes testing can be a pain in the ass').parent().contains('1')
      })

      it('User who created the blog can delete it', function () {
        cy.contains('But sometimes testing can be a pain in the ass').parent().get('#toggleButton').click()
        cy.contains('But sometimes testing can be a pain in the ass').parent().get('#deleteButton').click()
        cy.get('.message').contains('Blog But sometimes testing can be a pain in the ass deleted')
        cy.get('#blogs').should('not.contain', 'But sometimes testing can be a pain in the ass')
      })

      describe('When several blogs already exist', function () {
        beforeEach(function () {
          cy.createBlog({ title: 'This has most likes', author: 'Why are we here', url: 'www.soTired.sleep', likes: 666 })
          cy.createBlog({ title: 'This is the third one', author: 'every night I can feel my arms', url: 'www', likes: 16 })
          cy.createBlog({ title: 'This is the second one', author: 'just to suffer', url: 'www.coffeeAddictsAnonymous', likes: 42 })
        })

        it.only('Blogs are ordered according to likes', function () {
          cy.get('#blogs').get('.blog:first').contains('This has most likes')
          cy.get('#blogs').get('.blog').eq(1).contains('This is the second one')
          cy.get('#blogs').get('.blog').eq(2).contains('This is the third one')
          cy.get('#blogs').get('.blog:last').contains('But sometimes testing can be a pain in the ass')
        })
      })
    })
  })


})