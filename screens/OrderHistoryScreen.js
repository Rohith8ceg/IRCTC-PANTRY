import * as React from 'react'
import { Layout, Text, Card, List, Button } from '@ui-kitten/components'
import db from "../firebaseConfig"

import LoginScreen from './LoginScreen'
import UserContext from '../components/UserContext'
import { StyleSheet, View } from 'react-native'

export default function OrderHistoryScreen({ navigation }) {
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
                // console.log(doc.data())
                let tempOrders = doc.data().order
                if(tempOrders){
                    let temp = new Array(0)
                    tempOrders.forEach((order)=>{
                        order.get().then((res)=>{
                            if(res.data().status == 3){
                                console.log(res.data())
                                console.log(res.data().datetime.toDate().toLocaleString())
                                temp.push(res.data())
                                setOrders(temp)        
                            }                
                        })
                    })
                }
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
        card:{flex:1, alignItems: 'center', flexGrow: 1 },
        layout: { flex: 1, justifyContent:'center', alignItems: 'center' },
        list: {flexGrow:0, marginTop:50, width:'80%', height:'60%'},
        container:{flexGrow:1, justifyContent: 'space-evenly', alignItems:'stretch'}
    })

    const renderCard = (param)=>{
        return (
            <Card status={'basic'} style={styles.card} >
                <Text category={'h6'}>{(param.item.datetime.toDate().toLocaleString())}</Text>
                <Text>Total: ₹{param.item.total}</Text>
            </Card>
        )
    }

    return (
        <>
        { user.phone &&
            <Layout style={styles.layout} >
                <Text
                    onPress={getData}
                    style={{ fontSize: 26, fontWeight: 'bold' }}> {user.name}'s Order History
                </Text>
                {orders.length > 0 &&
                <List style={styles.list} contentContainerStyle={styles.container} data={orders} renderItem={renderCard} />
            }
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