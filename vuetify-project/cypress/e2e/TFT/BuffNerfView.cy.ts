describe('SummonerView Functionality', () => {
    beforeEach(() => {
      cy.visit('/tft/buffs-nerfs'); // Adjust the URL if necessary
    });
  
    it('should fetch summoner data and display edited user info', () => {
      const name = 'TaydasCZ';
      const tag = 'EUN1';
  
      cy.get('[data-cy="input-name"]').type(name);
      cy.get('[data-cy="input-tag"]').type(tag);
      cy.get('[data-cy="fetch-button"]').click();
  
      // Simulate API response (replace with cy.intercept if needed)
      cy.wait(1000); // Adjust wait time if necessary
  
      cy.get('[data-cy="edit-button"]').should('exist');
      cy.get('[data-cy="delete-button"]').should('exist');
    });
  
    it('should show alert for empty summoner name', () => {
      cy.get('[data-cy="input-tag"]').type('EUN1');
      cy.get('[data-cy="fetch-button"]').click();
  
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Summoner Name cannot be empty');
      });
    });
  
    it('should show alert for invalid tag', () => {
      cy.get('[data-cy="input-name"]').type('TaydasCZ');
      cy.get('[data-cy="input-tag"]').type('invalidtag');
      cy.get('[data-cy="fetch-button"]').click();
  
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Invalid tag. Please enter a valid tag');
      });
    });
  
    it('should show alert for non-existent summoner', () => {
      cy.get('[data-cy="input-name"]').type('nonexistent');
      cy.get('[data-cy="input-tag"]').type('EUN1');
      cy.get('[data-cy="fetch-button"]').click();
  
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Summoner not found. Please enter a valid summoner name and tag.');
      });
    });
  
    it('should edit and delete user info', () => {
      // Add some initial data to edit
      cy.get('[data-cy="input-name"]').type('TaydasCZ');
      cy.get('[data-cy="input-tag"]').type('EUN1');
      cy.get('[data-cy="fetch-button"]').click();
  
      // Simulate API response (replace with cy.intercept if needed)
      cy.wait(1000); // Adjust wait time if necessary
  
      cy.get('[data-cy="edit-button"]').first().click();
  
      // Simulate editing dialogs (if needed)
      // cy.on('window:prompt', () => {
      //   return 'EditedName';
      // });
  
      // Perform edit actions and assert changes
      cy.get('[data-cy="edit-button"]').first().click();
      cy.get('[data-cy="delete-button"]').first().click();
  
      // Confirm deletion (if there's a confirmation dialog)
      // cy.on('window:confirm', () => true);
  
      // Assert that the deleted item is no longer present
      cy.get('[data-cy="edit-button"]').should('have.length', 0);
    });
  });
  