import React, { Component } from 'react';

let item = {Title: '', PubDate: '', Description:'Press Enter Key to select a video', Url: ''} //Inicialate item with empty values, so I don't get error displaying empty item

class videoInfo extends Component {


	render() {
	
		if(this.props.show){
			if(this.refs.player.currentSrc !== this.props.showItem.Url){
				item = this.props.showItem
				this.refs.player.load();
			}
		}
		
		return (
			<div className="card col2">
				<video 
					ref="player"
					controls
					width="100%"
					autoPlay>
					<source src={item.Url}></source>
				</video>
				<div className="card-body">
					<h3 className="card-text ">{item.Title}</h3>
					<p className="card-text">{item.Description}</p>
				</div>
			</div>

		)
	}
}

export default videoInfo
