// cypress/e2e/simpleAccountView.cy.js

describe('Dota 2 Player Profile View Components', () => {
  beforeEach(() => {
    // Visit the page for a specific account ID
    cy.visit('/account-view/1086097017');
  });

  it('displays the player profile card', () => {
    // Wait for the loading to complete
    cy.get('.v-overlay__content', { timeout: 10000 }).should('not.exist');

    // Check that the profile card is visible
    cy.get('.profile-card').should('be.visible');
  });

  it('displays the player stats card', () => {
    // Wait for the loading to complete
    cy.get('.v-overlay__content', { timeout: 10000 }).should('not.exist');

    // Check that the stats card is visible
    cy.get('.stats-card').should('be.visible');
  });

  it('displays the recent matches card', () => {
    // Wait for the loading to complete
    cy.get('.v-overlay__content', { timeout: 10000 }).should('not.exist');

    // Check that the matches card is visible
    cy.get('.matches-card').should('be.visible');
  });

  it('displays the heroes stats card', () => {
    // Wait for the loading to complete
    cy.get('.v-overlay__content', { timeout: 10000 }).should('not.exist');

    // Check that the heroes card is visible
    cy.get('.heroes-card').should('be.visible');
  });

});
