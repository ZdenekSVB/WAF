describe('EloView Component', () => {
    beforeEach(() => {
      // Navštívit stránku před každým testem
      cy.visit('/counter-strike');
    });
  
    it('displays the correct ELO and level', () => {
      const profile = {
        player_id: '123456',
        nickname: 'testPlayer',
        avatar: 'https://example.com/avatar.png',
        games: {
          cs2: {
            faceit_elo: 866
          }
        }
      };
  
      // Stubování API volání
      cy.intercept('GET', `/api/getFaceitProfile/testPlayer`, {
        statusCode: 200,
        body: profile
      }).as('searchProfile');
  
      cy.intercept('GET', `/api/getFaceitStats/123456`, {
        statusCode: 200,
        body: profile
      }).as('getStats');
  
      // Vyhledávání profilu hráče
      cy.get('[data-cy="input-search"]').type('testPlayer');
      cy.get('[data-cy="btn-search"]').click();
  
      // Čekání na dokončení API volání
      cy.wait('@searchProfile').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.wait('@getStats').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
        });
      });
  
      // Ověření zobrazení ELO a úrovně
      cy.get('[data-cy="elo-view"]').should('be.visible');
      cy.get('[data-cy="elo-header"]').should('contain', "testPlayer's Elo is 866 - LVL 3");
      cy.get('[data-cy="elo-bar-fill"]').should('have.css', 'width', '53.2%'); // Adjust this based on actual calculation
    });
  });
  