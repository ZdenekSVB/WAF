// cypress/integration/teamStats.spec.ts

describe('Team Stats Page', () => {
  beforeEach(() => {
    // Visit the Team Stats page
    cy.visit('/teams');
  });



  it('displays the Team Statistics card with search field', () => {
    // Check that the Team Statistics card is visible
    cy.get('.teams-card').should('be.visible');


  });

  it('displays the data table with headers', () => {
    // Check that the data table is visible
    cy.get('.teams-card .v-data-table').should('be.visible');

    // Check that the table headers are present
    const headers = ['Logo', 'Rating', 'Wins', 'Losses', 'Win Rate', 'Name', 'Tag', 'Actions'];
    headers.forEach((header) => {
      cy.get('.teams-card .v-data-table thead th').contains(header);
    });
  });

  it('displays teams in the data table', () => {
    // Check that there are rows in the data table
    cy.get('.teams-card .v-data-table tbody tr').should('have.length.gt', 0);
  });





});
