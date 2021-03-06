/// <reference types="cypress" />

context("Load Test Seeder", () => {
  beforeEach(() => {});
  it("Create Student + Generate Token", () => {
    var teacherToken = Cypress.env("teacher-credentials").token;
    cy.fixture("example").then((students) => {
      students.forEach((data, index) => {
        cy.wait(500);
        cy.log(index + 1 + " of " + data.length + "\n");
        cy.request({
          method: "POST",
          url:
            Cypress.env("baseUrls").api +
            "addstudentmanual?token=" +
            teacherToken,
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
          cy.intercept("/studentlogin*").as("login");
          cy.visit(Cypress.env("baseUrls").studentPortal);
          cy.get('[name="firstname"]').clear().type(data.first_name);
          cy.get('[name="lastname"]').clear().type(data.last_name);
          cy.get('[name="studentid"]').clear().type(data.student_id);
          cy.get("#submit").click();
          cy.wait("@login").then((interception) => {
            cy.writeFile(
              "uat-student-tokens.txt",
              `${interception.response.body.message.token}\r\n`,
              { flag: "a+" }
            );
            cy.writeFile(
              "uat-student-studentids.txt",
              `${interception.response.body.message.student.student_id}\r\n`,
              { flag: "a+" }
            );
            cy.writeFile(
              "uat-student-studentids-backend.txt",
              `${interception.response.body.message.student._id}\r\n`,
              { flag: "a+" }
            );
          });
        });
      });
    });
  });
});
