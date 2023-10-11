import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { getStorageData, setStorageData } from "../../../framework/src/Utilities";

// Customizable Area Start
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  currentIndex: number;
  selectedOption: null | string;
  selectedMultiChoice: string[];
  allQuestions: {
    id: string;
    type: string;
    attributes: {
      id: number;
      question: string;
      question_type: "radio" | "checkbox" | "text";
      choose_answer: number;
      employee_options: {
        id: number;
        title: string;
        employee_question_id: number;
        created_at: string;
        updated_at: string;
      }[];
    };
  }[];
  isLoading: boolean;
  empolyeeSubmissions: SubmissionItem[];
  inputValue: string;
  validInput: boolean;
  isSubmit: boolean;
  isVisible: boolean;
  lableTitle: string;
  lableDes: string;
  handlePress: Function;
  isSubmitting: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
}

export interface Item {
  id: number;
  title: string;
  employee_question_id: number;
  created_at: string;
  updated_at: string;
}

interface SubmissionItem{
  question_id: number;
  question_type: string;
  answers: any;
}

export default class EmployeeAssessmentController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiGetQuestion: string = "";
  apiEmployeeSubmissionsId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];
    // Customizable Area End

    this.state = {
      // Customizable Area Start
      allQuestions: [],
      currentIndex: 0,
      selectedOption: null,
      selectedMultiChoice: [],
      isLoading: true,
      empolyeeSubmissions: [],
      inputValue: "",
      validInput: true,
      isSubmit: false,
      isVisible: false,
      lableTitle: "",
      lableDes: "",
      handlePress: () => null,
      isSubmitting: false,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);
    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if (responseJson.errors) {
        if (typeof responseJson.errors === "string") {
          this.showAlert("Error", responseJson.errors);
        }
      } else if (apiRequestCallId != null) {
        if (apiRequestCallId === this.apiGetQuestion) {
          this.setState({ allQuestions: responseJson.data, isLoading: false });
          console.log("apiRequestCallId", responseJson.data);
        }
        if (apiRequestCallId === this.apiEmployeeSubmissionsId) {
          this.setState({
            isSubmitting: false,
            lableTitle: configJSON.lableSuccessfullyMessage,
            lableDes: configJSON.lableSubmittedSuccessfullyMessage,
            isVisible: true,
            handlePress: () => this.props.navigation.navigate('Employee'),
          });
          await setStorageData("ISASSESSMENT","true")
        }
      } else {
        this.parseApiErrorResponse(responseJson);
        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    // Customizable Area End
  }

  async componentDidMount() {
    this.getQuestion();
  }

  // Customizable Area Start
  getObjectById = (array: SubmissionItem[], idToFind: number) => {
    for (const element of array) {
      if (element.question_id === idToFind) {
        return element;
      }
    }
    return null;
  };
  handleBack = () => {
    const currentQuestion = this.state.allQuestions[this.state.currentIndex];
    const previousQuestionIndex =
      this.state.allQuestions.findIndex(
        (question) => question.id === currentQuestion.id
      ) - 1;

    if (previousQuestionIndex >= 0) {
      const previousQuestion = this.state.allQuestions[previousQuestionIndex];
      const previousSubmission = this.getObjectById(
        this.state.empolyeeSubmissions,
        previousQuestion.attributes.id
      );

      this.setState({
        currentIndex: previousQuestionIndex,
        selectedOption: previousSubmission
          ? previousSubmission.answers[0]
          : null,
        selectedMultiChoice: previousSubmission
          ? previousSubmission.answers
          : [],
        inputValue: previousSubmission ? previousSubmission.answers : "",
      });
      if (previousSubmission?.answers.length > 250) {
        this.setState({ validInput: false });
      } else {
        this.setState({ validInput: true });
      }
      this.setState({ isSubmit: false });
    } else {
      this.showAlert("Message!!", "No previous question available.");
    }
  };

  handleNext = () => {
    if (!this.validateAllTypes()) {
      return;
    }
    const { currentIndex, allQuestions, isSubmit } = this.state;
    const nextQuestionIndex = currentIndex + 1;
  
    if (nextQuestionIndex < allQuestions.length) {
      this.handleNextQuestion(nextQuestionIndex);
    } else {
      this.handleFinalSubmission(isSubmit);
    }
  };
  
  handleNextQuestion = (nextQuestionIndex:number) => {
    const { empolyeeSubmissions } = this.state;
    const nextQuestion = this.state.allQuestions[nextQuestionIndex];
    const nextSubmission = this.getObjectById(
      empolyeeSubmissions,
      nextQuestion.attributes.id
    );
  
    this.setState({
      currentIndex: nextQuestionIndex,
      selectedOption: nextSubmission ? nextSubmission.answers[0] : null,
      selectedMultiChoice: nextSubmission ? nextSubmission.answers : [],
      inputValue: nextSubmission ? nextSubmission.answers : "",
      isSubmit: false,
    });
  
    if (nextSubmission?.answers.length > 250) {
      this.setState({ validInput: false });
    } else {
      this.setState({ validInput: true });
    }
  };
  
  handleFinalSubmission = (isSubmit:boolean) => {
    if (isSubmit) {
      this.submitEmployeeSubmissions();
    } else {
      this.setState({ isSubmit: true });
      this.setState({
        lableTitle: configJSON.lableAssessmentComplete,
        lableDes: configJSON.lableAssessmentCompleteDes,
        isVisible: true,
        handlePress: () => this.setState({ isVisible: false }),
      });
    }
  };

  handleNextButton = () => {
    this.handleNext();
  };

  validateAllTypes = () => {
    const currentQuestion = this.state.allQuestions[this.state.currentIndex];

    switch (currentQuestion.attributes.question_type) {
      case "radio":
        if (!this.state.selectedOption) {
          this.setState({
            lableTitle: configJSON.lableValidation,
            lableDes: configJSON.lableValidationDes,
            isVisible: true,
            handlePress: () => this.setState({ isVisible: false }),
          });
          return false;
        }
        break;

      case "checkbox":
        if (
          currentQuestion.attributes.choose_answer !==
          this.state.selectedMultiChoice.length
        ) {
          this.setState({
            lableTitle: configJSON.lableValidation,
            lableDes: `Please select exactly ${
              currentQuestion.attributes.choose_answer
            } options before proceeding.`,
            isVisible: true,
            handlePress: () => this.setState({ isVisible: false }),
          });
          return false;
        }
        break;

      case "text":
        if (this.state.inputValue.length < 5) {
          this.setState({
            lableTitle: configJSON.lableValidation,
            lableDes: configJSON.lableCharacterValidation,
            isVisible: true,
            handlePress: () => this.setState({ isVisible: false }),
          });
          return false;
        }

        if (this.state.inputValue.length > 250) {
          this.setState({
            lableTitle: configJSON.lableValidation,
            lableDes: configJSON.lableCharacterValidation2,
            isVisible: true,
            handlePress: () => this.setState({ isVisible: false }),
          });
          return false;
        }
        break;

      default:
        break;
    }

    return true;
  };

  handleSingleChoiceSelection = (selectedValue: string) => {
    this.setState(
      (prevState) => ({
        selectedOption: selectedValue,
      }),
      () => {
        this.handleEmployeeSubmissions();
      }
    );
  };
  handleMultiChoiceSelection = (selectedValue: string) => {
    let data = this.state.allQuestions[this.state.currentIndex];
    this.handleEmployeeSubmissions();

    this.setState((prevState) => {
      const { selectedMultiChoice } = prevState;
      let updatedSelectedMultiChoice: string[] = [];

      if (selectedMultiChoice) {
        updatedSelectedMultiChoice = [...selectedMultiChoice];
      }

      if (selectedMultiChoice && selectedMultiChoice.includes(selectedValue)) {
        updatedSelectedMultiChoice = updatedSelectedMultiChoice.filter(
          (item) => item !== selectedValue
        );
      } else if (
        !selectedMultiChoice ||
        selectedMultiChoice.length < data.attributes.choose_answer
      ) {
        updatedSelectedMultiChoice = [
          ...updatedSelectedMultiChoice,
          selectedValue,
        ];
      } else {
        this.setState({
          lableTitle: configJSON.lableSelectionLimitExceeded,
          lableDes: `You can select up to ${
            data.attributes.choose_answer
          } option${data.attributes.choose_answer === 1 ? "" : "s"}.`,
          isVisible: true,
          handlePress: () => this.setState({ isVisible: false }),
        });
      }

      return {
        selectedMultiChoice: updatedSelectedMultiChoice,
      };
    }, this.handleEmployeeSubmissions);
  };

  handleEmployeeSubmissions() {
    const {
      allQuestions,
      currentIndex,
      selectedOption,
      selectedMultiChoice,
      inputValue,
    } = this.state;
    const questionData = allQuestions[currentIndex];

    const existingSubmissionIndex = this.state.empolyeeSubmissions.findIndex(
      (submission) => submission.question_id === questionData.attributes.id
    );

    let updatedSubmissions = [...this.state.empolyeeSubmissions];

    if (questionData.attributes.question_type === "radio") {
      const submission = {
        question_id: questionData.attributes.id,
        question_type: "radio",
        answers: selectedOption ? [selectedOption] : [],
      };

      if (existingSubmissionIndex !== -1) {
        updatedSubmissions[existingSubmissionIndex] = submission;
      } else {
        updatedSubmissions.push(submission);
      }
    } else if (questionData.attributes.question_type === "checkbox") {
      const submission = {
        question_id: questionData.attributes.id,
        question_type: "checkbox",
        answers: selectedMultiChoice || [],
      };

      if (existingSubmissionIndex !== -1) {
        updatedSubmissions[existingSubmissionIndex] = submission;
      } else {
        updatedSubmissions.push(submission);
      }
    } else if (questionData.attributes.question_type === "text") {
      const submission = {
        question_id: questionData.attributes.id,
        question_type: "text",
        answers: inputValue,
      };

      if (existingSubmissionIndex !== -1) {
        updatedSubmissions[existingSubmissionIndex] = submission;
      } else {
        updatedSubmissions.push(submission);
      }
    }

    this.setState({
      empolyeeSubmissions: updatedSubmissions,
    });
  }

  handleInput = (value: string) => {
    if (value.length > 250) {
      this.setState({ validInput: false });
    } else {
      this.setState({ validInput: true });
    }
    this.setState({ inputValue: value }, () => {
      this.handleEmployeeSubmissions();
    });
  };

  submitEmployeeSubmissions = async () => {
    if (!this.validateAllTypes()) {
      return;
    }

    let token = await getStorageData("EMPLOYEE_TOKEN");

    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: token,
    };

    const { empolyeeSubmissions } = this.state;

    const body = {
      empolyee_submissions: empolyeeSubmissions,
    };

    this.setState({ isSubmitting: true });

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.apiEmployeeSubmissionsId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.employeeSubmissionsEndpoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.lablePost
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getQuestion = async () => {
    let token = await getStorageData("EMPLOYEE_TOKEN");
    this.setState({ isLoading: true });
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.apiGetQuestion = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.employeeQuestionsEndpoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.lableGet
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  // Customizable Area End
}
