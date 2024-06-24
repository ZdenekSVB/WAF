// cypress/e2e/heroStats.cy.js

describe('Hero Statistics Page', () => {
  beforeEach(() => {

    // Visit the Hero Stats page
    cy.visit('/heroes');
  });

  it('displays the Hero Statistics card', () => {
    // Check that the Hero Statistics card is visible
    cy.get('.heroes-card').should('be.visible');
  });


  it('displays the data table with headers', () => {
    // Check that the data table is visible
    cy.get('.heroes-card .v-data-table').should('be.visible');

    // Check that the table headers are displayed correctly
    const headers = [
      'Image', 'Name', 'Primary Attribute', 'Attack Type', 'Roles', 'Base Health',
      'Base Mana', 'Base Armor', 'Base Attack', 'Attack Range', 'Move Speed', 'Action'
    ];

    headers.forEach((header) => {
      cy.get('.heroes-card .v-data-table thead th').contains(header);
    });
  });

  it('displays the data table with hero rows', () => {
    // Check that there are rows in the table (based on fixture data)
    cy.get('.heroes-card .v-data-table tbody tr').should('have.length.greaterThan', 0);

    // Check a specific row content (example for the first row)
    cy.get('.heroes-card .v-data-table tbody tr').first().within(() => {
      cy.get('td').eq(1).contains('Anti-Mage'); // Assuming Anti-Mage is in the fixture data
    });
  });

});
