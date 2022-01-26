import React from 'react'
import { Button, Card, Modal, Text, Input, Layout } from '@ui-kitten/components'
import { StyleSheet,View } from 'react-native'
import UserContext from '../components/UserContext'
import db from '../firebaseConfig'

export default function LoginScreen (props) {

  const [visible, setVisible] = React.useState(false)
  const [user, setUser] = React.useContext(UserContext)
  const [phone, setPhone] = React.useState("")

  function login() {
    console.log(Number(phone))
    if(!isNaN(phone)){
      db
      .collection("users")
      .where("phone", "==", Number(phone))
      .get()
      .then((res)=>{
        if (res) {
          setUser({ name: null, phone: null, error: true });
          let data = res.docs[0].data();
          console.log(data);
          setUser({ name: data.name, phone: data.phone, error: false });
        }
      })
    }
    else
      setUser({name: null, phone:null, error:true })
  }

  const Header = (props) => (
    <View {...props}>
      <Text category='h6'>Login</Text>
    </View>
  )

  const styles = StyleSheet.create({
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flexGrow: 1
    },
    margin: {marginBottom: 5},
    layout: { flex: 1, justifyContent: 'center', flexGrow: 1 },
    view: { flex: 1, alignItems: 'center', justifyContent: 'center', flexGrow: 1 }
  });

  return (
    <Layout style={styles.layout} level='1'>
      <View style={styles.view}>
        <Text style={styles.margin}>Login to Continue</Text>
        <Button onPress={() => setVisible(true)}>
          Login
        </Button>
      </View>
      
      <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}>
          <Card disabled={true} header={Header} >
              <Text>Enter Phone Number:</Text>
              <Input
                value={phone}
                style={styles.margin}
                onChangeText={nextPhone => setPhone(nextPhone)}
                placeholder={"Enter 10 digit number"}
                placeholderTextColor="#666"
                keyboardType="number-pad"
                maxLength={10}
              />
              <Button onPress={login} size={'small'} >
                Login
              </Button>
              { user.error &&
                <>
                  <Text status={'danger'}>Invalid phone number or Account does not exists.</Text>
                  <Text status={'danger'}> Please try again</Text>
                </>
              }
          </Card>
      </Modal>
    </Layout>
  )
}