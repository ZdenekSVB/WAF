describe('CSView Component', () => {
    beforeEach(() => {
      // Navštívit stránku před každým testem
      cy.visit('/counter-strike');
    });
  
    it('searches for a player profile successfully', () => {
      const testNickname = 'testPlayer';
  
      // Stubování API volání
      cy.intercept('GET', `/api/getFaceitProfile/${testNickname}`, {
        statusCode: 200,
        body: {
          player_id: '123456',
          nickname: 'testPlayer',
          avatar: 'https://example.com/avatar.png',
          games: {
            cs2: {
              faceit_elo: 866
            }
          }
        }
      }).as('searchProfile');
  
      cy.intercept('GET', `/api/getFaceitStats/123456`, {
        statusCode: 200,
        body: {
          player_id: '123456',
          games: {
            cs2: {
              faceit_elo: 866
            }
          }
        }
      }).as('getStats');
  
      // Vyhledávání profilu hráče
      cy.get('[data-cy="input-search"]').type(testNickname);
      cy.get('[data-cy="btn-search"]').click();
  
      // Čekání na dokončení API volání
      cy.wait('@searchProfile').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.wait('@getStats').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
        });
      });
  
      // Ověření zobrazení profilu
      cy.get('[data-cy="profile-card"]').should('be.visible');
      cy.get('[data-cy="player-nickname"]').should('contain', testNickname);
    });
  
    it('shows loading animation during API call', () => {
      const testNickname = 'testPlayer';
  
      // Stubování API volání
      cy.intercept('GET', `/api/getFaceitProfile/${testNickname}`, {
        statusCode: 200,
        body: {}
      }).as('searchProfile');
  
      // Vyhledávání profilu hráče
      cy.get('[data-cy="input-search"]').type(testNickname);
      cy.get('[data-cy="btn-search"]').click();
  
      // Ověření zobrazení načítací animace
      cy.get('[data-cy="loading-spinner"]').should('be.visible');
      cy.wait('@searchProfile').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.get('[data-cy="loading-spinner"]').should('not.exist');
      });
    });
  
    it('shows an error message if no player is found', () => {
      const testNickname = 'nonexistentPlayer';
  
      // Stubování API volání
      cy.intercept('GET', `/api/getFaceitProfile/${testNickname}`, {
        statusCode: 404,
        body: { error: 'Player not found' }
      }).as('searchProfile');
  
      // Vyhledávání profilu hráče
      cy.get('[data-cy="input-search"]').type(testNickname);
      cy.get('[data-cy="btn-search"]').click();
  
      // Čekání na dokončení API volání
      cy.wait('@searchProfile').then((interception) => {
        expect(interception.response.statusCode).to.eq(404);
      });
  
      // Ověření zobrazení chybové zprávy
      cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Player not found. Please check the nickname and try again.');
    });
  
    it('navigates to different views (Stats, Match history, ELO)', () => {
      const testNickname = 'testPlayer';
  
      // Stubování API volání
      cy.intercept('GET', `/api/getFaceitProfile/${testNickname}`, {
        statusCode: 200,
        body: {
          player_id: '123456',
          nickname: 'testPlayer',
          avatar: 'https://example.com/avatar.png',
          games: {
            cs2: {
              faceit_elo: 866
            }
          }
        }
      }).as('searchProfile');
  
      cy.intercept('GET', `/api/getFaceitStats/123456`, {
        statusCode: 200,
        body: {
          player_id: '123456',
          games: {
            cs2: {
              faceit_elo: 866
            }
          }
        }
      }).as('getStats');
  
      // Vyhledávání profilu hráče
      cy.get('[data-cy="input-search"]').type(testNickname);
      cy.get('[data-cy="btn-search"]').click();
  
      // Čekání na dokončení API volání
      cy.wait('@searchProfile').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.wait('@getStats').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
        });
      });
  
      // Ověření přepínání mezi pohledy
      cy.get('[data-cy="tab-match-history"]').click();
      cy.get('[data-cy="match-history-view"]').should('be.visible');
  
      cy.get('[data-cy="tab-elo"]').click();
      cy.get('[data-cy="elo-view"]').should('be.visible');
  
      cy.get('[data-cy="tab-stats"]').click();
      cy.get('[data-cy="stats-view"]').should('be.visible');
    });
  });
  