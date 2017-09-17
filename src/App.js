import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
//import { Route } from 'react-router-dom'
import $ from 'jquery'
import VideoInfo from './VideoInfo'
import News from './News'

let oldpub = new Date(Date.now())

class App extends Component {

	constructor(props){
		super(props);
		
		this.state = {
			Title: '', 
			Description : '', 
			Animation: '',
			Items : [], 
			showItems: [],
			cursor: 1000, //We don't have problems with negative numbers
			show: false,
			showItem: {}
		};
		this.getRSS = this.getRSS.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this)

	}

	getRSS = (url) => {
		
		$.ajax({
			crossOrigin: true,
			type: "GET",
			url: "https://cors-anywhere.herokuapp.com/" + url,
			dataType: "xml",
			beforeSend: function(req) {
				//req.setRequestHeader("Accept", "text/xml");
			},success: function (text) {
			},
			error: function (xml) {
				alert(xml.status + ' ' + xml.statusText);
			}
		}).then(function(text) {
			this.setState({ Title : text.getElementsByTagName("title")[0].innerHTML })
			this.setState({ Description : text.getElementsByTagName("description")[0].innerHTML.replace('<![CDATA[','').replace(']]>','') })//remove xml characters
			const items = text.getElementsByTagName("item")
			
			for(let i = 0; i < items.length; i++){ //Store in the state every item indicidually
				const title = items[i].getElementsByTagName("title")[0].innerHTML
				const description = items[i].getElementsByTagName("description")[0].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>')
				const pubdate = items[i].getElementsByTagName("pubDate")[0].innerHTML
				oldpub = new Date(pubdate) > new Date(oldpub) ? new Date(oldpub) : new Date(pubdate)
				const url = items[i].getElementsByTagName("enclosure")[0].attributes["url"].value
				const item = {Title: title, Description : description.substring(0, description.indexOf('<')), PubDate: pubdate, Url: url} //Remove lins from description
				this.setState({Items: this.state.Items.concat(item)})//Updating state
				this.setState({cursor: this.state.Items.length*200})//Start cursor in last news but no problem with negative
			}
			console.log(oldpub)
			this.setState({showItems: [this.state.Items[this.state.Items.length-1], this.state.Items[0], this.state.Items[1]]})//Updating state

		}.bind(this))

	}

	componentWillMount() {
		//this.getRSS("http://rss.cnn.com/services/podcasting/studentnews/rss?format=xml")
		//this.getRSS("http://rss.cnn.com/services/podcasting/ac360/rss.xml?format=xml")
		this.getRSS("http://rss.cnn.com/services/podcasting/fareedzakaria_audio/rss.xml?format=xml")//If you don't specific format, you get html format
		document.body.onkeydown = function(e){this.handleKeyDown(e)}.bind(this)//Keyboard interaction
		document.body.onclick = function(e){this.onClick()}.bind(this)//Keyboard interaction
	}
	onClick = () => {
		/*onClick provide information everytime the user click with their mouse*/
		if(document.body.getElementsByClassName('alert alert-primary').length === 0){
			const info = document.createElement('div')
			info.className = 'alert alert-primary'
			info.role = 'alert'
			info.innerHTML = 'Please, use your keyboard to interact with the application. <strong>UP/DOWN/ENTER KEYS</strong>'
			document.body.getElementsByClassName('col')[1].appendChild(info)
			setTimeout(function(){
				document.body.getElementsByClassName('alert alert-primary')[0].remove();
			},2000);
		}
	}
	handleKeyDown = (e) => {
		/* arrow up/down button should select next/previous list element*/
		if (e.keyCode === 38) {//Up Key
			this.setState( prevState => ({
				cursor: prevState.cursor - 1
			}))		
			this.setState({Animation: 'goUp'}) 

		} 
		else if (e.keyCode === 40) {//Down key
			this.setState( prevState => ({
				cursor: prevState.cursor + 1
			}))
			this.setState({Animation: 'goDown'}) 

		}else if (e.keyCode === 13) {//Enter key
			this.setState({show: true, showItem: this.state.Items[(this.state.cursor)%this.state.Items.length]}) 
			
		}
		const cursorBase = (this.state.cursor)%this.state.Items.length 
		
		if(cursorBase === 0){//I set state showItems, in order to do a intuitive roulette to show the news. Special cases when cursor gets to 0 or to the max length
			this.setState({showItems: [this.state.Items[this.state.Items.length-1], this.state.Items[0], this.state.Items[1]]})
		}else if(cursorBase === this.state.Items.length-1){
			this.setState({showItems: [this.state.Items[this.state.Items.length-2], this.state.Items[this.state.Items.length-1], this.state.Items[0]]})
		}else{
			this.setState({showItems: [this.state.Items[cursorBase-1] , this.state.Items[cursorBase], this.state.Items[cursorBase+1]]})
		}
	}

  render() {
	
    return (
		<div className="container">
			<div className="jumbotron jumbotron-fluid">
			  <div className="container title">
				<h1 className="display-5">{this.state.Title}</h1>
				<p className="lead">{this.state.Description}</p>
			  </div>
			</div>
			<div className="row">
				<div className="col">
					<div className="arrow-up"></div>
					<div className="card">
					{this.state.showItems
						.map((item, i) => (
							<News
								i={i}
								item={item}
								oldpub={oldpub}
								key={i}

							/>
					))}
					</div>
					<div className="arrow-down"></div>
				</div>
				<div className="col">
					<VideoInfo
						showItem={this.state.showItem}
						show={this.state.show}
					/>
				</div>
			</div>
		</div>   
	);
  }
}

export default App;
