import * as React from 'react';
import { StyleSheet } from 'react-native';
import db from "../firebaseConfig";
import { Layout, Text, List, ListItem, Button, ButtonGroup } from '@ui-kitten/components';
import GlobalState from '../components/GlobalState';

export default function MenuScreen({navigation, route}) {

    const [param, setParam] = React.useState(route.params)
    const [items, setItems] = React.useState(new Array(0))
    const [cartlist, setCartlist] = React.useContext(GlobalState);
    var list=[]

    const getData = () => {
        console.log("getData:")
        db.doc(`category/${param.id}`).get().then((res)=>{
            let data = res.data()
            let tempItems = data.item
            if (tempItems){
                let temp = []
                tempItems.forEach(item => {
                    item.get().then((res)=>{
                        temp.push({id: item.id,...res.data(),orderqty: 0})
                        console.log("temp:\n",temp)
                        setItems(temp)
                    })
                });
            }
        });
    }

    const addQty = (item) => {
        let temp = items
        let t = temp.findIndex(x => x.id == item.id)
        temp[t].orderqty += 1
        temp[t].quantity -= 1
        setItems([...temp])
        console.debug(temp[t])
        console.log("list:\n",list)               
    }

    const lessQty = (item) => {
        let temp = items
        let t = temp.findIndex(x => x.id == item.id)
        temp[t].orderqty -= 1
        temp[t].quantity += 1
        console.debug(temp[t])
        setItems([...temp])
        console.log("list:\n",list)
    }

    React.useEffect(()=>{
        getData()
        console.log(items)
    },[items.name])
    
    React.useLayoutEffect(()=>{
        console.log("items:\n",items)
        
    },[items])

    const styles = StyleSheet.create({
        card:{flex:1, alignItems: 'center', flexGrow: 1 },
        layout:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
        list: {flexGrow:0, marginTop:50, width:'80%', minHeight:'60%'},
        container: {flexGrow:1, justifyContent: 'space-evenly', alignItems:'stretch'},
        buttonText: { paddingHorizontal: 10},
    })
    
    const renderItem = (param)=>{
        console.log(param)
        return (
            <ListItem 
                title={`${param.item.name}`}
                description={`Cost: ₹${param.item.price}`} 
                accessoryRight={(props)=>{
                    const prop = props
                    delete(prop.style.height)
                    delete(prop.style.width)
                return (
                <ButtonGroup appearance={'outline'} status={'basic'} size={'tiny'} {...prop} >
                    <Button disabled={param.item.quantity === 0} onPress={() => addQty(param.item)}>+</Button>
                    <Text style={styles.buttonText}>{param.item.orderqty}</Text>
                    <Button disabled={param.item.orderqty === 0} onPress={() => lessQty(param.item)}>-</Button>
                </ButtonGroup>
                )}
                }
            />            
        )
    }

    const addToCart = () => {
        let cart = items.filter(x => x.orderqty > 0)
        cart.forEach(item => {
            item.total = item.orderqty * item.price
        })
        console.log("cart:\n",cart)
        setCartlist([...cart])
        navigation.push('Cart')
    }

    return (
        <Layout style={styles.layout}>
            <Text onPress={getData}
                style={{ fontSize: 26, fontWeight: 'bold' }}>
                {param && param.name}
            </Text>
            { items.length> 0 &&
            <>
                <List style={styles.list} contentContainerStyle={styles.container} data={items} renderItem={renderItem} />
                <Button onPress={addToCart}>View Cart</Button>
            </>
            }
        </Layout>
    );
}