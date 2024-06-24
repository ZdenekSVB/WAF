describe('SearchView Component', () => {
  beforeEach(() => {
    // Visit the page before each test
    cy.visit('/dota');
  });

  it('searches for a player successfully', () => {
    const accountId = '1086097017'; // Replace with a valid account ID for testing

    // Stubbing the API call to OpenDota
    cy.intercept('GET', `https://api.opendota.com/api/players/${accountId}`, {
      statusCode: 200,
      body: {} // Mock response body if needed
    }).as('searchPlayer');

    // Type into the search field and press Enter
    cy.get('.search-field input').type(accountId).type('{enter}');

    // Wait for the API call to complete
    cy.wait('@searchPlayer').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      // Optionally, you can assert on the response body as well
      // expect(interception.response.body).to.have.property('someProperty');
    });

    // Assert that the route has changed to AccountView
    cy.url().should('include', `/account-view/${accountId}`);
  });

  it('shows an alert if no account ID is entered', () => {
    // Stubbing the alert method to prevent it from showing on the page
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    // Press Enter without entering any account ID
    cy.get('.search-field input').type('{enter}');

    // Verify that alert was called with the expected message
    cy.get('@alertStub').should('have.been.calledWith', 'Please enter an account ID.');
  });


});
