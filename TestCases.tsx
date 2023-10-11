import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import EmployeeAssessment from "../../src/EmployeeAssessment";
import { COLORS } from "../../../../framework/src/Globals";

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    replace: jest.fn(),
  },
  id: "EmployeeAssessment",
};

let Questions = {
  data: [
    {
      id: "17",
      type: "employee_question",
      attributes: {
        id: 17,
        question:
          "Which of the following dog services are you qualified to provide?",
        question_type: "checkbox",
        choose_answer: 2,
        employee_options: [
          {
            id: 67,
            title: "Dog Walking",
            employee_question_id: 17,
            created_at: "2023-10-09T13:52:47.487Z",
            updated_at: "2023-10-09T13:52:47.487Z",
          },
          {
            id: 68,
            title: "Dog Grooming",
            employee_question_id: 17,
            created_at: "2023-10-09T13:52:47.490Z",
            updated_at: "2023-10-09T13:52:47.490Z",
          },
          {
            id: 69,
            title: "Dog Training",
            employee_question_id: 17,
            created_at: "2023-10-09T13:52:47.492Z",
            updated_at: "2023-10-09T13:52:47.492Z",
          },
        ],
      },
    },
    {
      id: "18",
      type: "employee_question",
      attributes: {
        id: 18,
        question:
          "How many years of experience do you have in the dog service industry?",
        question_type: "radio",
        choose_answer: 1,
        employee_options: [
          {
            id: 73,
            title: "Less than 1 year",
            employee_question_id: 18,
            created_at: "2023-10-09T13:53:36.915Z",
            updated_at: "2023-10-09T13:53:36.915Z",
          },
          {
            id: 74,
            title: "1-3 years",
            employee_question_id: 18,
            created_at: "2023-10-09T13:53:36.918Z",
            updated_at: "2023-10-09T13:53:36.918Z",
          },
        ],
      },
    },
    {
      id: "22",
      type: "employee_question",
      attributes: {
        id: 22,
        question:
          "Which types of dog equipment are you proficient in using? Select all that apply.",
        question_type: "text",
        choose_answer: null,
        employee_options: [],
      },
    },
  ],
};

const feature = loadFeature(
  "./__tests__/features/EmployeeAssessment-scenario.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "");
  });

  test("User Navigates to Employee Assessment", ({ given, when, then }) => {
    let EmployeeAssessmentBlock: ShallowWrapper;
    let instance: EmployeeAssessment;

    given("I am a user loading Employee Assessment", () => {
      EmployeeAssessmentBlock = shallow(
        <EmployeeAssessment {...screenProps} />
      );
    });
    when("I navigate to the Employee Assessment", () => {
      instance = EmployeeAssessmentBlock.instance() as EmployeeAssessment;
    });
    then("I can call the get question API without encountering errors", () => {
      const msg = new Message(getName(MessageEnum.RestAPIResponceMessage));

      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );

      msg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        Questions
      );
      instance.apiGetQuestion = msg.messageId;

      runEngine.sendMessage("From unit test", msg);
    });
    when("I can select the checkbox option", () => {
      let optionItem = shallow(
        instance.multiChoiceItem(
          Questions.data[0].attributes.employee_options[0]
        )
      );
      let optionItem1 = shallow(
        instance.multiChoiceItem(
          Questions.data[0].attributes.employee_options[1]
        )
      );
      let optionItem2 = shallow(
        instance.multiChoiceItem(
          Questions.data[0].attributes.employee_options[2]
        )
      );
      const handleMultiChoiceSelection = optionItem.findWhere(
        (node) => node.prop("testID") === "handleMultiChoiceSelection"
      );
      const handleMultiChoiceSelection1 = optionItem1.findWhere(
        (node) => node.prop("testID") === "handleMultiChoiceSelection"
      );
      const handleMultiChoiceSelection2 = optionItem2.findWhere(
        (node) => node.prop("testID") === "handleMultiChoiceSelection"
      );
      const handleNextButton = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "handleNextButton"
      );
      const clickOkay = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "clickOkay"
      );
      handleMultiChoiceSelection.simulate("click");
      handleNextButton.simulate("press");
      clickOkay.simulate("press");
      handleMultiChoiceSelection.simulate("click");
      handleMultiChoiceSelection.simulate("click");
      handleMultiChoiceSelection1.simulate("click");
      handleMultiChoiceSelection2.simulate("click");
      clickOkay.simulate("press");
    });
    then("I can press the next button without encountering errors", () => {
      const handleNextButton = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "handleNextButton"
      );
      handleNextButton.simulate("press");
      const chevronLeft = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "chevronLeft"
      );
      expect(chevronLeft.prop("color")).toBe(COLORS.white);
    });
    when("I can select the radio option", () => {
      // pressing next button without selecting the any selection
      const handleNextButton = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "handleNextButton"
      );
      handleNextButton.simulate("press");

      // closing validation modal
      const clickOkay = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "clickOkay"
      );
      clickOkay.simulate("press");

      // now selecting the selections
      let optionItem = shallow(
        instance.singleChoiceItem(
          Questions.data[1].attributes.employee_options[0]
        )
      );
      const handleSingleChoiceSelection = optionItem.findWhere(
        (node) => node.prop("testID") === "handleSingleChoiceSelection"
      );
      handleSingleChoiceSelection.simulate("click");

      // pressing next button by selecting the selection
      handleNextButton.simulate("press");
    });
    then("I can select the text option", () => {
      let text =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus sss";

      const inputText = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "inputText"
      );
      inputText.simulate("changeText", text);

      const clickOkay = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "clickOkay"
      );

      // clicking error without valid input
      const handleNextButton = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "handleNextButton"
      );
      handleNextButton.simulate("press");
      clickOkay.simulate("press");

      // clicking error without valid input 2
      text = "chr";
      inputText.simulate("changeText", text);

      handleNextButton.simulate("press");
      clickOkay.simulate("press");

      // no valid input performing operation
      text = "Its a valid text";
      inputText.simulate("changeText", text);
      handleNextButton.simulate("press");
      clickOkay.simulate("press");
      expect(inputText.prop("value")).toBe("");
    });
    when(
      "I can see the previously selected item by clicking on the back button",
      () => {
        const handleBack = EmployeeAssessmentBlock.findWhere(
          (node) => node.prop("testID") === "handleBack"
        );
        // goBack accoding to previous question by handling back data
        handleBack.simulate("press");
        handleBack.simulate("press");
        handleBack.simulate("press");
      }
    );
    then("I can proceed to submit the answers", () => {
      const handleNext = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "handleNext"
      );
      const clickOkay = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "clickOkay"
      );
      const lableNext = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "lableNext"
      );
      handleNext.simulate("press");
      handleNext.simulate("press");
      handleNext.simulate("press");
      clickOkay.simulate("press");
      expect(lableNext.prop("children")).toBe("Next");
    });
    when(
      "I can ensure error-free submission of the answers by simply clicking the submit button",
      () => {
        const submitButton = EmployeeAssessmentBlock.findWhere(
          (node) => node.prop("testID") === "handleNextButton"
        );
        submitButton.simulate("press");
      }
    );
    then("I can call the submit API without encountering errors", () => {
      const clickOkay = EmployeeAssessmentBlock.findWhere(
        (node) => node.prop("testID") === "clickOkay"
      );

      const msg = new Message(getName(MessageEnum.RestAPIResponceMessage));

      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );

      msg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        message: "successfully submitted!!",
      });
      instance.apiEmployeeSubmissionsId = msg.messageId;

      runEngine.sendMessage("From unit test", msg);

      clickOkay.simulate("press");
      expect(screenProps.navigation.navigate).toBeCalledWith("Employee");
    });
  });
});