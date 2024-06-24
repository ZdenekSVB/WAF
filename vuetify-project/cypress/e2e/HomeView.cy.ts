/// <reference types="cypress" />

describe('HomeView Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should display all game images with correct attributes', () => {
      cy.get('.game.valorant img').should('have.attr', 'alt', 'Valorant').and('be.visible');
      cy.get('.game.counter-strike img').should('have.attr', 'alt', 'Counter-Strike 2').and('be.visible');
      cy.get('.game.tft img').should('have.attr', 'alt', 'Teamfight Tactics').and('be.visible');
      cy.get('.game.league-of-legends img').should('have.attr', 'alt', 'League of Legends').and('be.visible');
    });
  
    it('should apply hover effects on game images', () => {
      cy.get('.game.valorant').trigger('mouseover');
      cy.get('.game.valorant').should('have.css', 'transform', 'matrix(1.05, 0, 0, 1.05, 0, 0)');
      cy.get('.game.valorant').trigger('mouseout');
      cy.get('.game.valorant').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
  
      cy.get('.game.counter-strike').trigger('mouseover');
      cy.get('.game.counter-strike').should('have.css', 'transform', 'matrix(1.05, 0, 0, 1.05, 0, 0)');
      cy.get('.game.counter-strike').trigger('mouseout');
      cy.get('.game.counter-strike').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
  
      cy.get('.game.tft').trigger('mouseover');
      cy.get('.game.tft').should('have.css', 'transform', 'matrix(1.05, 0, 0, 1.05, 0, 0)');
      cy.get('.game.tft').trigger('mouseout');
      cy.get('.game.tft').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
  
      cy.get('.game.league-of-legends').trigger('mouseover');
      cy.get('.game.league-of-legends').should('have.css', 'transform', 'matrix(1.05, 0, 0, 1.05, 0, 0)');
      cy.get('.game.league-of-legends').trigger('mouseout');
      cy.get('.game.league-of-legends').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
    });

    it('should navigate to correct routes on game image click', () => {
      cy.get('.game.valorant').click();
      cy.url().should('include', '/valorant');
  
      cy.visit('/'); // return to home page
      cy.get('.game.counter-strike').click();
      cy.url().should('include', '/counter-strike');
  
      cy.visit('/');
      cy.get('.game.tft').click();
      cy.url().should('include', '/tft/search');
  
      cy.visit('/');
      cy.get('.game.league-of-legends').click();
      cy.url().should('include', '/lol/search');
    });
  });
  