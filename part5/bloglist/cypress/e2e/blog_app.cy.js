describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/test/reset')
    const testUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpwd'
    }
    cy.request('POST', 'http://localhost:3001/api/users', testUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#username').should('exist')
    cy.get('#password').should('exist')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpwd')
      cy.get('#login-button').click()

      cy.contains('Logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrongpwd')
      cy.get('#login-button').click()

      cy.get('.message')
        .should('contain', 'Wrong')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'testuser',
        password: 'testpwd'
      }).then(({ body }) => {
        localStorage.setItem('authBlogAppUser', JSON.stringify(body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('New entry').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('test url')
      cy.get('#add-button').click()

      cy.get('.message').should('contain', 'Added')
      cy.get('.blog').should('contain','Test Title')
    })

    describe('For existing blogs', function() {
      beforeEach(function() {
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: {
            title: 'Test Title',
            author: 'Test Author',
            url: 'test url'
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authBlogAppUser')).token}`
          }
        })
        cy.visit('http://localhost:3000')

      })
      it('Users can like a blog', function() {
        cy.contains('View').click()
        cy.contains('Likes: 0')
        cy.contains('Like').click()
        cy.contains('Likes: 1')
      })

      it('A blog can be deleted', function() {
        cy.contains('View').click()
        cy.contains('Delete').click()
        cy.get('.message').should('contain', 'deleted')
      })

      it('Delete button only visible to blog creators', function() {
        cy.contains('Log out').click()
        const viewUser = {
          name: 'View User',
          username: 'viewuser',
          password: 'viewpwd'
        }
        cy.request('POST', 'http://localhost:3001/api/users', viewUser)
        cy.request('POST', 'http://localhost:3001/api/login', {
          username: 'viewuser',
          password: 'viewpwd'
        }).then(({ body }) => {
          localStorage.setItem('authBlogAppUser', JSON.stringify(body))
          cy.visit('http://localhost:3000')
        })

        cy.contains('View').click()
        cy.get('.blog').should('not.contain', 'Delete')
      })

      it('Blogs are sorted descending by likes', function() {
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: {
            title: 'New Title',
            author: 'Test Author',
            url: 'test url',
            likes: 3
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authBlogAppUser')).token}`
          }
        })
        cy.visit('http://localhost:3000')

        cy.get('.blog').eq(0).should('contain', 'New Title')
        cy.get('.blog').eq(1).should('contain', 'Test Title')
      })
    })
  })
})