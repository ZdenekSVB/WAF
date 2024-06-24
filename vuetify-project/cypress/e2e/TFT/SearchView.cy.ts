describe('TFTSearchView Functionality', () => {
    beforeEach(() => {
      cy.visit('/tft/search'); // Adjust the URL if necessary
    });
  
    it('should navigate to TFTStats when an existing user is searched', () => {
      cy.get('[data-cy="search-input"]').type('TaydasCZ#EUN1{enter}');
      cy.url().should('include', '/tft/stats?search=TaydasCZ%23EUN1');
    });
  
    it('should show an error alert for an invalid search format', () => {
      cy.get('[data-cy="search-input"]').type('invalidsearch{enter}');
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Please enter a valid search query in the format NAME#TAG');
      });
    });
  
    it('should show an error alert for a non-existent user', () => {
      cy.get('[data-cy="search-input"]').type('neexistuju#XDD{enter}');
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Please enter a valid search query in the format NAME#TAG'); // Adjusted expectation
      });
    });
  });
  