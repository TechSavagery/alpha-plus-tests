/// <reference types="cypress" />
context("Load Test Seeder", () => {
  beforeEach(() => {
  });
  it("Create Student + Generate Token", () => {
    cy.fixture("student-data").then((students) => {
      students.forEach((data, index) => {
        cy.log(index + 1 + " of " + data.length + "\n");
        cy.window().then((win) => {
          win.sessionStorage.clear();
        });
        cy.clearCookies();
        cy.visit(Cypress.env("baseUrls").teacherPortal);
        cy.get('[name="email"]')
          .clear()
          .type(Cypress.env("teacher-credentials").email);
        cy.get('[name="password"]')
          .clear()
          .type(Cypress.env("teacher-credentials").password);
        cy.get("#submit").click();
        //loginSameAccLogin
        cy.wait(1000);
        cy.get("#managementTab").click();
        cy.xpath('//*[@id="classroomTable"]/tbody/tr[1]/td[3]/a').click();
        cy.get("#studentList").click({
          force: true,
        });
        cy.wait(3000)
        cy.get("#addStudentButton",{
          timeout: 60000
        }).click()
        cy.contains("Create Student").click();
        cy.get('[name="fname"]').clear().type(data.first_name);
        cy.get('[name="lname"]').clear().type(data.last_name);
        cy.get('[name="studentid"]').clear().type(data.student_id);
        cy.contains("Create").click();
        cy.get('.ok_btn').click()
        cy.get('#logoutTitle').click()

        cy.wait(4000);
        cy.intercept("/studentlogin*").as("login");
        cy.visit(Cypress.env("baseUrls").studentPortal);
        cy.get('[name="firstname"]').clear().type(data.first_name);
        cy.get('[name="lastname"]').clear().type(data.last_name);
        cy.get('[name="studentid"]').clear().type(data.student_id);
        cy.get("#submit").click();
        cy.wait("@login", {
          timeout: 15000,
        }).then((interception) => {
          cy.log(interception.response.body.message.token);
          cy.writeFile('uat-student-tokens.txt', `${interception.response.body.message.token}\r\n`, { flag: 'a+' })
          cy.writeFile('uat-student-studentids.txt', `${interception.response.body.message.student.student_id}\r\n`, { flag: 'a+' })
        });
        cy.wait(1500)
      });
    });
  });
});
