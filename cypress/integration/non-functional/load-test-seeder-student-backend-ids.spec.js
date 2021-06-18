/// <reference types="cypress" />

context("Load Test Seeder", () => {
  beforeEach(() => {});
  it("Grab Student BackendId", () => {
    var teacherToken = Cypress.env("teacher-credentials").token;
    cy.fixture("student-data-uat-06182021").then((students) => {
      students.forEach((data, index) => {
        cy.request(
          "POST",
          `${Cypress.env("baseUrls").api}searchstudent?token=${teacherToken}`,
          {
            query: data.studentId,
            school_id: Cypress.env("school-info").schoolId,
          }
        ).then((response) => {
          cy.writeFile(
            "uat-student-studentids-backend.txt",
            `${response.body.message.list[0]._id}\r\n`,
            { flag: "a+" }
          );
        });
      });
    });
  });
});
