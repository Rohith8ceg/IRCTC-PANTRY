import * as React from 'react'
import { Layout, Text, List, ListItem } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import db from "../firebaseConfig"
import UserContext from '../components/UserContext'
import LoginScreen from './LoginScreen'
import GlobalState from '../components/GlobalState'

export default function OrderStatusScreen({ navigation }) {
    const [orders, setOrders] = React.useState(new Array(0))
    const [user, setUser] = React.useContext(UserContext)
    const [cartlist, setCartlist] = React.useContext(GlobalState);

    const getData = () => {
        setCartlist("")
        if(!user.phone)
            return null
        setOrders([])
        console.log("getData:")
        db
        .collection("users")
        .where("phone", "==", user.phone )
        .get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                // console.log(doc.data())
                let tempOrders = doc.data().order
                tempOrders = tempOrders.reverse()
                if(tempOrders){
                    let temp = new Array(0)
                    tempOrders.forEach((order)=>{
                        order.get().then((res)=>{
                            if(res.data().status != 3){
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
    }

    React.useLayoutEffect(()=>{
        getData()
    },[user])

    React.useEffect(()=>{
        console.log(orders)
    },[orders])

    const getStatus = (status)=>{
        switch (status) {
            case 0:
                return "Accepted"
                break
            case 1:
                return "Preparing"
            case 2:
                return "Out for delivery"
            case 3:
                return "Delivered"
        }
    }

    const styles = StyleSheet.create({
        card:{flex:1, alignItems: 'center', flexGrow: 1 },
        layout: { flex: 1, justifyContent:'center', alignItems: 'center' },
        list: {flexGrow:0, marginTop:50, width:'80%', height:'60%'},
        container:{flexGrow:1, justifyContent: 'space-evenly', alignItems:'stretch'}
    })

    const renderCard = (param)=>{
        return (
            <ListItem
                title={(param.item.datetime.toDate().toLocaleString())}
                description={`Total: ₹${param.item.total}`}
                accessoryRight={(props)=>{
                    const prop = props
                    delete(prop.style.height)
                    delete(prop.style.width)
                return (
                    <Text>{getStatus(param.item.status)}</Text>
                )}}
            />
        )
    }

    return (
        <>
        { user.phone &&
            <Layout style={styles.layout} >
                <Text
                    onPress={getData}
                    style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 50 }}> {user.name}'s Order Status
                </Text>
                {orders.length > 0 &&
                <List style={{flexGrow:0, marginTop:50, width:'80%'}} contentContainerStyle={{flexGrow:1, justifyContent: 'center', alignItems:'stretch'}} data={orders} renderItem={renderCard} />
                }
            </Layout>
        }
        { !user.phone &&
            <Layout style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
                <LoginScreen />
            </Layout>
        }
        {/* <Button onPress={()=>{ navigation.navigate('Home')}}>New Booking</Button> */}
        </>
    )
}