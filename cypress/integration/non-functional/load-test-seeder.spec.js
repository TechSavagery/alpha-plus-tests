/// <reference types="cypress" />

context("Load Test Seeder", () => {
  beforeEach(() => {});
  it("Create Student + Generate Token", () => {
    cy.fixture("student-data").then((students) => {
      students.forEach((data, index) => {
        cy.wait(500);
        cy.log(index + 1 + " of " + test.length + "\n");
        cy.request({
          method: "POST",
          url: Cypress.env("baseUrls").api + "addstudentmanual?token=$2b$10$F.Q5DDQOQqDhT5l2Q3j3rOxd1c1gSbq5dFQNspb2n.OrH357h8vZC",
          body: {
            students: [
              {
                studentIdImport: data.student_id,
                firstName: data.first_name,
                lastName: data.last_name,
              },
            ],
            schoolId: Cypress.env("school-info").schoolId,
            school: {
              district: {
                district_name: Cypress.env("school-info").districtName,
              },
            },
            type: 0,
            classId: Cypress.env("school-info").schoolId,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.intercept('/studentlogin*').as('login');
          cy.visit(Cypress.env("baseUrls").studentPortal);
          cy.get('[name="firstname"]').clear().type(data.first_name);
          cy.get('[name="lastname"]').clear().type(data.last_name);
          cy.get('[name="studentid"]').clear().type(data.student_id);
          cy.get("#submit").click();
          cy.wait('@login').then((interception) =>{
              cy.log(interception.response.body.message.token)
              cy.writeFile('tokens.txt', interception.response.body.message.token)
          })         
        });
      });
    });
  });
});
