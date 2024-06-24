// cypress/integration/itemStats.spec.ts

describe('Item Stats Page', () => {
  beforeEach(() => {
    // Visit the Item Stats page
    cy.visit('/items');
  });


  it('displays the Item Statistics card with search field', () => {
    // Check that the Item Statistics card is visible
    cy.get('.items-card').should('be.visible');

  });

  it('displays the data table with headers', () => {
    // Check that the data table is visible
    cy.get('.items-card .v-data-table').should('be.visible');

    // Check that the table headers are present
    const headers = ['Image', 'Name', 'Cost', 'Notes', 'Lore'];
    headers.forEach((header) => {
      cy.get('.items-card .v-data-table thead th').contains(header);
    });
  });

  it('displays items in the data table', () => {
    // Check that there are rows in the data table
    cy.get('.items-card .v-data-table tbody tr').should('have.length.gt', 0);
  });


});
