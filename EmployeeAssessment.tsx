import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
// Customizable Area End

import EmployeeAssessmentController, {
  configJSON,
  Item,
} from "./EmployeeAssessmentController";
import { COLORS } from "../../../framework/src/Globals";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Entypo from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";
import Scale from "../../../components/src/Scale";

export default class EmployeeAssessment extends EmployeeAssessmentController {
  // Customizable Area Start
  appHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{configJSON.lableAssessment}</Text>
    </View>
  );

  singleChoiceItem = (question: Item) => {
    const selectedOption = this.state.selectedOption;
    return (
      <TouchableOpacity
        testID="handleSingleChoiceSelection"
        onPress={() => {
          this.handleSingleChoiceSelection(question.title);
        }}
        style={styles.itemContainer}
        key={question.id}
      >
        <View style={styles.radio}>
          {selectedOption === question.title && (
            <View style={styles.radioInner} />
          )}
        </View>
        <Text style={styles.itemText}>{question.title}</Text>
      </TouchableOpacity>
    );
  };

  singleChoiceComponent = (item: Item[]) =>
    item.map((question) => this.singleChoiceItem(question));

  multiChoiceItem = (question: Item) => {
    const { selectedMultiChoice } = this.state;
    return (
      <TouchableOpacity
        testID="handleMultiChoiceSelection"
        onPress={() => this.handleMultiChoiceSelection(question.title)}
        style={styles.itemContainer}
        key={question.id}
      >
        <View style={styles.selection}>
          {selectedMultiChoice.includes(question.title) && (
            <Entypo name="check" color={COLORS.white} />
          )}
        </View>
        <Text style={styles.itemText}>{question.title}</Text>
      </TouchableOpacity>
    );
  };

  multiChoiceComponent = (item: Item[]) =>
    item.map((question) => this.multiChoiceItem(question));

  inputComponent = () => (
    <>
      <LinearGradient
        start={{ x: 0.2, y: 0.0 }}
        end={{ x: 1.5, y: 0.5 }}
        locations={[0, 0.5]}
        colors={["#f98a10", "#ff15c8"]}
        style={styles.inputMainContainer}
      >
        <View style={styles.inputContainer}>
          <TextInput
            testID="inputText"
            multiline
            style={styles.input}
            value={this.state.inputValue}
            placeholderTextColor="#313131"
            placeholder={configJSON.lablePlaceholder}
            onChangeText={(value) => this.handleInput(value)}
          />
        </View>
      </LinearGradient>
      {!this.state.validInput && (
        <Text style={styles.errorText}>{configJSON.lableInputError}</Text>
      )}
    </>
  );
  // Customizable Area End

  render() {
    let data = this.state.allQuestions[this.state.currentIndex];
    let currentPageCount = this.state.currentIndex + 1;
    let hideBack = currentPageCount !== 1;
    let hideNext = currentPageCount !== this.state.allQuestions.length;
    return (
      //Merge Engine DefaultContainer
      <>
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableWithoutFeedback
            testID="btnHideKeyboard"
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            <>
              {this.appHeader()}
              <View style={styles.handleContainer}>
                <View style={styles.handler}>
                  <View style={styles.handleSeparator}>
                    {hideBack && (
                      <TouchableOpacity
                        testID="handleBack"
                        onPress={() => this.handleBack()}
                      >
                        <Entypo
                          testID="chevronLeft"
                          name="chevron-left"
                          color={COLORS.white}
                          size={responsiveFontSize(3)}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={[styles.handleSeparator, { flex: 2 }]}>
                    <Text style={styles.handleText}>{`${
                      this.state.allQuestions.length === 0
                        ? 0
                        : currentPageCount
                    }/${this.state.allQuestions.length}`}</Text>
                  </View>
                  <View style={styles.handleSeparator}>
                    {!this.state.isLoading
                      ? hideNext && (
                          <TouchableOpacity testID="handleNext" onPress={() => this.handleNext()}>
                            <Entypo
                              name="chevron-right"
                              color={COLORS.white}
                              size={responsiveFontSize(3)}
                            />
                          </TouchableOpacity>
                        )
                      : null}
                  </View>
                </View>
              </View>
              {this.state.isLoading ? (
                <View style={styles.activityIndicator}>
                  <ActivityIndicator size="large" color="#ff15c8" />
                </View>
              ) : (
                <View style={styles.selectContainer}>
                  <Text style={styles.textQues}>
                    {this.state.currentIndex +
                      1 +
                      "- " +
                      data.attributes.question}
                  </Text>
                  <Text style={styles.textChoice}>
                    {data.attributes.question_type !== "text"
                      ? `(Choice ${data.attributes.choose_answer} answer)`
                      : `(${this.state.inputValue.length}/250 character)`}
                  </Text>
                  {data.attributes.question_type !== "radio"
                    ? this.multiChoiceComponent(
                        data.attributes.employee_options
                      )
                    : this.singleChoiceComponent(
                        data.attributes.employee_options
                      )}
                  {data.attributes.question_type === "text" &&
                    this.inputComponent()}
                </View>
              )}
              <View style={styles.btnSpace} />
            </>
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
        <View style={styles.btnContainer}>
          {!this.state.isLoading && (
            <TouchableOpacity
              testID="handleNextButton"
              onPress={() => this.handleNextButton()}
            >
              <LinearGradient
                start={{ x: 0.25, y: 0.0 }}
                end={{ x: 1.5, y: 0.5 }}
                locations={[0, 0.5]}
                colors={["#f98a10", "#ff15c8"]}
                style={styles.buttonsViewYes}
              >
                {this.state.isSubmitting ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text testID="lableNext" style={styles.buttonTextYes}>
                    {this.state.isSubmit
                      ? configJSON.lableSubmit
                      : configJSON.lableNext}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
        <Modal animationType="fade" transparent visible={this.state.isVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Text style={styles.titleText}>{this.state.lableTitle}</Text>
              <Text style={styles.desText}>{this.state.lableDes}</Text>
              <TouchableOpacity
                testID="clickOkay"
                style={styles.center}
                onPress={() => this.state.handlePress()}
              >
                <LinearGradient
                  start={{ x: 0.25, y: 0.0 }}
                  end={{ x: 1.5, y: 0.5 }}
                  locations={[0, 0.5]}
                  colors={["#f98a10", "#ff15c8"]}
                  style={[
                    styles.buttonsViewYes,
                    { height: responsiveWidth(10), width: responsiveWidth(30) },
                  ]}
                >
                  <Text style={styles.buttonTextYes}>
                    {configJSON.lableOkay}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    width: "100%",
    height: responsiveHeight(12),
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: COLORS.white,
    fontFamily: "Jost-Bold",
    fontSize: responsiveFontSize(2.8),
  },
  handleContainer: {
    width: "100%",
    height: responsiveHeight(5),
    alignItems: "center",
    justifyContent: "center",
  },
  handler: {
    height: "100%",
    width: "40%",
    backgroundColor: "#313131",
    paddingHorizontal: responsiveWidth(1.5),
    borderRadius: responsiveWidth(5),
    flexDirection: "row",
  },
  handleText: {
    color: COLORS.white,
    fontFamily: "Jost-Bold",
  },
  handleSeparator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    height: responsiveHeight(40),
    alignItems: "center",
    justifyContent: "center",
  },
  selectContainer: {
    width: "100%",
    padding: responsiveWidth(5),
  },
  textQues: {
    fontFamily: "Jost-Regular",
    fontSize: responsiveFontSize(2.2),
    color: COLORS.white,
  },
  textChoice: {
    fontFamily: "Jost-Regular",
    color: COLORS.white,
    marginTop: 5,
  },
  itemContainer: {
    width: "100%",
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(4),
    backgroundColor: "#313131",
    marginTop: responsiveWidth(3),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  itemText: {
    color: COLORS.white,
    fontFamily: "Jost-Regular",
    marginLeft: 8,
  },
  radio: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: responsiveWidth(3),
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: responsiveWidth(2),
    height: responsiveWidth(2),
    borderRadius: responsiveWidth(1),
    backgroundColor: COLORS.white,
  },
  selection: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderWidth: 1,
    borderColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionInner: {
    width: responsiveWidth(2),
    height: responsiveWidth(2),
    borderRadius: responsiveWidth(1),
    backgroundColor: COLORS.white,
  },
  buttonsViewYes: {
    height: Scale(50),
    backgroundColor: "#FF5A57",
    marginHorizontal: Scale(20),
    borderRadius: Scale(10),
    marginBottom: Scale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextYes: {
    color: "white",
    fontSize: 20,
    fontFamily: "Jost-Regular",
  },
  btnContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingVertical: responsiveWidth(5),
  },
  btnSpace: {
    height: responsiveHeight(10),
  },
  inputMainContainer: {
    padding: 1,
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
  },
  inputContainer: {
    minHeight: responsiveHeight(20),
    backgroundColor: COLORS.black,
    borderRadius: responsiveWidth(2),
  },
  input: {
    paddingHorizontal: responsiveWidth(3),
    fontFamily: "Jost-bold",
    color: COLORS.white,
  },
  errorText: {
    color: COLORS.red,
    marginTop: responsiveHeight(1),
    fontFamily: "Jost-regular",
  },
  center: {
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000090",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
  },
  innerContainer: {
    width: "100%",
    backgroundColor: "#313131",
    padding: responsiveWidth(3),
    borderRadius: responsiveWidth(5),
  },
  titleText: {
    textAlign: "center",
    fontFamily: "Jost-bold",
    paddingVertical: responsiveHeight(2),
    color: COLORS.white,
    fontSize: responsiveFontSize(3),
  },
  desText: {
    textAlign: "center",
    fontFamily: "Jost-regular",
    paddingBottom: responsiveHeight(2),
    color: COLORS.white,
  },
});
// Customizable Area End
