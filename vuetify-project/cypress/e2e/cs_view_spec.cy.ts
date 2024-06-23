// cypress/e2e/cs_view_spec.js
describe('CSView E2E Tests', () => {
  beforeEach(() => {
    // Mock API responses if needed
    cy.intercept('GET', '**/faceit/profile/*', { fixture: 'profile.json' }).as('getProfile');
    cy.intercept('GET', '**/faceit/stats/*', { fixture: 'stats.json' }).as('getStats');
    cy.intercept('GET', '**/faceit/matchHistory/*', { fixture: 'matchHistory.json' }).as('getMatchHistory');
    
    // Visit the CSView route directly
    cy.visit('/counter-strike');
  });

  it('should search for a player profile', () => {
    // Wait for the input field to be visible
    cy.get('input[aria-label="Search player\'s profile"]').should('be.visible').type('mocked_player');
    cy.contains('Search').click();
    cy.wait('@getProfile');
    cy.wait('@getStats');
    cy.wait('@getMatchHistory');
    
    cy.contains('mocked_player').should('be.visible');
    cy.contains('ELO:').should('be.visible');
  });

  it('should switch views correctly', () => {
    // Wait for the input field to be visible
    cy.get('input[aria-label="Search player\'s profile"]').should('be.visible').type('mocked_player');
    cy.contains('Search').click();
    cy.wait('@getProfile');
    cy.wait('@getStats');
    cy.wait('@getMatchHistory');

    cy.contains('Stats').click();
    cy.contains('Main statistics').should('be.visible');

    cy.contains('Match history').click();
    cy.contains('Match history').should('be.visible');

    cy.contains('ELO').click();
    cy.contains('ELO Progress').should('be.visible');
  });

  it('should display error message on invalid player search', () => {
    // Wait for the input field to be visible
    cy.get('input[aria-label="Search player\'s profile"]').should('be.visible').type('invalid_nickname');
    cy.contains('Search').click();
    cy.contains('Player not found. Please check the nickname and try again.').should('be.visible');
  });
});
