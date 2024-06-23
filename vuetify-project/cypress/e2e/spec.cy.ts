describe('CSView Tests with Mocked API', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/faceit/profile/*', { fixture: 'profile.json' }).as('getProfile');
    cy.intercept('GET', '/api/faceit/stats/*', { fixture: 'stats.json' }).as('getStats');
    cy.intercept('GET', '/api/faceit/matchHistory/*', { fixture: 'matchHistory.json' }).as('getMatchHistory');
    cy.visit('/');
  });

  it('should display player profile with mocked data', () => {
    cy.get('input[aria-label="Search player\'s profile"]').type('mocked_player');
    cy.contains('Search').click();
    cy.wait('@getProfile');
    cy.wait('@getStats');
    cy.wait('@getMatchHistory');
    cy.contains('mocked_player').should('be.visible');
    cy.contains('ELO:').should('be.visible');
  });
});
