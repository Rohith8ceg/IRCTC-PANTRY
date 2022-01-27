import * as React from 'react'
import { Layout, Text, Button } from '@ui-kitten/components'
import db from "../firebaseConfig"

import LoginScreen from './LoginScreen'
import UserContext from '../components/UserContext'
import { StyleSheet, View } from 'react-native'

export default function ProfileScreen({ navigation }) {
    const [orders, setOrders] = React.useState(new Array(0))
    const [user, setUser] = React.useContext(UserContext)

    const getData = () => {
        if(!user.phone)
            return null
        setOrders([])
        console.log("getData:")
        db
        .collection("users")
        .where("phone", "==", user.phone)
        .get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                let tempOrders = doc.data().order
                setOrders(tempOrders)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    React.useLayoutEffect(()=>{
        console.log(user)
        getData()
    },[user])

    React.useEffect(()=>{
        console.log(orders)
    },[orders])

    const styles = StyleSheet.create({
        layout: { flex: 1, justifyContent:'center', alignItems: 'center' },
        list: {flexGrow:0, marginTop:50, width:'80%'},
        container: {flexGrow:1, justifyContent: 'space-between', alignItems:'center'},
        pb: {marginBottom: 20, fontSize: 32, textAlign: 'center'}
    })

    const logout = () => {
        setUser({name: null, phone: null, error: false})
        navigation.navigate('H',{screen:'Home'})
    }

    return (
        <>
        { user.phone &&
            <Layout style={styles.container} >
                <Text
                    onPress={getData}
                    style={{ fontSize: 26, fontWeight: 'bold', marginVertical:50 }}> Profile
                </Text>
                <View>
                    <Text style={styles.pb}>User Name: {user.name}</Text>
                    <Text style={styles.pb}>Phone Number: {user.phone}</Text>
                    <Text style={styles.pb}>Number of Orders: {orders.length}</Text>
                </View>
                <Button style={{marginBottom: 20}} onPress={logout} size={'small'}>Logout</Button>
            </Layout>
        }
        { !user.phone &&
            <Layout style={styles.layout}>
                <LoginScreen />
            </Layout>
        }
        </>
        )
}