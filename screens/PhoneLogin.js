import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import {
  Button,
  Card,
  Modal,
  Text,
  Input,
  Layout,
} from "@ui-kitten/components";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
// import * as firebase from "firebase/app";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebaseConfig";
import UserContext from "../components/UserContext";

export default function PhoneLogin() {
  const [visible, setVisible] = React.useState(false);
  const recaptchaVerifier = React.useRef(null);
  const [phone, setPhone] = React.useState("");
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [user, setUser] = React.useContext(UserContext);
  const [tempUser, setTempUser] = React.useState({
    name: null,
    phone: null,
    error: true,
  });
  // console.log(firebase)
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;
  const [message, showMessage] = React.useState(
    !firebaseConfig || Platform.OS === "wesb"
      ? {
          text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.",
          color: "basic",
        }
      : undefined
  );
  const attemptInvisibleVerification = true;

  async function check_existing_user() {
    console.log(phone);
    if (!isNaN(phone)) {
      const res = db
        .collection("users")
        .where("phone", "==", Number(phone.slice(3)))
        .get();
      await res;
      console.log("Res:\n",(await res).docs);
      if((await res))
      if ((await res).docs[0]){
        let data = (await res).docs[0].data();
        console.log(data);
        setTempUser({ name: data.name, phone: data.phone, error: false });
        return console.log("return true"), true;
        }
      setTempUser({ name: null, phone: null, error: true });
    }
    return console.log("return false"), false;
  }

  React.useEffect(() => {
    if (message) setVisible(true);
  }, [message]);

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text style={{textAlign: 'center'}} category={'h2'}  >Login to Continue</Text>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
      { !verificationId &&
      <>
        <Text style={{ marginTop: 20 }}>Enter phone number</Text>
        <Input
          style={{ marginVertical: 10, fontSize: 17 }}
          placeholder="+919090909090"
          autoFocus
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={(phone) => setPhone(phone)}
        />
        <Button
          disabled={!phone}
          onPress={async () => {
            if (check_existing_user())
              try {
                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                const verificationId = await phoneProvider.verifyPhoneNumber(
                  phone,
                  recaptchaVerifier.current
                );
                setVerificationId(verificationId);
                showMessage({
                  text: "Verification code has been sent to your phone.",
                  color: "basic",
                });
              } catch (err) {
                showMessage({ text: `Error: ${err.message}`, color: "danger" });
              }
            else
              showMessage({
                text: "Error: User does not exist",
                color: "danger",
              });
          }}
        >
          Send Verification Code
        </Button>
      </>
      }
      { verificationId &&
      <>
      <Text style={{ marginTop: 50 }} >Message sent to number {phone || "+91xxxxxxxxxx"}</Text>
      <Text >Enter Verification code</Text>
      <Input
        style={{ marginVertical: 10, fontSize: 17 }}
        disabled={!verificationId}
        placeholder="123456"
        onChangeText={setVerificationCode}
      />
      <Button
        disabled={!verificationId}
        onPress={async () => {
          try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await firebase.auth().signInWithCredential(credential);
            setUser({...tempUser});
            showMessage({ text: "Phone authentication successful 👍" });
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: "danger" });
          }
        }}
      >
        Confirm Verification Code
      </Button>
      <Button style={{marginTop: 10}} onPress={()=>setVerificationId(undefined)} >Change Number</Button>
      </>
      }
      {message && (
        <Modal
          visible={visible}
          backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onBackdropPress={() => {
            setVisible(false);
            showMessage(undefined);
          }}
        >
          <Card
            disabled={true}
            header={
              <Layout>
                <Text>{message.color === "danger" ? "Error" : "Info"}</Text>
              </Layout>
            }
            footer={
              <Layout>
                <Button
                  onPress={() => {
                    setVisible(false);
                    showMessage(undefined);
                  }}
                >
                  Close
                </Button>
              </Layout>
            }
          >
            <Text status={message.color}>{message.text}</Text>
          </Card>
        </Modal>
        // <TouchableOpacity
        //   style={[
        //     StyleSheet.absoluteFill,
        //     { backgroundColor: 0xffffffee, justifyContent: "center" },
        //   ]}
        //   onPress={() => showMessage(undefined)}
        // >
        //   <Text
        //     style={{
        //       color: message.color || "blue",
        //       fontSize: 17,
        //       textAlign: "center",
        //       margin: 20,
        //     }}
        //   >
        //     {message.text}
        //   </Text>
        // </TouchableOpacity>
      )}
      {/* {attemptInvisibleVerification && <FirebaseRecaptchaBanner />} */}
    </View>
  );
}
