import React, { Component } from 'react'
import { Link } from 'historypp-react-router'
import openDialog from 'dialogspp'
import BottomSheet from 'dialogspp/bottomsheet'
import FullScreenPage from 'dialogspp/fullscreenpage'
import contextmenu from 'dialogspp/contextmenu'
import axios from 'axios'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      ...this.props.state,
    }
    this.openDetail = this.openDetail.bind(this)
    this.divref = React.createRef()
    this.openSettings = this.openSettings.bind(this)
  }

  //Loads initial data for page (is static to be used on server side rendering)
  static async initialData(params){
    try {
      return {
        ...(await axios.get('https://worldtimeapi.org/api/timezone/'+params.id)).data,
        initialDataLoaded: true
      }
    } catch (e) {
      return {
        initialDataError: true,
      }
    }
  }

  //data could be received from saved state managed from router
  async componentDidMount(){
    //Context menu options
    const options = [
      {label:"Primera",value:"one",action:()=>{}},
      {label:"Segunda",value:"two"},
      {label:"OPEN SETTINGS (try this)",action:()=>{this.openSettings()}},
      {label:"Cuarta",anyData:1234},
      {label:"Quinta",num:"five",action:()=>{}},
      {label:"Sexta"},
      'Only label option',
      'Only label option 2',
      undefined
    ]

    this.divref.current.addEventListener('contextmenu', event => {
      event.preventDefault()
      contextmenu(
        event,
        options,
        e => {
          if(e.num == 'five') {alert('five');return;}
          if(e.label == 'OPEN SETTINGS (try this)') return;
          alert('Clicked: '+e.label)
        }
      )
    })

    //Check initial data
    if(!this.state.initialDataLoaded){ //initialDataLoaded is used to know if the data is loaded
      const initialData = await Home.initialData(this.props.params)
      this.setState({...initialData})
    }
  }

  componentDidUpdate(){
    //Saves data to router state manager
    this.props.saveState(this.state)
  }

  openSettings(){
    openDialog(this.props.history, props => {
      return <FullScreenPage {...props}>
        <h2>Settings dialog</h2>
        <span onClick={()=>{history.back()}}>[close]</span>(same as click back on browser button)
      </FullScreenPage>
    },this.props.history.url+"/details/share")
  }

  openDetail(){
    this.detailsDialogInstance = openDialog(this.props.history, props => {
      const close = props.close
      return <div style={{border:"1px solid grey",padding:"10px", minWidth:"200px"}}>
        <button type="button" onClick={close} style={{float:"right"}}>CLOSE</button>
        <table>
          <tr>
            <td>abbreviation:</td>
            <td>{this.state.abbreviation}</td>
          </tr>
          <tr>
            <td>client_ip:</td>
            <td>{this.state.client_ip}</td>
          </tr>
          <tr>
            <td>day_of_week:</td>
            <td>{this.state.day_of_week}</td>
          </tr>
          <tr>
            <td>day_of_year:</td>
            <td>{this.state.day_of_year}</td>
          </tr>
          <tr>
            <td>unixtime:</td>
            <td>{this.state.unixtime}</td>
          </tr>
          <tr>
            <td>utc_datetime:</td>
            <td>{this.state.utc_datetime}</td>
          </tr>
        </table>
        <button type="button" onClick={e => {
          openDialog(this.props.history, props => {
            return <BottomSheet {...props}>
              <button type="button" onClick={props.close} style={{float:"right"}}>CLOSE</button>
              <button type="button" onClick={close} style={{float:"right"}}>CLOSE DETAILS</button>
              <p><a href="https://www.facebook.com/">Facebook</a></p>
              <p><a href="https://twitter.com/home">Twitter</a></p>
              <br/>
              <p>Click one and then go back (return to here) and then click {'"< back"'} button</p>
            </BottomSheet>
          },this.props.history.url+"/details/share")
        }}>SHARE</button>
      </div>
    },this.props.history.url+"/details")
  }

  render(){
    const loading = !this.state.initialDataLoaded && !this.state.initialDataError
    return (<div ref={this.divref}>
      Timezone: {this.state.timezone}
      <br/>
      DO RIGHT CLICK
      <br/>
      Actual time: {this.state.initialDataLoaded && this.state.datetime}
      {this.state.initialDataError && "Error loading data"}{loading && "Loading..."}
      <br/>
      {this.state.initialDataLoaded && <button type="button" onClick={this.openDetail}>More detail</button>}
      <br/>
      <Link to="/timezones">Timezones</Link>
      <br/>
      <button type="button" onClick={e => this.props.history.back()}>{'< Back'}</button>
    </div>)
  }
}
