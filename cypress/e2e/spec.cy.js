/// <reference types="cypress" />

describe('CSView Application Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should toggle the menu', () => {
    cy.get('.mdi-menu').click();
    cy.get('.v-navigation-drawer').should('be.visible');
  });

  it('should navigate to the correct pages from the menu', () => {
    const pages = [
      { title: 'Main Page', path: '/' },
      { title: 'TFT', path: '/tft/search' },
      { title: 'CS2', path: '/counter-strike' },
      { title: 'LOL', path: '/lol/search' },
      { title: 'Valorant', path: '/valorant' },
    ];

    pages.forEach((page, index) => {
      cy.get('.mdi-menu').click();
      cy.contains(page.title).click();
      cy.url().should('include', page.path);
    });
  });

  it('should search for a player profile', () => {
    const testNickname = 'testPlayer';

    cy.visit('/counter-strike');
    cy.get('input[label="Search player\'s profile"]').type(testNickname);
    cy.contains('Search').click();

    // Mock the API response for profile
    cy.intercept('GET', `/api/getFaceitProfile/${testNickname}`, {
      fixture: 'profile.json',
    });

    cy.wait(2000); // Wait for the search to complete

    cy.get('.profile-section').should('be.visible');
    cy.get('.profile-section h2').should('contain', testNickname);
  });

  it('should display loading animation during API call', () => {
    cy.visit('/counter-strike');
    cy.get('input[label="Search player\'s profile"]').type('testPlayer');
    cy.contains('Search').click();

    cy.get('.v-progress-circular').should('be.visible');
    cy.wait(2000); // Adjust this to match your actual loading duration
    cy.get('.v-progress-circular').should('not.exist');
  });

  it('should switch between views (stats, match history, ELO)', () => {
    // Navigate to counter-strike page
    cy.visit('/counter-strike');

    // Mock the API response for profile
    cy.intercept('GET', '/api/getFaceitProfile/testPlayer', {
      fixture: 'profile.json',
    });

    // Search for a profile
    cy.get('input[label="Search player\'s profile"]').type('testPlayer');
    cy.contains('Search').click();

    cy.wait(2000); // Wait for the search to complete

    cy.get('.v-tab').contains('Match history').click();
    cy.get('.match-history').should('be.visible');

    cy.get('.v-tab').contains('ELO').click();
    cy.get('.elo-view').should('be.visible');

    cy.get('.v-tab').contains('Stats').click();
    cy.get('.stats-view').should('be.visible');
  });
});
