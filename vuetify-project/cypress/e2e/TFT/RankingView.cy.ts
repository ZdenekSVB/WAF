describe('RankingView', () => {
    beforeEach(() => {
      cy.visit('/tft/ranking');
    });
  
    it('should select Region, Tier, and Division and load data', () => {
      // Select Region
      cy.get('[data-cy=region-select]').click();
      cy.get('.v-list-item').contains('euw1').click();
  
      // Select Tier
      cy.get('[data-cy=tier-select]').click();
      cy.get('.v-list-item').contains('GOLD').click();
  
      // Select Division
      cy.get('[data-cy=division-select]').click();
      cy.get('.v-list-item').contains('II').click();
  
      // Click Load button
      cy.get('[data-cy=load-button]').click();
  
      // Check loading indicator is shown
      cy.get('[data-cy=loading-indicator]').should('be.visible');
  
      // Check data table is populated
      cy.get('[data-cy=data-table]').should('be.visible');
    });
  });
  