import React from 'react';
import { connect } from 'react-redux'
import {Dimensions,DeviceEventEmitter,InteractionManager,ListView,StyleSheet,View,RefreshControl,Text,ScrollView,Image,Platform,StatusBar} from 'react-native';
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';
import store from 'react-native-simple-store';
import UColor from '../../utils/Colors'
import Button from  '../../components/Button'
import ScreenUtil from '../../utils/ScreenUtil'
import Icon from 'react-native-vector-icons/Ionicons'
import UImage from '../../utils/Img'
import { SegmentedControls } from 'react-native-radio-buttons'
import Echarts from 'native-echarts'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
import {formatterNumber,formatterUnit} from '../../utils/FormatUtil'
import { EasyToast } from '../../components/Toast';
import BaseComponent from "../../components/BaseComponent";

const type = 1;

@connect(({coinLine,sticker}) => ({...coinLine,...sticker}))
class CoinDetail extends BaseComponent {

  static navigationOptions = ({ navigation }) => {
    
    const params = navigation.state.params || {};

    return {
      headerTitle:"币详情",
      headerRight: (
        <Button onPress={params.onPress}>
          <View style={{padding: ScreenUtil.autowidth(15)}}>
            <Image source={params.img} style={{width: ScreenUtil.autowidth(22),height: ScreenUtil.autowidth(22)}}></Image>
          </View>
        </Button>
      ),
    };
  };

  componentWillMount() {

    super.componentWillMount();

    const c = this.props.navigation.state.params.coins;
    this.props.dispatch({type: 'coinLine/clear',payload:{id:c.id}});

    if(this.props.coinSelf && this.props.coinSelf[c.name.toLowerCase()]==1){
      this.props.navigation.setParams({img:UImage.fav_h,onPress:this.onPress});
    }else{
      this.props.navigation.setParams({img:UImage.fav,onPress:this.onPress});
    }
  }

  onPress = () =>{
    const c = this.props.navigation.state.params.coins;
    if(this.props.coinSelf && this.props.coinSelf[c.name.toLowerCase()]==1){
      this.props.dispatch({type:'sticker/doCoinSelf',payload:{action:"rem",name:c.name.toLowerCase()},callback:function(){
        DeviceEventEmitter.emit('coinSlefChange',"");
      }});
      this.props.navigation.setParams({img:UImage.fav,onPress:this.onPress});
      EasyToast.show("已取消自选")
    }else{
      this.props.dispatch({type:'sticker/doCoinSelf',payload:{action:"add",name:c.name.toLowerCase()},callback:function(){
        DeviceEventEmitter.emit('coinSlefChange',"");
      }});
      this.props.navigation.setParams({img:UImage.fav_h,onPress:this.onPress});
      EasyToast.show("已加入自选")
    }
    
  }

  state = {
    selectedSegment:"1小时",
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const c = this.props.navigation.state.params.coins;
    this.fetchLine(1,'1小时');
    this.props.dispatch({type: 'coinLine/info',payload:{id:c.id}});
  }
  componentWillUnmount(){
    //结束页面前，资源释放操作
    super.componentWillUnmount();
    
  }
  fetchLine(type,opt){
    this.setState({selectedSegment:opt});
    const {dispatch} =  this.props;
    const c = this.props.navigation.state.params.coins;
    InteractionManager.runAfterInteractions(() => {
      dispatch({type:'coinLine/list',payload:{coin:c.name,type}});
    });
  }

  setSelectedOption(opt){
    if(opt=="5分钟"){
      type=0;
      this.fetchLine(0,opt);
    }else if(opt=="1小时"){
      type=1;
      this.fetchLine(1,opt);
    }else if(opt=="6小时"){
      type=2;
      this.fetchLine(2,opt);
    }else if(opt=="24小时"){
      type=3;
      this.fetchLine(3,opt);
    }
  }

  render() {
    const c = this.props.navigation.state.params.coins;
    return <View style={styles.container}>
     <ScrollView style={styles.scrollView}>
      <View>
        {
          (<View>
            <View style={styles.row}>
              <View style={{width:'30%'}}>
                 <View style={{ flex:1,flexDirection:"row",alignItems: 'center',paddingTop:0}}>
                    <Image source={{uri:c.img}} style={{width: ScreenUtil.autowidth(25),height: ScreenUtil.autowidth(25)}} />
                    <View>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{marginLeft: ScreenUtil.autowidth(20),fontSize: ScreenUtil.setSpText(18),color:UColor.fontColor}}>{c.name}</Text>
                        <Text style={{fontSize: ScreenUtil.setSpText(14),color:UColor.arrow,marginTop: ScreenUtil.autoheight(3)}}>{c.name.toUpperCase()=="EOS"?"/USDT":"/EOS"}</Text>
                      </View>
                      <Text style={{marginLeft: ScreenUtil.autowidth(20),fontSize: ScreenUtil.setSpText(14),color: UColor.arrow}}>bigone</Text>
                    </View>
                  </View>
              </View>
              <View style={{width:'70%'}}>
                <View style={{flex:1,flexDirection:"row",alignItems: 'center',justifyContent:"flex-end"}}>
                  <View style={{flex:1,flexDirection:"column",alignItems:'flex-end',paddingTop:0}}>
                    <Text style={{fontSize: ScreenUtil.setSpText(12),color:UColor.fontColor}}>$ {c.usd}</Text>
                    <Text style={{marginTop: ScreenUtil.autoheight(5),fontSize: ScreenUtil.setSpText(16),color:UColor.arrow}}>≈  ￥{c.price}</Text>
                  </View>
                  <Text style={c.increase>0?styles.incdo:styles.incup}>{c.increase>0?'+'+c.increase:c.increase}%</Text>
                </View>
              </View>
          </View>
          <View style={{flex:1,flexDirection:'row',marginTop: ScreenUtil.autoheight(30)}}>
            <View style={{flexDirection:"column",flexGrow:1}}>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(11),textAlign:'center'}}>开盘</Text>
              <Text style={{color:UColor.fontColor,fontSize: ScreenUtil.setSpText(15),marginTop: ScreenUtil.autoheight(20),textAlign:'center'}}>{c.start}</Text>
            </View>
            <View style={{flexDirection:"column",flexGrow:1}}>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(11),textAlign:'center'}}>最高</Text>
              <Text style={{color:UColor.fontColor,fontSize: ScreenUtil.setSpText(15),marginTop: ScreenUtil.autoheight(20),textAlign:'center'}}>{c.max}</Text>
            </View>
            <View style={{flexDirection:"column",flexGrow:1}}>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(11),textAlign:'center'}}>最低</Text>
              <Text style={{color:UColor.fontColor,fontSize: ScreenUtil.setSpText(15),marginTop: ScreenUtil.autoheight(20),textAlign:'center'}}>{c.min}</Text>
            </View>
            <View style={{flexDirection:"column",flexGrow:1}}>
              <Text style={{color: UColor.arrow,fontSize: ScreenUtil.setSpText(11),textAlign:'center'}}>成交量</Text>
              <Text style={{color:UColor.fontColor,fontSize: ScreenUtil.setSpText(15),marginTop: ScreenUtil.autoheight(20),textAlign:'center'}}>{formatterNumber(c.txs)}</Text>
            </View>
          </View>
          </View>
          )
        }
        <View style={{padding: ScreenUtil.autowidth(20),paddingTop:ScreenUtil.autoheight(30)}}>
          <SegmentedControls 
          tint= {UColor.tintColor} selectedTint= {UColor.fontColor}
          onSelection={this.setSelectedOption.bind(this) }
          selectedOption={ this.state.selectedSegment }
          backTint= {UColor.secdColor} options={['5分钟','1小时','6小时','24小时']} />
        </View>
        <View style={{flex:1,paddingTop:ScreenUtil.autoheight(10)}}>
          {
            <Echarts option={this.props.lineDatas?this.props.lineDatas:{}} width={ScreenWidth} height={ScreenUtil.autoheight(200)} />
          }
        </View>
        <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
            <View style={{width: ScreenUtil.autowidth(8),height: ScreenUtil.autowidth(8),borderRadius:4,backgroundColor:UColor.tintColor}}></View>
            <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(11),marginLeft: 5}}>价格走势</Text>
            <View style={{width: ScreenUtil.autowidth(8),height: ScreenUtil.autowidth(8),borderRadius:4,backgroundColor:UColor.arrow,marginLeft: ScreenUtil.autowidth(10)}}></View>
            <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(11),marginLeft:5}}>交易量</Text>
        </View>
        <View>
           <Text style={{color:UColor.arrow,fontSize:ScreenUtil.setSpText(15),marginLeft: ScreenUtil.autowidth(15),margin: ScreenUtil.autowidth(10),marginTop: ScreenUtil.autoheight(20)}}>综合信息</Text>
           <View style={{paddingLeft: ScreenUtil.autowidth(15),paddingVertical: ScreenUtil.autoheight(15),paddingRight: ScreenUtil.autowidth(5),backgroundColor:UColor.mainColor}}>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(12)}}>{this.props.info.intr}</Text>
           </View>
           <View style={{height:0.5,backgroundColor:UColor.secdColor}} />
           <View style={{padding: ScreenUtil.autowidth(15),backgroundColor:UColor.mainColor,flexDirection:'row',justifyContent:"space-between"}}>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(12),justifyContent:"flex-start"}}>市值</Text>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(12),justifyContent:"flex-end"}}>${formatterUnit(c.value)}</Text>
           </View>
           <View style={{height:0.5,backgroundColor:UColor.secdColor}} />
           <View style={{padding: ScreenUtil.autowidth(15),backgroundColor:UColor.mainColor,flexDirection:'row',justifyContent:"space-between"}}>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(12),justifyContent:"flex-start"}}>发行总量</Text>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(12),justifyContent:"flex-end"}}>{formatterNumber(this.props.info.total)}</Text>
           </View>
           <View style={{height:0.5,backgroundColor:UColor.secdColor}} />
           <View style={{padding: ScreenUtil.autowidth(15),backgroundColor:UColor.mainColor,flexDirection:'row',justifyContent:"space-between"}}>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(12)}}>流通量</Text>
              <Text style={{color:UColor.arrow,fontSize: ScreenUtil.setSpText(12)}}>{formatterNumber(this.props.info.marke)}</Text>
           </View>
        </View>
      </View>
    </ScrollView>
  </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: UColor.secdColor,
  },
  scrollView: {
   
  },
  row:{
    flex:1,
    backgroundColor:UColor.mainColor,
    flexDirection:"row",
    padding: ScreenUtil.autowidth(20),
    borderBottomColor: UColor.secdColor,
    borderBottomWidth: 0.6,
  
  },
  left:{
    width:'25%',
    flex:1,
    flexDirection:"column"
  },
  right:{
    width:'85%',
    flex:1,
    flexDirection:"column"
  },
  incup:{
    fontSize: ScreenUtil.setSpText(12),
    color:UColor.fontColor,
    backgroundColor: UColor.riseColor,
    padding: ScreenUtil.autowidth(5),
    textAlign:'center',
    marginLeft: ScreenUtil.autowidth(10),
    borderRadius:5,
    minWidth: ScreenUtil.autowidth(60),
  },
  incdo:{
    fontSize: ScreenUtil.setSpText(12),
    color:UColor.fontColor,
    backgroundColor: UColor.fallColor,
    padding: ScreenUtil.autowidth(5),
    textAlign:'center',
    marginLeft: ScreenUtil.autowidth(10),
    borderRadius:5,
    minWidth: ScreenUtil.autowidth(60)
  }
});

export default CoinDetail;
