describe('TFT Search Functionality', () => {
    beforeEach(() => {
      cy.visit('/tft/stats');
    });
  
    it('should not show an error alert for an existing user TaydasCZ#EUN1', () => {
      cy.get('[data-cy="search-input"]').type('TaydasCZ#EUN1{enter}');
      cy.on('window:alert', (text) => {
        expect(text).to.be.undefined; // Ensure no alert is shown
      });
    });
  
    it('should show an error alert for a non-existent user neexistuju#XDD', () => {
      cy.get('[data-cy="search-input"]').type('neexistuju#XDD{enter}');
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Please enter a valid search query in the format NAME#TAG');
      });
    });
  });
  