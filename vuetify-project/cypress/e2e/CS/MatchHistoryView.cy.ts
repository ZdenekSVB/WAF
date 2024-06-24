describe('MatchHistoryView Component', () => {
    beforeEach(() => {
      // Navštívit stránku před každým testem
      cy.visit('/counter-strike');
    });
  
    it('displays the match history correctly', () => {
      const matchHistory = [
        {
          match_id: 'match1',
          map: 'de_dust2',
          results: 'Win',
          kills: 20,
          assists: 5,
          deaths: 10,
          rating: 1.5,
          date: '2024-06-24'
        },
        {
          match_id: 'match2',
          map: 'de_inferno',
          results: 'Loss',
          kills: 15,
          assists: 3,
          deaths: 12,
          rating: 1.2,
          date: '2024-06-23'
        }
      ];
  
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
  
      cy.intercept('GET', `/api/getFaceitMatchHistory/123456`, {
        statusCode: 200,
        body: matchHistory
      }).as('getMatchHistory');
  
      // Vyhledávání profilu hráče
      cy.get('[data-cy="input-search"]').type('testPlayer');
      cy.get('[data-cy="btn-search"]').click();
  
      // Čekání na dokončení API volání
      cy.wait('@searchProfile').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.wait('@getStats').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          cy.wait('@getMatchHistory').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
          });
        });
      });
  
      // Ověření zobrazení zápasů
      cy.get('[data-cy="match-card"]').should('have.length', 2);
  
      cy.get('[data-cy="match-card"]').first().within(() => {
        cy.get('[data-cy="map-name"]').should('contain', 'de_dust2');
        cy.get('[data-cy="match-result"]').should('contain', 'Win');
        cy.get('[data-cy="match-kad"]').should('contain', '20-5-10');
        cy.get('[data-cy="match-rating"]').should('contain', '1.5');
        cy.get('[data-cy="match-date"]').should('contain', '2024-06-24');
      });
  
      cy.get('[data-cy="match-card"]').last().within(() => {
        cy.get('[data-cy="map-name"]').should('contain', 'de_inferno');
        cy.get('[data-cy="match-result"]').should('contain', 'Loss');
        cy.get('[data-cy="match-kad"]').should('contain', '15-3-12');
        cy.get('[data-cy="match-rating"]').should('contain', '1.2');
        cy.get('[data-cy="match-date"]').should('contain', '2024-06-23');
      });
    });
  });
  