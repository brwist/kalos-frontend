import React = require('react');
import Enzyme = require('enzyme');
import Chai = require('chai');
import TeamsModule = require('../../../../modules/ComponentsLibrary/Teams/index');
import TeamClient = require('../../../@kalos-core/kalos-rpc/Team/index');
import Loader = require('../../../../modules/Loader/main');
import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner

// TODO I need to do this during every try-catch:
/* 

I was thinking about writing future modules and things that we could possibly do better with it, and I thought of a pretty interesting idea. 
What do you think of having an extra column on the ActivityLogs, just a boolean called is_error or something, and whenever a new crash happens
and it’s caught it writes an activity log entry with that flag set and the exact error description and as much info as possible about it? Then 
we could have a view called maybe LoggedErrors or something to display any issues that happened, giving us more info when someone has an issue 
in #webtech? 

*/

describe('ComponentsLibrary', () => {
  let wrapper: Enzyme.ReactWrapper;
  before(() => {
    wrapper = Enzyme.mount(<TeamsModule.Teams />);
    let teamList = new TeamClient.TeamList();
    let team = new TeamClient.Team();
    team.setColor('#FF0000');
    team.setId(1);
    team.setName('name');
    teamList.setResultsList([team]);
    Stubs.setupStubs('TeamClientService', 'BatchGet', teamList);
  });
  describe('Teams', () => {
    describe('<Teams />', () => {
      it('renders a "Create New Team" button', () => {
        Chai.expect(wrapper.find({ label: 'Create New Team' })).to.be.lengthOf(
          1,
        );
      });

      it('shows a loader while resources are loading', () => {
        Chai.expect(wrapper.contains(<Loader.Loader />)).to.be.equal(true);
      });

      it('opens a "Create New Team" modal when the "Create New Team" button is clicked', async () => {
        await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
        wrapper.update();
        wrapper.find({ label: 'Create New Team' }).simulate('click');
        Chai.expect(wrapper.find({ title: 'New Team' })).to.be.lengthOf(2);
      });
      describe.skip('"View Team" component', () => {
        describe('"Add Team Member" button', () => {
          it('has an "Add Team Member" button', () => {
            throw new Error('Needs to be implemented');
          });
          it('pops up an employee picker', () => {
            throw new Error('Needs to be implemented');
          });
        });
        describe.skip('"Team Members" tab', () => {
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
                  it('has an Admin role that always exists', () => {
                    // ! Admin should always have the maximum permissions within the team (but should NOT exceed that)
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
        });
        describe.skip('"Team Member Recent Activity" tab', () => {
          // ? The picture logs currently do not fetch and show the pictures that are associated with them
          // FIXME reminding myself for later
          it('displays the activity logs (the new ProjectDetail-type ones with picture data available) for the team members, preferably in real time', () => {
            throw new Error('Needs to be implemented');
          });

          it('is able to filter by type of log', () => {
            throw new Error('Needs to be implemented');
          });
        });

        describe.skip('"Team Member Spiffs" tab', () => {
          it('shows the spiffs that the team members have done', () => {
            throw new Error('Needs to be implemented');
          });
          // ? Allows members to be assigned to teams temporarily, prevents logs showing up from what they did before they joined the relevant team
          it('only shows the spiffs done since the member joined the team', () => {
            throw new Error('Needs to be implemented');
          });
        });

        describe.skip('"Team Member Pay" tab', () => {
          it('only shows for the Payroll role', () => {
            throw new Error('Needs to be implemented');
          });

          // ? A little confused on this one, the spec said:
          // ? "Should be developed to give the appropriate administrators, managers, and coordinators the permission to approve and review employee activity, spiffs, pay, etc."
          // ? Will have to ask Bryan about this one
          // REVIEW
          it('shows team member pay-relevant information for the team they are in', () => {
            throw new Error('Needs to be implemented');
          });
        });

        describe.skip('"Team Kanban" tab', () => {
          it('displays the Kanban component with the relevant team information', () => {
            throw new Error('Needs to be implemented');
          });
        });

        describe.skip('"Team Tasks" tab', () => {
          it('displays relevant tasks to the team', () => {
            throw new Error('Needs to be implemented');
          });

          describe('"Team Task" row', () => {
            it('has a button to reassign members', () => {
              throw new Error('Needs to be implemented');
            });

            it('has an "Assign to Different Team" button for Managers', () => {
              throw new Error('Needs to be implemented');
            });
          });
        });
        describe.skip('"Team Jobs" tab', () => {
          it('shows all jobs relevant to the applicable team', () => {
            throw new Error('Needs to be implemented');
          });

          describe('"View Job" button', () => {
            it('pops up a "Team Job" modal with the relevant job info', () => {
              throw new Error('Needs to be implemented');
            });

            describe('"Team Job" modal', () => {
              // ? Part of the spec, I'ma add a Review anchor so I can remember to clarify this with Bryan
              // REVIEW
              it('has a button to add members as Admin for this job', () => {
                throw new Error('Needs to be implemented');
              });
            });
          });

          describe('"Add Job" button', () => {
            it('opens an "Add Job" modal when clicked', () => {
              throw new Error('Needs to be implemented');
            });
            describe('"Add Job" modal', () => {
              it('has a search bar to search for existing job numbers', () => {
                throw new Error('Needs to be implemented');
              });
              it('has a "Create New Job" button which opens a "Create New Job" modal', () => {
                throw new Error('Needs to be implemented');
              });
              describe('"Create New Job" modal', () => {
                it('can create a new job', () => {
                  throw new Error('Needs to be implemented');
                });
              });
            });
          });
        });
      });

      describe.skip('"Your Team / Teams" table', () => {
        describe('Team row', () => {
          it('allows you to add members if you are a manager', () => {
            throw new Error('Needs to be implemented');
          });
          it('allows you to delete members if you are a manager', () => {
            throw new Error('Needs to be implemented');
          });
          it('allows you to view Team Details in a "View Team" modal', () => {
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

      describe.skip('"Create New Teams" modal', () => {
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
