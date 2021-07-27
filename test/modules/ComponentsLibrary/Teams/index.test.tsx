import React = require('react');
import Enzyme = require('enzyme');
import Chai = require('chai');
import Teams = require('../../../../modules/ComponentsLibrary/Teams/index');

describe.skip('ComponentsLibrary', () => {
  describe('Teams', () => {
    describe('<Teams />', () => {
      it('renders a "Create New Team" button', () => {
        throw new Error('Needs to be implemented');
      });

      it('shows a loader while resources are loading', () => {
        throw new Error('Needs to be implemented');
      });

      it('opens a "Create New Team" modal when the "Create New Team" button is clicked', () => {
        throw new Error('Needs to be implemented');
      });
      describe('"View Team" modal', () => {
        describe('"Team Members" table', () => {
          it('shows all team members within a team', () => {
            throw new Error('Needs to be implemented');
          });

          describe('Team member row', () => {
            describe('Role button', () => {
              it('pops up a "Role Selection" modal', () => {
                throw new Error('Needs to be implemented');
              });
              describe('"Role Selection" modal', () => {
                // ! Team roles should be different from regular roles, that way we cannot take away, for example, HR roles from an HR person unless being in the
                // ! team with a specific role gave that to them intrinstically
                // For example, you could have a Team Role called "Human Resources" which gives the member the roles of an HR person, but as soon as that was
                // removed, those permissions MUST be removed
                // You should NOT be assigning the roles of an HR person directly through the teams interface as there would be no way to revoke that again
                // when teams change, role permissions in the teams change, etc.
                // Quote from the spec:
                // "This can use a job number-based review permission system to make someone an admin on a job (perhaps the person who assigned it or other administrators)"
                it('can add or remove TEAM roles from a team member with a picker', () => {
                  throw new Error('Needs to be implemented');
                });
              });
            });
            describe('Remove member button', () => {
              it('can remove a team member from a team if viewer is a team leader OR Bryan, Jesse or HR', () => {
                throw new Error('Needs to be implemented');
              });

              it('pops up a confirmation dialogue where you must type your name to confirm team deletion (like AWS with DynamoDB tables)', () => {
                throw new Error('Needs to be implemented');
              });
            });
          });
        });
        describe('"Add Team Member" button', () => {
          it('has an "Add Team Member" button', () => {
            throw new Error('Needs to be implemented');
          });
          it('pops up an employee picker', () => {
            throw new Error('Needs to be implemented');
          });
        });
      });

      describe('"Your Team / Teams" table', () => {
        describe('Team row', () => {
          it('allows you to add members if you are a manager', () => {
            throw new Error('Needs to be implemented');
          });
          it('allows you to delete members if you are a manager', () => {
            throw new Error('Needs to be implemented');
          });
          it('allows you to view Team Details in a separate modal', () => {
            throw new Error('Needs to be implemented');
          });
          describe('Team deletion', () => {
            it('allows you to delete the team if you are Bryan, Jesse or HR', () => {
              throw new Error('Needs to be implemented');
            });
            it('pops up a confirmation dialogue where you must type your name to confirm team deletion (like AWS with DynamoDB tables)', () => {
              throw new Error('Needs to be implemented');
            });
          });
        });
        it('displays teams correctly when they exist', () => {
          throw new Error('Needs to be implemented');
        });
      });

      describe('"Create New Teams" modal', () => {
        it('has a search field to search for an existing team', () => {
          throw new Error('Needs to be implemented');
        });
        it('has a disabled button if the team has no name yet', () => {
          throw new Error('Needs to be implemented');
        });

        describe('parent team search box', () => {
          it('has a parent Team search box', () => {
            throw new Error('Needs to be implemented');
          });
          it('can be searched', () => {
            throw new Error('Needs to be implemented');
          });
          it('has the ability to select multiple teams as parents', () => {
            throw new Error('Needs to be implemented');
          });
        });
      });
    });
  });
});
