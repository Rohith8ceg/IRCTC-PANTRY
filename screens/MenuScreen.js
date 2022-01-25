import * as React from 'react';
import { StyleSheet } from 'react-native';
import db from "../firebaseConfig";
import { Layout, Text, List, Card, Button, ButtonGroup } from '@ui-kitten/components';
import GlobalState from '../components/GlobalState';

export default function MenuScreen({navigation, route}) {

    const [param, setParam] = React.useState(route.params)
    const [items, setItems] = React.useState(new Array(0))
    const [cartlist, setCartlist] = React.useContext(GlobalState);
    // const [finalList, setFinalList] = React.useState({name: "", qty: 0, price: 0})
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
        // setItems(prevItems => [...prevItems,{orderqty: item.orderqty+1}])
        item.orderqty = item.orderqty+1;
        if(list){
            var flag=0
            for (var i=0; i<list.length; i++) {
                // console.log(list[i])
                for(var itemid in list[i]){
                    if(itemid==item.id){
                        flag=1
                        list[i][item.id]['qty']+=1
                        list[i][item.id]['price']+=item.price
                    }
                }
            }
            if(flag==0){
                list.push(
                    {
                        [item.id]:  {
                            item_name: item.name,
                            qty: item.orderqty,
                            price: item.orderqty*item.price
                        }
                    }
                )
            }
            console.log(list)               
        }
        else{
            list.push(
                {
                    [item.id]:  {
                        item_name: item.name,
                        qty: item.orderqty,
                        price: item.orderqty*item.price
                    }
                }
            )
        }
        // setFinalList(temp)
        // console.log(finalList)
    }

    const lessQty = (item) => {
        item.orderqty = item.orderqty-1;
        if(list){
            var flag=0
            for (var i=0; i<list.length; i++) {
                for(var itemid in list[i]){
                    if(itemid==item.id){
                        flag=1
                        list[i][item.id]['qty']-=1
                        list[i][item.id]['price']-=item.price
                    }
                }
            }
            console.log(list)
        }
    }

    // React.useLayoutEffect(() => {
    //   getData()
    // }, []);

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
        container: {flexGrow:1, justifyContent: 'space-evenly', alignItems:'stretch'}
    })
    
    const renderCard = (param)=>{
        console.log(param)
        return (
            <Card status={'basic'} style={styles.card} onPress={() => navigation.navigate('Menu',{navigation,...param.item})}>
                <Text category={'h6'}>{param.item.name}</Text>
                <Text>Price: {param.item.price}</Text>
                <Text>Quantity: {param.item.orderqty}</Text>
                {param.item.quantity && 
                    <ButtonGroup size={'small'}>
                        <Button onPress={() => addQty(param.item)}>+</Button>
                        <Button onPress={() => lessQty(param.item)}>-</Button>
                    </ButtonGroup>
                 } 
            </Card>
        )
    }

    const addToCart = () => {
        setCartlist(list)
        // setCartlist([...prevList, list])
        navigation.navigate('Cart')
    }

    return (
        <Layout style={styles.layout}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>
                {param && param.name}
            </Text>
            { items.length &&
            <>
                <List style={styles.list} contentContainerStyle={styles.container} data={items} renderItem={renderCard} />
                <Button onPress={addToCart}>View Cart</Button>
            </>
            }
        </Layout>
    );
}